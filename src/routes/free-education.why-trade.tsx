import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Prose, meta } from "@/components/site-layout";

export const Route = createFileRoute("/free-education/why-trade")({
  head: () => meta("Why Trade", "The benefits and honest risks of trading forex."),
  component: () => (
    <>
      <PageHero eyebrow="Free Education · Lesson 3" title="Why Trade?" intro="Trading can be a skill that changes your life — if you approach it the right way." />
      <Prose sections={[
        { h: "Flexibility", p: ["The market is open around the clock on weekdays, so you can trade around work, school or family."] },
        { h: "Low barrier to start", p: ["You can learn for free, practise on demo for free and start live with a small account — or get funded through a prop firm."] },
        { h: "A skill for life", p: ["Once you learn to read markets and manage risk, that knowledge stays with you and keeps compounding."] },
        { h: "The honest truth", p: ["Most beginners lose money. Trading takes time, discipline and education. Never trade money you can't afford to lose — and that's exactly why learning first matters."] },
      ]} />
    </>
  ),
});
