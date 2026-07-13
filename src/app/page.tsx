import HeroSection from "@/components/home/HeroSection";
import TopCampaigns from "@/components/home/TopCampaigns";
import HowItWorks from "@/components/home/HowItWorks";
import ExploreByCategory from "@/components/home/ExploreByCategory";
import Testimonials from "@/components/home/Testimonials";
import PlatformImpact from "@/components/home/PlatformImpact";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TopCampaigns />
      <HowItWorks />
      <ExploreByCategory />
      <Testimonials />
      <PlatformImpact />
    </div>
  );
}
