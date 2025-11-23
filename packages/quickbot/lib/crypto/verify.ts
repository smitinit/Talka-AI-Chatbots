// quickbot/src/lib/crypto/verify.ts

/**
 * Client-side ECDSA P-256 verification for the QuickBot widget.
 *
 * The server signs the canonical JSON config with its ECDSA private key.
 * The widget verifies the signature with NEXT_PUBLIC_QUICKBOT_PUBLIC_KEY.
 *
 * Signature format: base64-encoded ASN.1 DER
 * Algorithm: ECDSA (P-256) with SHA-256
 */

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

/** Converts a base64 string → Uint8Array */
function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/* ---------------------------------------------
   Canonical JSON stringifier (deterministic)
--------------------------------------------- */

function canonicalJSONStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);

  if (Array.isArray(obj)) {
    return "[" + obj.map((v) => canonicalJSONStringify(v)).join(",") + "]";
  }

  const record = obj as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  const entries = keys.map(
    (k) => JSON.stringify(k) + ":" + canonicalJSONStringify(record[k])
  );
  return "{" + entries.join(",") + "}";
}

/* ---------------------------------------------
   ECDSA Verify Function
--------------------------------------------- */

/**
 * Converts ASN.1 DER ECDSA signature to raw r||s format (64 bytes)
 * Web Crypto API expects r and s as 32-byte big-endian integers concatenated
 */
function derToRaw(derBytes: Uint8Array): Uint8Array {
  // ASN.1 DER structure: SEQUENCE { INTEGER r, INTEGER s }
  // We need to extract r and s, pad them to 32 bytes each, and concatenate

  if (derBytes.length < 8) {
    throw new Error(
      `Invalid DER signature: too short (${derBytes.length} bytes)`
    );
  }

  if (derBytes[0] !== 0x30) {
    throw new Error(
      `Invalid DER signature: expected SEQUENCE (0x30), got 0x${derBytes[0].toString(
        16
      )}`
    );
  }

  let pos = 2; // Skip SEQUENCE tag and length byte

  // Read r INTEGER
  if (pos >= derBytes.length || derBytes[pos] !== 0x02) {
    throw new Error(
      `Invalid DER signature: expected INTEGER (0x02) for r at position ${pos}`
    );
  }
  pos++;
  if (pos >= derBytes.length) {
    throw new Error("Invalid DER signature: missing r length");
  }
  const rLength = derBytes[pos++];
  if (pos + rLength > derBytes.length) {
    throw new Error(
      `Invalid DER signature: r length (${rLength}) exceeds remaining bytes`
    );
  }
  let rBytes = derBytes.slice(pos, pos + rLength);
  pos += rLength;

  // Read s INTEGER
  if (pos >= derBytes.length || derBytes[pos] !== 0x02) {
    throw new Error(
      `Invalid DER signature: expected INTEGER (0x02) for s at position ${pos}`
    );
  }
  pos++;
  if (pos >= derBytes.length) {
    throw new Error("Invalid DER signature: missing s length");
  }
  const sLength = derBytes[pos++];
  if (pos + sLength > derBytes.length) {
    throw new Error(
      `Invalid DER signature: s length (${sLength}) exceeds remaining bytes`
    );
  }
  let sBytes = derBytes.slice(pos, pos + sLength);

  // Remove leading zero padding if present (DER encoding adds 0x00 if high bit is set)
  if (rBytes.length > 0 && rBytes[0] === 0x00 && rBytes.length > 1) {
    rBytes = rBytes.slice(1);
  }
  if (sBytes.length > 0 && sBytes[0] === 0x00 && sBytes.length > 1) {
    sBytes = sBytes.slice(1);
  }

  // Validate lengths (should be <= 32 bytes each)
  if (rBytes.length > 32) {
    throw new Error(
      `Invalid DER signature: r is too long (${rBytes.length} bytes, max 32)`
    );
  }
  if (sBytes.length > 32) {
    throw new Error(
      `Invalid DER signature: s is too long (${sBytes.length} bytes, max 32)`
    );
  }

  // Pad to 32 bytes with leading zeros if needed
  const rPadded = new Uint8Array(32);
  const sPadded = new Uint8Array(32);
  rPadded.set(rBytes, 32 - rBytes.length);
  sPadded.set(sBytes, 32 - sBytes.length);

  // Concatenate r || s
  const raw = new Uint8Array(64);
  raw.set(rPadded, 0);
  raw.set(sPadded, 32);
  return raw;
}

/**
 * Verifies ECDSA P-256 signature over the canonical JSON payload.
 *
 * @param payload - object that was signed by server
 * @param signatureBase64 - base64 DER ECDSA signature (ASN.1 format from Node.js)
 * @param publicKeyBase64 - base64url raw ECDSA P-256 public key (X9.62 uncompressed: 0x04 || 32-byte X || 32-byte Y)
 *
 * @returns true if signature is valid
 */
export async function verifyECDSASignature(
  payload: unknown,
  signatureBase64: string,
  publicKeyBase64: string
): Promise<boolean> {
  try {
    // Decode signature (ASN.1 DER format from Node.js)
    const signatureDerBytes = base64ToBytes(signatureBase64);

    // Convert ASN.1 DER to raw r||s format (64 bytes) for Web Crypto API
    const signatureRaw = derToRaw(signatureDerBytes);

    if (signatureRaw.length !== 64) {
      throw new Error(
        `Invalid signature length: expected 64 bytes, got ${signatureRaw.length}`
      );
    }

    // Create a new contiguous ArrayBuffer for the signature (Web Crypto API requires this)
    const signatureArrayBuffer = new ArrayBuffer(64);
    new Uint8Array(signatureArrayBuffer).set(signatureRaw);

    // Decode public key (base64url -> base64 if needed, then decode)
    // Handle both base64 and base64url encoding
    let publicKeyDecoded: string = publicKeyBase64;
    // Replace URL-safe characters if present
    publicKeyDecoded = publicKeyDecoded.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    while (publicKeyDecoded.length % 4) {
      publicKeyDecoded += "=";
    }

    const publicKeyBytes = base64ToBytes(publicKeyDecoded);

    // Verify public key format: should be 65 bytes (0x04 + 32-byte X + 32-byte Y)
    if (publicKeyBytes.length !== 65) {
      throw new Error(
        `Invalid public key format: expected 65 bytes, got ${publicKeyBytes.length} bytes`
      );
    }
    if (publicKeyBytes[0] !== 0x04) {
      throw new Error(
        `Invalid public key format: expected 0x04 prefix, got 0x${publicKeyBytes[0].toString(
          16
        )}`
      );
    }

    // Create a new ArrayBuffer to ensure proper format for Web Crypto API
    // Web Crypto API requires a contiguous ArrayBuffer, not a view
    const publicKeyBuffer = new ArrayBuffer(65);
    const publicKeyView = new Uint8Array(publicKeyBuffer);
    publicKeyView.set(publicKeyBytes);

    // Import ECDSA P-256 public key
    let key: CryptoKey;
    try {
      key = await crypto.subtle.importKey(
        "raw",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        false,
        ["verify"]
      );
    } catch (importError) {
      throw new Error(
        `Failed to import public key: ${
          importError instanceof Error
            ? importError.message
            : String(importError)
        }`
      );
    }

    // Canonical JSON (must match server's canonicalJSONStringify)
    const data = canonicalJSONStringify(payload);
    const encoded = new TextEncoder().encode(data);

    // Verify ECDSA (Web Crypto API expects raw r||s format, not DER)
    const ok = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      signatureArrayBuffer,
      encoded
    );

    return ok;
  } catch (err) {
    console.error("ECDSA verification failed:", err);
    return false;
  }
}
