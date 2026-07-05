"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthState } from "@/lib/auth/actions";

const initialState: AuthState = {};

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 outline-none transition focus:border-[#936b55] focus:ring-2 focus:ring-[#936b55]/30";

export default function InscriptionPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur animate-fade-up">
        <h1 className="text-center font-script text-4xl text-[#936b55]">
          Studio Socheata
        </h1>
        <p className="mt-1 text-center text-sm uppercase tracking-widest text-neutral-500">
          Créer sa carte de fidélité
        </p>

        {state.message ? (
          <div className="mt-8 rounded-lg bg-green-50 px-4 py-6 text-center text-sm text-green-800">
            {state.message}
          </div>
        ) : (
          <form action={formAction} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="mb-1 block text-sm text-neutral-700">
                  Prénom
                </label>
                <input id="prenom" name="prenom" type="text" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="nom" className="mb-1 block text-sm text-neutral-700">
                  Nom
                </label>
                <input id="nom" name="nom" type="text" required className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-neutral-700">
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
              <label htmlFor="password" className="mb-1 block text-sm text-neutral-700">
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
              <p className="mt-1 text-xs text-neutral-400">Au moins 8 caractères.</p>
            </div>

            {state.error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[#936b55] py-3 font-medium text-white transition hover:bg-[#7c5a47] disabled:opacity-60"
            >
              {pending ? "Création…" : "Créer mon compte"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-neutral-600">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-[#936b55] hover:underline">
            Se connecter
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link href="/" className="text-xs text-neutral-400 hover:underline">
            ← Retour au site
          </Link>
        </p>
      </div>
    </main>
  );
}
