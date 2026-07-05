import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase à utiliser dans les Composants Client ("use client").
 * Il lit/écrit la session via les cookies du navigateur.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
