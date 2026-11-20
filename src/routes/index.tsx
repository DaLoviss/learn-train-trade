import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { CardGrid, meta } from "@/components/site-layout";

export const Route = createFileRoute("/")({
  head: () => meta("Learn Forex Trading", "Learn forex trading techniques and principles from real experience and the best free resources online."),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Trading desk with forex charts" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative mx-auto max-w-4xl px-4 py-32 text-center md:py-44">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Forex education, made real</p>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-7xl">
            Learn. Train. <span className="text-gold">Trade.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/85">
            A place to learn trading techniques and principles from my own experience — plus the best free resources on the internet, all in one spot.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/free-education" className="rounded-full bg-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-glow transition hover:scale-105">Start learning</Link>
            <Link to="/my-channel" className="rounded-full border border-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-primary transition hover:bg-primary hover:text-primary-foreground">Watch my channel</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-3xl px-4 text-center">
        <h2 className="text-4xl font-bold">Three steps to <span className="text-gold">confident trading</span></h2>
      </section>
      <CardGrid
        items={[
          { tag: "01 · Learn", title: "Understand the market", text: "Start with the basics: what forex is, how currency pairs move and who moves them.", to: "/free-education/what-is-forex" },
          { tag: "02 · Train", title: "Build your skills", text: "Practise strategy, risk management and discipline on a demo account before risking real money.", to: "/free-education/learning-to-trade" },
          { tag: "03 · Trade", title: "Trade with a plan", text: "Use proven tools, follow the news and explore funded accounts with prop firms.", to: "/resources" },
        ]}
      />

      <section className="mx-auto mt-24 max-w-5xl px-4">
        <div className="rounded-2xl border border-primary/40 bg-card p-10 text-center md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">Free. Honest. <span className="text-gold">Experience-driven.</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">No hype and no get-rich-quick promises — just the lessons, tools and resources that actually helped me grow as a trader.</p>
          <Link to="/resources" className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground">Explore resources</Link>
        </div>
      </section>
    </>
  );
}
