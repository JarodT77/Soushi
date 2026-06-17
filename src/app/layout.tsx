import type { Metadata } from "next";
import { Montserrat, Mr_De_Haviland } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const mrDeHaviland = Mr_De_Haviland({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Studio Socheata — Institut de beauté à Noisy-le-Grand",
  description:
    "Révélez votre beauté naturelle : extensions de cils, prothésie ongulaire et soins bien-être, sur rendez-vous à Noisy-le-Grand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} ${mrDeHaviland.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
