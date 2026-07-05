import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase à utiliser dans les Composants Serveur, Server Actions
 * et Route Handlers. La session est lue/écrite via les cookies de la requête.
 *
 * Sous Next.js 16, `cookies()` est asynchrone → on l'attend avant usage.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Composant Serveur : l'écriture de cookies y est
            // interdite. C'est sans danger si le `proxy` rafraîchit la session.
          }
        },
      },
    }
  );
}
