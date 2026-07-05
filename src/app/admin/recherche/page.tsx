import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { calculFidelite } from "@/lib/fidelite";

type Carte = {
  id: string;
  code: string;
  nombre_de_passage: number;
  recompenses_utilisees: number;
};

export default async function RechercheClientPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { q: qBrut } = await searchParams;

  // Nettoie la saisie pour ne pas casser la syntaxe du filtre PostgREST.
  const q = (qBrut ?? "").replace(/[,()*%\\]/g, "").trim();

  let clients:
    | {
        id: string;
        nom: string | null;
        prenom: string | null;
        email: string | null;
        role: string;
        carte_id: string | null;
      }[]
    | null = null;

  const cartesMap = new Map<string, Carte>();

  if (q.length >= 1) {
    const { data } = await supabase
      .from("utilisateurs")
      .select("id, nom, prenom, email, role, carte_id")
      .or(`nom.ilike.*${q}*,prenom.ilike.*${q}*`)
      .order("nom", { ascending: true })
      .limit(30);

    clients = data ?? [];

    const carteIds = clients
      .map((c) => c.carte_id)
      .filter((id): id is string => Boolean(id));

    if (carteIds.length > 0) {
      const { data: cartes } = await supabase
        .from("cartes_fidelite")
        .select("id, code, nombre_de_passage, recompenses_utilisees")
        .in("id", carteIds);

      (cartes ?? []).forEach((c) => cartesMap.set(c.id, c as Carte));
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#282522]/70 p-8 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-script text-4xl text-[#ffb289]">
                Rechercher un client
              </h1>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/50">
                Espace salon
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 transition hover:bg-white/20"
            >
              Scanner
            </Link>
          </div>

          {/* Barre de recherche (formulaire GET) */}
          <form method="get" className="mt-8 flex gap-2">
            <input
              name="q"
              defaultValue={q}
              autoFocus
              placeholder="Nom ou prénom du client…"
              className="flex-1 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#ffb289] focus:bg-white/15 focus:ring-2 focus:ring-[#ffb289]/30"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#ffb289] px-6 py-2.5 text-sm font-medium text-[#282522] transition hover:bg-[#ff9e6d]"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Résultats */}
        <div className="mt-6 space-y-4">
          {clients === null && (
            <p className="px-2 text-center text-sm text-white/50">
              Saisissez un nom pour afficher les clients correspondants.
            </p>
          )}

          {clients !== null && clients.length === 0 && (
            <p className="px-2 text-center text-sm text-white/50">
              Aucun client ne correspond à « {q} ».
            </p>
          )}

          {clients?.map((client) => {
            const carte = client.carte_id
              ? cartesMap.get(client.carte_id)
              : undefined;
            const fidelite = carte
              ? calculFidelite(carte.nombre_de_passage, carte.recompenses_utilisees)
              : null;

            return (
              <div
                key={client.id}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 text-white backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">
                      {client.prenom} {client.nom}
                      {client.role === "admin" && (
                        <span className="ml-2 rounded-full bg-[#ffb289]/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#ffb289]">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-white/50">{client.email}</p>
                  </div>
                  {carte && (
                    <span className="shrink-0 font-mono text-sm tracking-widest text-white/70">
                      {carte.code}
                    </span>
                  )}
                </div>

                {fidelite && carte ? (
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="text-white/70">
                      Tampons :{" "}
                      <span className="font-semibold text-[#ffb289]">
                        {fidelite.tamponsActuels} / {fidelite.objectif}
                      </span>
                    </span>
                    <span className="text-white/70">
                      Récompenses dispo :{" "}
                      <span className="font-semibold text-[#ffb289]">
                        {fidelite.recompensesDisponibles}
                      </span>
                    </span>
                    <span className="text-white/50">
                      Total passages : {fidelite.total}
                    </span>
                    <Link
                      href={`/admin/carte/${carte.code}`}
                      className="ml-auto rounded-lg bg-[#ffb289] px-4 py-2 text-xs font-medium text-[#282522] transition hover:bg-[#ff9e6d]"
                    >
                      Ouvrir la carte
                    </Link>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/40">
                    Aucune carte de fidélité associée.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center">
          <Link
            href="/mon-compte"
            className="text-xs text-white/40 hover:underline"
          >
            ← Retour à mon compte
          </Link>
        </p>
      </div>
    </main>
  );
}
