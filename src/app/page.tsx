import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import SummarySection from "@/components/SummarySection";
import Scroller from "./scroller";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Scroller>
        <HeroSection />
        <SummarySection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </Scroller>
      <FooterSection />
    </main>
  );
}
