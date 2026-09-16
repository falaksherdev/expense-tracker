import LandingNavbar from "../components/landing/LandingNavbar";
import Hero from "../components/landing/Hero";
import ProblemStatement from "../components/landing/ProblemStatement";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import FAQ from "../components/landing/FAQ";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <LandingNavbar />
      <Hero />
      <ProblemStatement />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
