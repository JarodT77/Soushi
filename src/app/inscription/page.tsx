"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { signUp, type AuthState } from "@/lib/auth/actions";

const initialState: AuthState = {};

const inputClass =
  "w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 outline-none transition focus:border-[#ffb289] focus:bg-white/15 focus:ring-2 focus:ring-[#ffb289]/30";

export default function InscriptionPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        {/* Reflet de verre en haut */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
        {/* Halo lumineux discret */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#ffb289]/20 blur-3xl" />

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
            Créer sa carte de fidélité
          </p>
        </div>

        {state.message ? (
          <div className="mt-8 rounded-xl border border-[#ffb289]/30 bg-[#ffb289]/15 px-4 py-6 text-center text-sm text-[#ffd9c2]">
            {state.message}
          </div>
        ) : (
          <form action={formAction} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="mb-1 block text-sm text-white/70">
                  Prénom
                </label>
                <input id="prenom" name="prenom" type="text" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="nom" className="mb-1 block text-sm text-white/70">
                  Nom
                </label>
                <input id="nom" name="nom" type="text" required className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-white/70">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-white/70">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClass}
              />
              <p className="mt-1 text-xs text-white/50">Au moins 8 caractères.</p>
            </div>

            {state.error && (
              <p className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-2.5 text-sm text-red-100">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-[#ffb289] py-3 font-medium text-[#282522] transition hover:bg-[#ff9e6d] disabled:opacity-60"
            >
              {pending ? "Création…" : "Créer mon compte"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-white/70">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-[#ffb289] hover:underline">
            Se connecter
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link href="/" className="text-xs text-white/50 hover:underline">
            ← Retour au site
          </Link>
        </p>
      </div>
    </main>
  );
}
