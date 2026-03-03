import { PortfolioPageClient } from "@/components/home/PortfolioPageClient";
import { ABOUT_ME_DESCRIPTION } from "@/lib/data/home-content";

export default function PortfolioPage() {
  return (
    <PortfolioPageClient aboutMeDescription={ABOUT_ME_DESCRIPTION} />
  );
}
