import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Prose, meta } from "@/components/site-layout";

export const Route = createFileRoute("/free-education/what-is-forex")({
  head: () => meta("What is Forex", "A beginner-friendly explanation of the foreign exchange market."),
  component: () => (
    <>
      <PageHero eyebrow="Free Education · Lesson 1" title="What is Forex?" intro="Forex — foreign exchange — is the global market where currencies are bought and sold." />
      <Prose sections={[
        { h: "The biggest market in the world", p: ["Over 7 trillion US dollars changes hands every day. Banks, businesses, governments and individual traders all take part, 24 hours a day, five days a week."] },
        { h: "Currency pairs", p: ["Currencies trade in pairs, like EUR/USD. If you think the euro will rise against the dollar you buy; if you think it will fall you sell."] },
        { h: "Pips, lots and leverage", p: ["A pip is the smallest standard price move. A lot is the size of your trade. Leverage lets you control a large position with a small deposit — it multiplies both profits and losses."] },
        { h: "Trading sessions", p: ["The market moves through the Sydney, Tokyo, London and New York sessions. The overlap between London and New York is usually the most active time to trade."] },
      ]} />
    </>
  ),
});
