"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const testimonials = [
  {
    quote:
      "Le salon est magnifique, j'ai fait mes ongles et mes cils, ils sont magnifiques 😍",
    author: "Cliente vérifiée",
    role: "Avis Planity · Juin 2026",
    company: "Studio Socheata",
  },
  {
    quote:
      "Super découverte ! Un salon cosy où l'on se sent bien. Socheata est professionnelle, douée et bienveillante. Je recommande !",
    author: "Cliente vérifiée",
    role: "Avis Planity · Mai 2026",
    company: "Studio Socheata",
  },
  {
    quote:
      "Franchement je suis trop contente du résultat 😍 Les cils sont magnifiques, bien posés, légers et super naturels, avec un vrai regard de biche ✨",
    author: "Cliente vérifiée",
    role: "Avis Planity · Mai 2026",
    company: "Studio Socheata",
  },
  {
    quote:
      "Belle accueil, Socheata est très professionnelle et très sympathique. Toujours satisfaite quand je vais chez elle !",
    author: "Cliente vérifiée",
    role: "Avis Planity · Juin 2026",
    company: "Studio Socheata",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform for parallax on the large number
  const numberX = useTransform(x, [-200, 200], [-20, 20]);
  const numberY = useTransform(y, [-200, 200], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[activeIndex];

  return (
    <section
      id="avis"
      className="flex items-center justify-center overflow-hidden px-6 py-20 lg:px-8 lg:py-24"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl"
        onMouseMove={handleMouseMove}
      >
        {/* Oversized index number - positioned to bleed off left edge */}
        <motion.div
          className="pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2 select-none text-[28rem] font-bold leading-none tracking-tighter text-[#ffb289]/[0.06]"
          style={{ x: numberX, y: numberY }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Main content - asymmetric layout */}
        <div className="relative flex">
          {/* Left column - vertical text */}
          <div className="hidden flex-col items-center justify-center border-r border-white/15 pr-16 sm:flex">
            <motion.span
              className="text-xs uppercase tracking-widest text-white/50"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Avis clients
            </motion.span>

            {/* Vertical progress line */}
            <div className="relative mt-8 h-32 w-px bg-white/15">
              <motion.div
                className="absolute left-0 top-0 w-full origin-top bg-[#ffb289]"
                animate={{
                  height: `${((activeIndex + 1) / testimonials.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Center - main content */}
          <div className="flex-1 py-12 sm:pl-16">
            {/* Company badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ffb289]" />
                  {current.company} · ★ 5,0
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Quote with character reveal */}
            <div className="relative mb-12 min-h-[200px] [perspective:1000px] sm:min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeIndex}
                  className="text-2xl font-light leading-[1.25] tracking-tight text-white md:text-4xl"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {current.quote.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      className="mr-[0.3em] inline-block"
                      variants={{
                        hidden: { opacity: 0, y: 20, rotateX: 90 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          transition: {
                            duration: 0.5,
                            delay: i * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                        exit: {
                          opacity: 0,
                          y: -10,
                          transition: { duration: 0.2, delay: i * 0.02 },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Author row */}
            <div className="flex items-end justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  {/* Animated line before name */}
                  <motion.div
                    className="h-px w-8 bg-[#ffb289]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ originX: 0 }}
                  />
                  <div>
                    <p className="text-base font-medium text-white">
                      {current.author}
                    </p>
                    <p className="text-sm text-white/50">{current.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={goPrev}
                  aria-label="Avis précédent"
                  className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/15"
                >
                  <span className="absolute inset-0 -translate-x-full bg-[#ffb289] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="relative z-10 text-white transition-colors group-hover:text-[#16110d]"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  onClick={goNext}
                  aria-label="Avis suivant"
                  className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/15"
                >
                  <span className="absolute inset-0 translate-x-full bg-[#ffb289] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="relative z-10 text-white transition-colors group-hover:text-[#16110d]"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom ticker - subtle repeating salon name */}
        <div className="pointer-events-none absolute -bottom-20 left-0 right-0 overflow-hidden opacity-[0.06]">
          <motion.div
            className="flex whitespace-nowrap text-6xl font-bold tracking-tight text-white"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8">
                Studio Socheata · 4,9/5 · 87 avis ·
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
