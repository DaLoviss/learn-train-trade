import { createFileRoute } from "@tanstack/react-router";
import { CardGrid, PageHero, meta } from "@/components/site-layout";

export const Route = createFileRoute("/free-education/")({
  head: () => meta("Free Education", "Free forex lessons: what forex is, how to learn to trade and why people trade."),
  component: () => (
    <>
      <PageHero eyebrow="Free Education" title="Learn forex for free" intro="Start from zero. Each lesson builds on the last, drawn from my own journey and the best free material online." />
      <CardGrid items={[
        { tag: "Lesson 1", title: "What is Forex", text: "The world's largest market explained in plain language.", to: "/free-education/what-is-forex" },
        { tag: "Lesson 2", title: "Learning To Trade", text: "A step-by-step path from beginner to consistent trader.", to: "/free-education/learning-to-trade" },
        { tag: "Lesson 3", title: "Why Trade", text: "The real benefits — and the honest risks — of trading.", to: "/free-education/why-trade" },
      ]} />
    </>
  ),
});
