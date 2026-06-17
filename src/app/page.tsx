import Header from "@/componants/header";
import Profil from "@/componants/profil";
import Service from "@/componants/service";
import Realisations from "@/componants/realisations";
import Testimonials from "@/componants/testimonials";
import Localisation from "@/componants/localisation";
import Footer from "@/componants/footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Profil />
      <Service />
      <Realisations />
      <Testimonials />
      <Localisation />
      <Footer />
    </main>
  );
}
