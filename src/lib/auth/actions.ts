"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

/**
 * Connexion par email + mot de passe.
 * En cas de succès : redirection vers l'espace personnel.
 */
export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Merci de renseigner votre email et votre mot de passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  revalidatePath("/", "layout");
  redirect("/mon-compte");
}

/**
 * Inscription : crée le compte Supabase Auth. Le déclencheur SQL
 * `handle_new_user` crée ensuite automatiquement le profil + la carte.
 * Les champs nom/prenom sont passés en métadonnées et relus par le trigger.
 */
export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const nom = String(formData.get("nom") ?? "").trim();
  const prenom = String(formData.get("prenom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nom || !prenom || !email || !password) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nom, prenom } },
  });

  if (error) {
    return { error: error.message };
  }

  // Si la confirmation par email est activée, aucune session n'est créée
  // tant que le client n'a pas cliqué sur le lien reçu.
  if (!data.session) {
    return {
      message:
        "Compte créé ! Vérifiez votre boîte mail pour confirmer votre inscription.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/mon-compte");
}

/** Déconnexion puis retour à la page de connexion. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/connexion");
}
