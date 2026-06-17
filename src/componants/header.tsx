"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "ACCUEIL", href: "#accueil" },
  { label: "À PROPOS", href: "#a-propos" },
  { label: "SERVICES", href: "#services" },
  { label: "RÉALISATIONS", href: "#realisations" },
  { label: "AVIS", href: "#avis" },
  { label: "LOCALISATION", href: "#localisation" },
];

const categories = ["BIEN-ÊTRE", "ONGLES", "CILS", "BEAUTÉ"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      id="accueil"
      className="relative flex min-h-screen flex-col overflow-hidden text-white"
    >
      {/* Image du salon en fond */}
      <Image
        src="/images/salon.png"
        alt="Studio Socheata — institut de beauté à Noisy-le-Grand"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Voile sombre pour la lisibilité */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

      {/* Navbar */}
      <nav className="relative flex items-center justify-between px-6 py-5 sm:px-12 lg:px-20">
        <a href="#accueil" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Monogramme Studio Socheata"
            width={35}
            height={65}
            className="h-12 w-auto"
            priority
          />
        </a>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link, i) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="animate-fade-in group relative text-sm font-semibold tracking-[1.5px] text-white"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#ffb289] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Bouton rendez-vous desktop */}
        <a
          href="#rendez-vous"
          className="animate-fade-in hidden rounded-[4px] bg-[#ffb289] px-9 py-4 text-sm font-bold tracking-[1.5px] text-[#fbf8f4] transition-all hover:bg-[#ff9e6d] hover:shadow-lg hover:shadow-[#ffb289]/30 active:scale-95 active:bg-[#ff9e6d] lg:inline-block"
          style={{ animationDelay: "0.6s" }}
        >
          PRENDRE RENDEZ-VOUS
        </a>

        {/* Bouton burger mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          className="text-white transition-all hover:text-[#ffb289] active:scale-90 active:text-[#ffb289] lg:hidden"
        >
          {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="animate-fade-in absolute inset-x-0 top-full z-20 border-t border-white/10 bg-[#16110d]/95 px-6 py-6 backdrop-blur-sm lg:hidden">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-2 py-3 text-sm font-semibold tracking-[1.5px] text-white transition-colors hover:text-[#ffb289] active:bg-white/5 active:text-[#ffb289]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#rendez-vous"
              onClick={() => setMenuOpen(false)}
              className="mt-4 block rounded-[4px] bg-[#ffb289] px-6 py-3.5 text-center text-sm font-bold tracking-[1.5px] text-[#16110d] transition-all hover:bg-[#ff9e6d] active:scale-95 active:bg-[#ff9e6d]"
            >
              PRENDRE RENDEZ-VOUS
            </a>
          </div>
        )}
      </nav>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col justify-center px-6 sm:px-12 lg:px-20">
        <Image
          src="/images/logo-studio-socheata.png"
          alt="Studio Socheata"
          width={737}
          height={243}
          priority
          className="animate-fade-up mb-10 h-auto w-full max-w-[600px]"
          style={{ animationDelay: "0.1s" }}
        />

        <h1
          className="animate-fade-up text-2xl font-bold tracking-[1.5px] sm:text-3xl lg:text-4xl"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="text-[#ffb289]">INSTITUT DE BEAUTÉ</span>{" "}
          <span className="text-[#f2ede6]">À NOISY-LE-GRAND</span>
        </h1>

        <p
          className="animate-fade-up mt-5 max-w-2xl text-base font-normal leading-relaxed tracking-[1px] text-white sm:text-lg lg:text-xl"
          style={{ animationDelay: "0.5s" }}
        >
          Révélez votre beauté naturelle : extensions de cils, prothésie
          ongulaire et soins bien-être, sur rendez-vous à Noisy-le-Grand.
        </p>

        <a
          href="#rendez-vous"
          className="animate-fade-up mt-10 inline-block w-fit rounded-[4px] bg-[#ffb289] px-9 py-4 text-sm font-bold tracking-[1.5px] text-[#fbf8f4] transition-all hover:bg-[#ff9e6d] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ffb289]/30 active:scale-95 active:bg-[#ff9e6d]"
          style={{ animationDelay: "0.7s" }}
        >
          PRENDRE RENDEZ-VOUS
        </a>
      </div>

      {/* Barre des catégories */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-8 sm:px-12 lg:px-20">
        {categories.map((category, i) => (
          <span
            key={category}
            className="animate-fade-up cursor-default text-lg font-normal tracking-[1.5px] text-white transition-colors hover:text-[#ffb289] sm:text-2xl"
            style={{ animationDelay: `${0.9 + 0.12 * i}s` }}
          >
            {category}
          </span>
        ))}
      </div>
    </header>
  );
}
