import { createFileRoute } from "@tanstack/react-router";
import { CardGrid, PageHero, Prose, meta } from "@/components/site-layout";

export const Route = createFileRoute("/resources/prop-firms")({
  head: () => meta("Prop Firms", "How forex prop firms work and well-known firms to research before getting funded."),
  component: () => (
    <>
      <PageHero eyebrow="Resources · Prop Firms" title="Prop Firms" intro="Trade a firm's capital instead of your own — once you prove you can follow the rules." />
      <Prose sections={[
        { h: "How it works", p: ["You pay a fee to take an evaluation. Hit the profit target without breaking drawdown rules and the firm gives you a funded account, sharing the profits with you."] },
        { h: "Before you sign up", p: ["Read the rules carefully — daily loss limits, maximum drawdown, news trading and minimum trading days. Check reviews, payout history and how long the firm has been around."] },
      ]} />
      <CardGrid items={[
        { tag: "Established", title: "FTMO", text: "One of the best-known prop firms with a two-step evaluation.", href: "https://ftmo.com" },
        { tag: "Popular", title: "The5ers", text: "Several funding programs including instant funding options.", href: "https://the5ers.com" },
        { tag: "Popular", title: "FundedNext", text: "Multiple challenge types and profit share during evaluation.", href: "https://fundednext.com" },
      ]} />
    </>
  ),
});
