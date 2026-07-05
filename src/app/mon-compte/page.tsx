import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
      <div className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        {/* Reflet de verre en haut */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
        {/* Halo lumineux discret */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#ffb289]/20 blur-3xl" />

        {profil?.role === "admin" && (
          <Link
            href="/admin"
            className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur transition hover:bg-white/20"
          >
            Espace salon
          </Link>
        )}

        {/* Logo + titre */}
        <div className="relative flex flex-col items-center">
          <Image
            src="/images/logo-studio-socheata.png"
            alt="Studio Socheata"
            width={737}
            height={243}
            priority
            className="h-auto w-44"
          />
          <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-white/60">
            Carte de fidélité
          </p>
          {profil?.prenom && (
            <p className="mt-4 font-script text-3xl text-[#ffb289]">
              Bonjour {profil.prenom}
            </p>
          )}
        </div>

        {/* Récompense disponible */}
        {fidelite.recompensesDisponibles > 0 && (
          <div className="mt-6 rounded-2xl border border-[#ffb289]/30 bg-[#ffb289]/15 px-4 py-3 text-center text-sm font-medium text-[#ffd9c2]">
            🎁 {fidelite.recompensesDisponibles} récompense
            {fidelite.recompensesDisponibles > 1 ? "s" : ""} disponible
            {fidelite.recompensesDisponibles > 1 ? "s" : ""} — présentez votre carte
            en boutique
          </div>
        )}

        {/* Tampons */}
        <div className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm text-white/70">Vos tampons</span>
            <span className="text-sm font-semibold text-[#ffb289]">
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
                      ? "border-[#ffb289] bg-[#ffb289] text-[#282522]"
                      : "border-white/25 text-white/40"
                  }`}
                >
                  {rempli ? "✓" : i + 1}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-white/50">
            {fidelite.objectif} passages = 1 prestation offerte
          </p>
        </div>

        {/* QR code (fond blanc pour rester scannable) */}
        {qrSvg && (
          <div className="mt-8 flex flex-col items-center">
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <div
                className="h-40 w-40 [&>svg]:h-full [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            </div>
            {carte?.code && (
              <p className="mt-4 font-mono text-xl tracking-[0.3em] text-white">
                {carte.code}
              </p>
            )}
            <p className="mt-2 max-w-60 text-center text-xs text-white/60">
              Présentez ce code à l&apos;accueil à chaque visite pour valider un
              passage.
            </p>
          </div>
        )}

        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-xl border border-white/30 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </main>
  );
}
