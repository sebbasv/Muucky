import { Hero } from '@/components/hero/Hero';
import {
  FaqSection,
  FinalCta,
  MomentsSection,
  NutritionSection,
  ProductsSection,
  ReviewsSection,
  TrustStrip,
  WhySection,
} from '@/components/home/Sections';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductsSection />
      <WhySection />
      <MomentsSection />
      <NutritionSection />
      <ReviewsSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
