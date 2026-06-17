"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Star } from "lucide-react";

type Prestation = {
  num: string;
  title: string;
  description: string;
  price: string;
  cta: string;
  image: string;
};

const prestations: Prestation[] = [
  {
    num: "01",
    title: "EXTENSION DE CILS",
    description:
      "Un regard intense et sublimé : pose naturelle, cat eye ou volume intense, selon l'effet recherché. Pose et remplissage par une experte.",
    price: "À partir de 55 € · Remplissage dès 40 €",
    cta: "RÉSERVER MES CILS",
    image: "/images/service2.png",
  },
  {
    num: "02",
    title: "REHAUSSEMENT DE CILS",
    description:
      "Réveillez vos cils naturels : le rehaussement courbe et redresse votre regard pour un effet ouvert et longue durée, avec ou sans teinture.",
    price: "Dès 40 €",
    cta: "RÉSERVER MES CILS",
    image: "/images/service1.png",
  },
  {
    num: "03",
    title: "ONGLERIE & CAPSULES GEL",
    description:
      "Des ongles élégants et durables : vernis semi-permanent, pose gel, capsules Gel X, gainage et beauté des mains. Une parure qui tient dans le temps.",
    price: "Beauté des mains dès 20 € · Semi-permanent dès 25 €",
    cta: "RÉSERVER MES ONGLES",
    image: "/images/service1.png",
  },
  {
    num: "04",
    title: "ÉPILATION À LA CIRE",
    description:
      "Une peau nette et soignée : épilations à la cire (sourcils, visage, corps) dans un cadre apaisant.",
    price: "Dès 40 €",
    cta: "PRENDRE RENDEZ-VOUS",
    image: "/images/service2.png",
  },
];

const ROTATION_INTERVAL = 5000;

export default function Service() {
  const [index, setIndex] = useState(0);
  const current = prestations[index];

  const goTo = useCallback((i: number) => {
    setIndex(((i % prestations.length) + prestations.length) % prestations.length);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % prestations.length),
      ROTATION_INTERVAL
    );
    return () => clearInterval(id);
  }, [index]);

  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        {/* En-tête centré */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-[1.5px] text-white sm:text-4xl">
            NOS PRESTATIONS BEAUTÉS
          </h2>
          <p className="mt-4 text-base tracking-[1px] text-white/80 sm:text-lg">
            Cils, ongles, épilation — prenez rendez-vous en ligne 24h/24.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#ffb289] text-[#ffb289]" />
              ))}
            </div>
            <span className="text-sm tracking-[1px] text-white/80">
              4,9 / 5 · 87 avis clients
            </span>
          </div>
        </div>

        {/* Carrousel : image à gauche / description à droite */}
        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl border-2 border-[#ffb289] shadow-[0_5px_40px_2px_rgba(255,178,137,0.45)] lg:max-w-none">
            <AnimatePresence>
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Description */}
          <div className="relative min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <span className="text-5xl font-bold text-[#ffb289]/40 sm:text-6xl">
                  {current.num}
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-[1px] text-[#ffb289] sm:text-3xl">
                  {current.title}
                </h3>
                <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
                  {current.description}
                </p>
                <p className="mt-5 text-sm font-semibold tracking-[1px] text-white">
                  {current.price}
                </p>
                <a
                  href="#rendez-vous"
                  className="mt-8 inline-block rounded-[4px] bg-[#ffb289] px-9 py-4 text-sm font-bold tracking-[1.5px] text-[#16110d] transition-all hover:-translate-y-0.5 hover:bg-[#ff9e6d] hover:shadow-lg hover:shadow-[#ffb289]/30 active:scale-95 active:bg-[#ff9e6d]"
                >
                  {current.cta}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Points de navigation */}
        <div className="mt-12 flex items-center justify-center gap-3">
          {prestations.map((p, i) => (
            <button
              key={p.num}
              onClick={() => goTo(i)}
              aria-label={`Voir ${p.title}`}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-[#ffb289]" : "w-2.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* CTA global */}
        <div className="mt-12 text-center">
          <a
            href="https://www.planity.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold tracking-[1.5px] text-[#ffb289] underline-offset-4 hover:underline"
          >
            VOIR TOUTES LES PRESTATIONS SUR PLANITY
          </a>
        </div>
      </div>
    </section>
  );
}
