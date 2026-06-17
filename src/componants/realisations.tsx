"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Remplace ces URLs par les liens de TES publications Instagram.
 * Sur Instagram : ouvre un post → bouton ⋯ → « Copier le lien ».
 * Format attendu : https://www.instagram.com/p/XXXXXXXXXXX/
 */
const POSTS: string[] = [
  "https://www.instagram.com/p/DTp7L4SjKjr/",
  "https://www.instagram.com/reel/DPhNGW8jO0t/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DOT9axxDHw1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
];

export default function Realisations() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Re-traite les embeds quand le composant est monté (navigation client)
  useEffect(() => {
    window.instgrm?.Embeds?.process();
  }, []);

  // Suit la publication la plus centrée pendant le scroll (mobile)
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let min = Infinity;
    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - center);
      if (distance < min) {
        min = distance;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  const goTo = (i: number) => {
    const item = itemsRef.current[i];
    const el = scrollRef.current;
    if (item && el) {
      el.scrollTo({
        left: item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="realisations"
      className="py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[2px] text-[#ffb289]">
            STUDIO SOCHEATA
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[1.5px] text-white sm:text-4xl">
            NOS RÉALISATIONS
          </h2>
          <p className="mt-4 text-base tracking-[1px] text-white/80 sm:text-lg">
            Un aperçu de notre travail, directement depuis Instagram.
          </p>
        </div>

        {/* Embeds : scroll horizontal sur mobile, grille sur desktop */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {POSTS.map((url, i) => (
            <div
              key={url}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="flex w-[85%] shrink-0 snap-center justify-center lg:w-auto lg:shrink"
            >
              <blockquote
                className="instagram-media w-full"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  borderRadius: "16px",
                  margin: 0,
                  maxWidth: "540px",
                  minWidth: "min(100%, 280px)",
                  width: "100%",
                }}
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Voir cette publication sur Instagram
                </a>
              </blockquote>
            </div>
          ))}
        </div>

        {/* Points de navigation (mobile uniquement) */}
        <div className="mt-8 flex items-center justify-center gap-3 lg:hidden">
          {POSTS.map((url, i) => (
            <button
              key={url}
              onClick={() => goTo(i)}
              aria-label={`Voir la publication ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-8 bg-[#ffb289]"
                  : "w-2.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* CTA Instagram */}
        <div className="mt-14 text-center">
          <a
            href="https://www.instagram.com/studio_socheata/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-[4px] bg-[#ffb289] px-9 py-4 text-sm font-bold tracking-[1.5px] text-[#16110d] transition-all hover:-translate-y-0.5 hover:bg-[#ff9e6d] hover:shadow-lg hover:shadow-[#ffb289]/30 active:scale-95 active:bg-[#ff9e6d]"
          >
            SUIVRE @STUDIO_SOCHEATA
          </a>
        </div>
      </div>

      {/* Script officiel d'embed Instagram */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => window.instgrm?.Embeds?.process()}
      />
    </section>
  );
}
