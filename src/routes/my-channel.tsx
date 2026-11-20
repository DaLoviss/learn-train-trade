import { createFileRoute } from "@tanstack/react-router";
import { CardGrid, PageHero, meta } from "@/components/site-layout";

// Replace with the real channel link once provided.
const CHANNEL_URL = "https://www.youtube.com/@learntraintrade";

export const Route = createFileRoute("/my-channel")({
  head: () => meta("My Channel", "Watch trading breakdowns, lessons and live market analysis on the Learn Train Trade channel."),
  component: () => (
    <>
      <PageHero eyebrow="My Channel" title="Watch, learn, trade" intro="Trade breakdowns, lessons and honest lessons from my own trading — straight from my channel." />
      <div className="mt-10 text-center">
        <a href={CHANNEL_URL} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-glow transition hover:scale-105">Visit my channel</a>
      </div>
      <CardGrid items={[
        { tag: "Weekly", title: "Market Outlook", text: "Key levels and the pairs I'm watching for the week ahead." },
        { tag: "Lessons", title: "Strategy Breakdowns", text: "Step-by-step walkthroughs of the setups I actually trade." },
        { tag: "Real talk", title: "Trading Psychology", text: "Wins, losses and the mindset that keeps me consistent." },
      ]} />
    </>
  ),
});
