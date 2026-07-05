import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { calculFidelite } from "@/lib/fidelite";

export default async function MonComptePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profil } = await supabase
    .from("utilisateurs")
    .select("nom, prenom, email, role, carte_id")
    .eq("id", user.id)
    .single();

  // Récupère la carte liée au profil.
  const { data: carte } = profil?.carte_id
    ? await supabase
        .from("cartes_fidelite")
        .select("id, code, nombre_de_passage, recompenses_utilisees")
        .eq("id", profil.carte_id)
        .single()
    : { data: null };

  const fidelite = calculFidelite(
    carte?.nombre_de_passage ?? 0,
    carte?.recompenses_utilisees ?? 0
  );

  // Génère le QR code (contenu = code court de la carte) en SVG, côté serveur.
  const qrSvg = carte?.code
    ? await QRCode.toString(carte.code, {
        type: "svg",
        margin: 0,
        color: { dark: "#282522", light: "#ffffff" },
      })
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-script text-4xl leading-none text-[#936b55]">
              {profil?.prenom}
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
              Carte de fidélité
            </p>
          </div>
          {profil?.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-full bg-[#282522] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#3d3833]"
            >
              Espace salon
            </Link>
          )}
        </div>

        {/* Récompense disponible */}
        {fidelite.recompensesDisponibles > 0 && (
          <div className="mt-6 rounded-xl bg-[#936b55]/10 px-4 py-3 text-center text-sm font-medium text-[#7c5a47]">
            🎁 {fidelite.recompensesDisponibles} récompense
            {fidelite.recompensesDisponibles > 1 ? "s" : ""} disponible
            {fidelite.recompensesDisponibles > 1 ? "s" : ""} — présentez votre carte
            en boutique
          </div>
        )}

        {/* Tampons */}
        <div className="mt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm text-neutral-600">Vos tampons</span>
            <span className="text-sm font-semibold text-[#936b55]">
              {fidelite.tamponsActuels} / {fidelite.objectif}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: fidelite.objectif }).map((_, i) => {
              const rempli = i < fidelite.tamponsActuels;
              return (
                <div
                  key={i}
                  className={`flex aspect-square items-center justify-center rounded-full border text-sm font-medium ${
                    rempli
                      ? "border-[#936b55] bg-[#936b55] text-white"
                      : "border-neutral-200 text-neutral-300"
                  }`}
                >
                  {rempli ? "✓" : i + 1}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-neutral-400">
            {fidelite.objectif} passages = 1 prestation offerte
          </p>
        </div>

        {/* QR code */}
        {qrSvg && (
          <div className="mt-8 flex flex-col items-center">
            <div
              className="h-44 w-44 [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            {carte?.code && (
              <p className="mt-3 font-mono text-lg tracking-[0.3em] text-[#282522]">
                {carte.code}
              </p>
            )}
            <p className="mt-2 max-w-60 text-center text-xs text-neutral-500">
              Présentez ce code à l&apos;accueil à chaque visite pour valider un
              passage.
            </p>
          </div>
        )}

        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-lg border border-[#936b55] py-3 text-sm font-medium text-[#936b55] transition hover:bg-[#936b55] hover:text-white"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </main>
  );
}
