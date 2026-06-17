"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfilCardProps {
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  bookingUrl?: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
  className?: string;
}

export default function Profil(props: ProfilCardProps) {
  const {
    name = "Studio Socheata",
    title = "Esthéticienne diplômée · Cils, ongles & bien-être à Noisy-le-Grand",
    description = "Passionnée par l'univers de la beauté et du bien-être, Socheata est une esthéticienne diplômée qui exerce au sein de son propre espace : le Studio Socheata. Spécialisée dans le rehaussement et l'extension de cils ainsi que dans l'onglerie, elle accompagne chaque cliente vers une beauté naturelle, durable et soignée. Experte en pose de vernis semi-permanent et en soin des ongles, elle offre une parure raffinée et longue tenue, pensée pour s'adapter à votre style comme à votre quotidien.",
    imageUrl = "/images/souchi.jpg",
    bookingUrl = "#rendez-vous",
    phone = "tel:+33000000000",
    email = "mailto:contact@studiosocheata.fr",
    mapUrl = "#localisation",
    className,
  } = props;

  const actions = [
    { icon: Calendar, url: bookingUrl, label: "Prendre rendez-vous" },
    { icon: Phone, url: phone, label: "Téléphone" },
    { icon: Mail, url: email, label: "Email" },
    { icon: MapPin, url: mapUrl, label: "Adresse" },
  ];

  return (
    <section
      id="a-propos"
      className="py-20 lg:py-28"
    >
      <div className={cn("mx-auto w-full max-w-6xl px-4", className)}>
        {/* Desktop */}
        <div className="relative hidden items-center md:flex">
          {/* Image carrée */}
          <div className="h-[470px] w-[470px] flex-shrink-0 overflow-hidden rounded-3xl bg-[#211a14]">
            <Image
              src={imageUrl}
              alt={name}
              width={470}
              height={470}
              className="h-full w-full object-cover object-top"
              draggable={false}
              priority
            />
          </div>

          {/* Carte qui chevauche */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="z-10 ml-[-80px] max-w-3xl flex-1 rounded-3xl border-2 border-[#ffb289] bg-[#1a1410]/40 p-10 shadow-[0_5px_40px_2px_rgba(255,178,137,0.45)] backdrop-blur-md"
          >
            <div className="mb-6">
              <h2 className="mb-2 text-3xl font-bold tracking-[1px] text-white">
                Bienvenue chez{" "}
                <span className="font-script text-4xl text-[#ffb289]">
                  {name}
                </span>
              </h2>
              <p className="text-sm font-medium tracking-[0.5px] text-[#ffb289]">
                {title}
              </p>
            </div>

            <p className="mb-8 text-base leading-relaxed text-white/85">
              {description}
            </p>

            <div className="flex space-x-4">
              {actions.map(({ icon: Icon, url, label }) => (
                <Link
                  key={label}
                  href={url}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffb289] transition-all hover:-translate-y-0.5 hover:bg-[#ff9e6d] active:scale-90 active:bg-[#ff9e6d]"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-5 w-5 text-[#16110d]" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-sm text-center md:hidden"
        >
          {/* Image carrée mobile */}
          <div className="mb-6 aspect-square w-full overflow-hidden rounded-3xl bg-[#211a14]">
            <Image
              src={imageUrl}
              alt={name}
              width={400}
              height={400}
              className="h-full w-full object-cover object-top"
              draggable={false}
              priority
            />
          </div>

          <div className="px-2">
            <h2 className="mb-2 text-2xl font-bold tracking-[1px] text-white">
              Bienvenue chez{" "}
              <span className="font-script text-3xl text-[#ffb289]">{name}</span>
            </h2>
            <p className="mb-4 text-sm font-medium text-[#ffb289]">{title}</p>
            <p className="mb-6 text-sm leading-relaxed text-white/85">
              {description}
            </p>

            <div className="flex justify-center space-x-4">
              {actions.map(({ icon: Icon, url, label }) => (
                <Link
                  key={label}
                  href={url}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffb289] transition-all hover:bg-[#ff9e6d] active:scale-90 active:bg-[#ff9e6d]"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-5 w-5 text-[#16110d]" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
