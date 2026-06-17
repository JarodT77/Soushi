import Image from "next/image";
import { MapPin } from "lucide-react";
import Reveal from "@/componants/reveal";

const ADDRESS = "1 place de la Libération, 93160 Noisy-le-Grand";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Studio Socheata, " + ADDRESS);

export default function Localisation() {
  return (
    <section id="localisation" className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        {/* Titre */}
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-[1.5px] text-white sm:text-4xl">
            NOTRE STUDIO À NOISY-LE-GRAND
          </h2>
        </Reveal>

        {/* Image + carte coordonnées */}
        <Reveal delay={0.1} className="relative mt-14">
          <div className="relative h-[440px] w-full overflow-hidden rounded-3xl ring-1 ring-white/10 sm:h-[520px] lg:h-[600px]">
            <Image
              src="/images/studio.png"
              alt="Studio Socheata — institut de beauté à Noisy-le-Grand"
              fill
              sizes="100vw"
              className="object-cover"
            />
            {/* Léger voile pour le contraste de la carte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Carte NOS COORDONNÉES */}
          <div className="mt-6 rounded-2xl border-2 border-[#ffb289] bg-[#1a1410]/40 p-8 shadow-[0_5px_40px_2px_rgba(255,178,137,0.45)] backdrop-blur-md lg:absolute lg:bottom-8 lg:left-8 lg:mt-0 lg:max-w-md">
            <h3 className="text-xl font-bold tracking-[1px] text-[#ffb289]">
              NOS COORDONNÉES
            </h3>

            <div className="mt-5 flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#ffb289]" />
              <div>
                <p className="text-sm font-semibold tracking-[1px] text-white">
                  Adresse
                </p>
                <p className="mt-1 text-base leading-relaxed text-white/85">
                  {ADDRESS}
                </p>
              </div>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block rounded-[4px] bg-[#ffb289] px-8 py-3.5 text-sm font-bold tracking-[1.5px] text-[#16110d] transition-all hover:-translate-y-0.5 hover:bg-[#ff9e6d] hover:shadow-lg hover:shadow-[#ffb289]/30 active:scale-95 active:bg-[#ff9e6d]"
            >
              ITINÉRAIRE SUR GOOGLE MAPS
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
