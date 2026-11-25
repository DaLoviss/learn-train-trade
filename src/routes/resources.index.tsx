import { createFileRoute } from "@tanstack/react-router";
import { CardGrid, PageHero, meta } from "@/components/site-layout";

export const Route = createFileRoute("/resources/")({
  head: () => meta("Resources", "Forex news, trading tools and prop firm guides hand-picked for learning traders."),
  component: () => (
    <>
      <PageHero eyebrow="Resources" title="Everything a trader needs" intro="Hand-picked news sources, tools and funding options I use and recommend." />
      <CardGrid items={[
        { tag: "Stay informed", title: "News", text: "Where to follow market-moving headlines and the economic calendar.", to: "/resources/news" },
         { tag: "Market events", title: "Economic Calendar", text: "Track upcoming economic releases, forecasts and results with Investing.com.", to: "/resources/economic-calendar" },
        { tag: "Work smarter", title: "Trading Tools", text: "Charting platforms, calculators and journals to sharpen your trading.", to: "/resources/trading-tools" },
        { tag: "Get funded", title: "Prop Firms", text: "How prop firms work and what to check before you sign up.", to: "/resources/prop-firms" },
      ]} />
    </>
  ),
});
