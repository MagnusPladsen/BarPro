import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { Occasions } from "@/components/sections/Occasions";
import { Process } from "@/components/sections/Process";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Faq } from "@/components/sections/Faq";
import { BookingCallout } from "@/components/sections/BookingCallout";
import { SectionDivider } from "@/components/ui/ScrollAnimations";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BookingCallout />
      <SectionDivider />
      <Intro />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <PricingTeaser />
      <SectionDivider />
      <Occasions />
      <SectionDivider />
      <Process />
      <SectionDivider />
      <Faq />
      <SectionDivider />
      <CtaBanner />
    </>
  );
}
