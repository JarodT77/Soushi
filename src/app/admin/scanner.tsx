"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Html5Qrcode } from "html5-qrcode";

// Code court de carte : 6 caractères (lettres/chiffres, sans O/0/I/1/L).
const CODE_REGEX = /^[A-Z2-9]{6}$/;

const REGION_ID = "qr-region";

export default function Scanner() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [saisieManuelle, setSaisieManuelle] = useState("");

  useEffect(() => {
    let annule = false;
    let traite = false;

    const aller = (valeur: string) => {
      const code = valeur.trim().toUpperCase();
      if (!CODE_REGEX.test(code)) {
        setErreur("QR code non reconnu (ce n'est pas une carte Studio Socheata).");
        traite = false;
        return;
      }
      router.push(`/admin/carte/${code}`);
    };

    // Import dynamique : la lib ne s'exécute que dans le navigateur.
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (annule) return;
      const scanner = new Html5Qrcode(REGION_ID);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            if (traite) return;
            traite = true;
            scanner
              .stop()
              .catch(() => {})
              .finally(() => aller(decoded));
          },
          () => {
            // Erreurs de décodage par image : ignorées (bruit normal).
          }
        )
        .catch(() => {
          setErreur(
            "Impossible d'accéder à la caméra. Autorisez l'accès ou saisissez le code manuellement."
          );
        });
    });

    return () => {
      annule = true;
      const s = scannerRef.current;
      if (s && s.isScanning) {
        s.stop().catch(() => {});
      }
    };
  }, [router]);

  return (
    <div className="w-full">
      <div
        id={REGION_ID}
        className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-black/80 [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
      />

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-center text-sm text-red-700">
          {erreur}
        </p>
      )}

      <div className="mt-6">
        <p className="mb-2 text-center text-xs uppercase tracking-widest text-white/50">
          ou saisir le code manuellement
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const code = saisieManuelle.trim().toUpperCase();
            if (CODE_REGEX.test(code)) {
              router.push(`/admin/carte/${code}`);
            } else {
              setErreur("Le code saisi n'est pas valide (6 caractères attendus).");
            }
          }}
          className="flex gap-2"
        >
          <input
            value={saisieManuelle}
            onChange={(e) => setSaisieManuelle(e.target.value)}
            placeholder="Code carte (ex. K7P2QX)"
            maxLength={6}
            autoCapitalize="characters"
            className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#936b55]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#936b55] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#7c5a47]"
          >
            OK
          </button>
        </form>
      </div>
    </div>
  );
}
