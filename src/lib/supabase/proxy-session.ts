import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Rafraîchit la session Supabase à chaque requête et propage les cookies
 * mis à jour, à la fois vers la requête (pour les Composants Serveur en aval)
 * et vers la réponse (pour le navigateur).
 *
 * Appelé depuis `src/proxy.ts` (convention Next.js 16, ex-`middleware`).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT : ne pas exécuter de code entre la création du client et
  // getUser(), sinon la session peut être aléatoirement invalidée.
  await supabase.auth.getUser();

  return response;
}
