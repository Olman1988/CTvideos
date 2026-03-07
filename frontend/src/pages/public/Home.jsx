import Navbar from "../../components/public/Navbar";
import HeroSlider from "../../components/public/HeroSlider";
import LogoStrip from "../../components/public/LogoStrip";
import InfoCards from "../../components/public/InfoCards";
import AboutSection from "../../components/public/AboutSection";
import VideosSection from "../../components/public/VideosSection";
import TriviaCTA from "../../components/public/TriviaCTA";
import FunChallenges from "../../components/public/FunChallenges";
import CategoriesSection from "../../components/public/CategoriesSection";
import Testimonials from "../../components/public/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <LogoStrip />
      <InfoCards />
      <AboutSection />
      <VideosSection />
      <TriviaCTA />
      <FunChallenges />
      <CategoriesSection />
      <Testimonials />
    </>
  );
}
