import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { calculFidelite } from "@/lib/fidelite";
import { ajouterPassage, validerRecompense } from "@/lib/admin/actions";

// Code court de carte : 6 caractères (lettres/chiffres, sans O/0/I/1/L).
const CODE_REGEX = /^[A-Z2-9]{6}$/;

export default async function CarteAdminPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: codeParam } = await params;
  const code = codeParam.toUpperCase();
  const { supabase } = await requireAdmin();

  const codeValide = CODE_REGEX.test(code);

  const { data: carte } = codeValide
    ? await supabase
        .from("cartes_fidelite")
        .select("id, code, nombre_de_passage, recompenses_utilisees")
        .eq("code", code)
        .single()
    : { data: null };

  const { data: client } = carte
    ? await supabase
        .from("utilisateurs")
        .select("prenom, nom, email")
        .eq("carte_id", carte.id)
        .single()
    : { data: null };

  const fidelite = carte
    ? calculFidelite(carte.nombre_de_passage, carte.recompenses_utilisees)
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur animate-fade-up">
        {!carte || !fidelite ? (
          <div className="text-center">
            <p className="text-lg font-medium text-neutral-800">Carte introuvable</p>
            <p className="mt-2 text-sm text-neutral-500">
              Le code <span className="font-mono">{code}</span> ne correspond à
              aucune carte de fidélité.
            </p>
            <Link
              href="/admin"
              className="mt-6 inline-block rounded-lg bg-[#936b55] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#7c5a47]"
            >
              Scanner à nouveau
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-xs uppercase tracking-widest text-neutral-500">
              Carte de fidélité
            </p>
            <h1 className="mt-1 text-center font-script text-4xl text-[#936b55]">
              {client?.prenom} {client?.nom}
            </h1>
            {client?.email && (
              <p className="mt-1 text-center text-xs text-neutral-400">
                {client.email}
              </p>
            )}
            <p className="mt-1 text-center font-mono text-xs tracking-widest text-neutral-400">
              {carte.code}
            </p>

            {/* État des tampons */}
            <div className="mt-8">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm text-neutral-600">Tampons</span>
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
            </div>

            {/* Récompense disponible */}
            {fidelite.recompensesDisponibles > 0 && (
              <div className="mt-6 rounded-xl bg-[#936b55]/10 px-4 py-3">
                <p className="text-center text-sm font-medium text-[#7c5a47]">
                  🎁 {fidelite.recompensesDisponibles} récompense
                  {fidelite.recompensesDisponibles > 1 ? "s" : ""} disponible
                  {fidelite.recompensesDisponibles > 1 ? "s" : ""}
                </p>
                <form action={validerRecompense} className="mt-3">
                  <input type="hidden" name="carteId" value={carte.id} />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#7c5a47] py-2.5 text-sm font-medium text-white transition hover:bg-[#634636]"
                  >
                    Valider une récompense
                  </button>
                </form>
              </div>
            )}

            {/* Ajouter un passage */}
            <form action={ajouterPassage} className="mt-6">
              <input type="hidden" name="carteId" value={carte.id} />
              <button
                type="submit"
                className="w-full rounded-lg bg-[#936b55] py-3 font-medium text-white transition hover:bg-[#7c5a47]"
              >
                + Ajouter un passage
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-neutral-400">
              Total de passages : {fidelite.total}
            </p>

            <Link
              href="/admin"
              className="mt-6 block text-center text-xs text-neutral-400 hover:underline"
            >
              ← Scanner une autre carte
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
