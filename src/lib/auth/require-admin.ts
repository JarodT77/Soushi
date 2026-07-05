import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Garde d'accès pour les pages du salon. Redirige vers /connexion si non
 * connecté, ou vers /mon-compte si l'utilisateur n'est pas admin.
 * Renvoie le client Supabase déjà instancié pour éviter de le recréer.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profil } = await supabase
    .from("utilisateurs")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profil?.role !== "admin") {
    redirect("/mon-compte");
  }

  return { supabase, user };
}
