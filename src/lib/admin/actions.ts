"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Ajoute un passage (+1 tampon) sur la carte scannée. Réservé aux admins. */
export async function ajouterPassage(formData: FormData): Promise<void> {
  const carteId = String(formData.get("carteId") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.rpc("ajouter_passage", { carte: carteId });
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/carte/${carteId}`);
}

/** Valide (consomme) une récompense disponible sur la carte. Réservé aux admins. */
export async function validerRecompense(formData: FormData): Promise<void> {
  const carteId = String(formData.get("carteId") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.rpc("valider_recompense", { carte: carteId });
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/carte/${carteId}`);
}
