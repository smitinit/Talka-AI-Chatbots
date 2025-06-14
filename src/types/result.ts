export type Result<T = null> =
  | { ok: true; data: T }
  | { ok: false; message: string };
