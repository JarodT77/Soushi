"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/lib/auth/actions";

const initialState: AuthState = {};

export default function ConnexionPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur animate-fade-up">
        <h1 className="text-center font-script text-4xl text-[#936b55]">
          Studio Socheata
        </h1>
        <p className="mt-1 text-center text-sm uppercase tracking-widest text-neutral-500">
          Espace fidélité
        </p>

        <form action={formAction} className="mt-8 space-y-5">
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
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 outline-none transition focus:border-[#936b55] focus:ring-2 focus:ring-[#936b55]/30"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-neutral-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 outline-none transition focus:border-[#936b55] focus:ring-2 focus:ring-[#936b55]/30"
            />
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
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Pas encore de carte ?{" "}
          <Link href="/inscription" className="font-medium text-[#936b55] hover:underline">
            Créer un compte
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
