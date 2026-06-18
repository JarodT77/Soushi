import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PLANITY_URL } from "@/lib/links";

const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "À propos", href: "#a-propos" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Avis", href: "#avis" },
  { label: "Localisation", href: "#localisation" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#100c09] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Marque */}
          <div>
            <Image
              src="/images/logo-studio-socheata.png"
              alt="Studio Socheata"
              width={737}
              height={243}
              className="h-auto w-44"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Institut de beauté à Noisy-le-Grand. Extensions de cils, prothésie
              ongulaire et soins bien-être, sur rendez-vous.
            </p>
            <a
              href="https://www.instagram.com/studio_socheata/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram du Studio Socheata"
              className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/15 transition-all hover:bg-[#ffb289] hover:text-[#16110d] active:scale-90 active:bg-[#ffb289] active:text-[#16110d]"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold tracking-[1.5px] text-[#ffb289]">
              NAVIGATION
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#ffb289]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-[1.5px] text-[#ffb289]">
              CONTACT
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ffb289]" />
                <span>1 place de la Libération, 93160 Noisy-le-Grand</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#ffb289]" />
                <a
                  href="tel:+33000000000"
                  className="transition-colors hover:text-[#ffb289]"
                >
                  01 00 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#ffb289]" />
                <a
                  href="mailto:contact@studiosocheata.fr"
                  className="transition-colors hover:text-[#ffb289]"
                >
                  contact@studiosocheata.fr
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ffb289]" />
                <span>Du lundi au samedi · sur rendez-vous</span>
              </li>
            </ul>

            <a
              href={PLANITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-[4px] bg-[#ffb289] px-7 py-3 text-xs font-bold tracking-[1.5px] text-[#16110d] transition-all hover:-translate-y-0.5 hover:bg-[#ff9e6d] active:scale-95 active:bg-[#ff9e6d]"
            >
              PRENDRE RENDEZ-VOUS
            </a>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/50 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Studio Socheata. Tous droits réservés.</p>
          <p>Institut de beauté · Noisy-le-Grand</p>
        </div>
      </div>
    </footer>
  );
}
