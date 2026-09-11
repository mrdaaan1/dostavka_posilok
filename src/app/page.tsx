import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import PainPoint from "@/components/sections/PainPoint";
import RoleCards from "@/components/sections/RoleCards";
import HowItWorks from "@/components/sections/HowItWorks";
import AdvantagesCarousel from "@/components/sections/AdvantagesCarousel";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <PainPoint />
        <RoleCards />
        <HowItWorks />
        <AdvantagesCarousel />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
