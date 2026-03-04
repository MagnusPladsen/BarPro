import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { Occasions } from "@/components/sections/Occasions";
import { Process } from "@/components/sections/Process";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <PricingTeaser />
      <Occasions />
      <Process />
      <CtaBanner />
    </>
  );
}
