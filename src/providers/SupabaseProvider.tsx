"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useSession } from "@clerk/nextjs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

interface SupabaseContextType {
  supabase: SupabaseClient | null;
  session: ReturnType<typeof useSession>["session"];
  isLoaded: boolean;
  token: string | null;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  session: null,
  isLoaded: false,
  token: null,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoaded } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Use session ID as a stable dependency instead of the whole session object
  const sessionId = session?.id || null;

  useEffect(() => {
    if (!isLoaded) return;

    // Skip if session hasn't changed
    if (sessionIdRef.current === sessionId && clientRef.current) {
      return;
    }

    const createSupabaseClient = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables");
        return;
      }

      // Get Clerk JWT token (handle missing template gracefully)
      let jwtToken: string | null = null;
      try {
        jwtToken = session
          ? await session.getToken({ template: "supabase" })
          : null;
      } catch {
        // Template doesn't exist - continue without token
        // RLS will still work if user_id is set correctly
        console.warn(
          "Clerk JWT template 'supabase' not found, continuing without token"
        );
      }

      const client = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: jwtToken
            ? {
                Authorization: `Bearer ${jwtToken}`,
              }
            : {},
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      clientRef.current = client;
      sessionIdRef.current = sessionId;
      setSupabase(client);
      setToken(jwtToken);

      // Expose JWT token to window for quickbot widget access
      if (typeof window !== "undefined") {
        (
          window as { __QUICKBOT_JWT_TOKEN__?: string | null }
        ).__QUICKBOT_JWT_TOKEN__ = jwtToken;
      }
    };

    createSupabaseClient();
  }, [sessionId, isLoaded, session]);

  const contextValue = useMemo(
    () => ({ supabase, session, isLoaded, token }),
    [supabase, session, isLoaded, token]
  );

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }
  return context;
}
