import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { Occasions } from "@/components/sections/Occasions";
import { Process } from "@/components/sections/Process";
import { Quote } from "@/components/sections/Quote";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <Occasions />
      <Process />
      <Quote />
      <CtaBanner />
    </>
  );
}
