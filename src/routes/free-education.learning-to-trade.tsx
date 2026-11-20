import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Prose, meta } from "@/components/site-layout";

export const Route = createFileRoute("/free-education/learning-to-trade")({
  head: () => meta("Learning To Trade", "A practical step-by-step path to learning forex trading."),
  component: () => (
    <>
      <PageHero eyebrow="Free Education · Lesson 2" title="Learning To Trade" intro="There are no shortcuts — but there is a clear path. Here's the one I recommend." />
      <Prose sections={[
        { h: "1. Learn the basics", p: ["Understand pairs, pips, lots, leverage and how to read a candlestick chart. Free courses like BabyPips School of Pipsology are a great start."] },
        { h: "2. Pick one strategy", p: ["Price action, support and resistance, trend following — choose one approach and master it before adding more."] },
        { h: "3. Protect your capital", p: ["Risk only 1–2% of your account per trade. Always use a stop loss. Survival comes first; profits come later."] },
        { h: "4. Practise on demo", p: ["Trade a demo account for at least a few months. Treat it like real money and follow your plan every time."] },
        { h: "5. Journal and review", p: ["Write down every trade: why you entered, how you felt and what happened. Your journal will become your best teacher."] },
        { h: "6. Master your mindset", p: ["Patience and discipline beat any indicator. Expect losses, stick to your rules and never revenge trade."] },
      ]} />
    </>
  ),
});
