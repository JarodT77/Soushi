import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import Scanner from "./scanner";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-[#282522]/90 p-8 shadow-2xl backdrop-blur animate-fade-up">
        <h1 className="text-center font-script text-4xl text-[#d8b79f]">
          Studio Socheata
        </h1>
        <p className="mt-1 text-center text-sm uppercase tracking-widest text-white/50">
          Espace salon — scanner une carte
        </p>

        <p className="mx-auto mt-6 mb-6 max-w-xs text-center text-sm text-white/70">
          Scannez le QR code présenté par la cliente pour ajouter un passage.
        </p>

        <Scanner />

        <p className="mt-8 text-center">
          <Link href="/mon-compte" className="text-xs text-white/40 hover:underline">
            ← Retour à mon compte
          </Link>
        </p>
      </div>
    </main>
  );
}
