import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import logo from "@/assets/ltt-logo.png";

type NavItem = { to: string; label: string; children?: { to: string; label: string }[] };

export const NAV: NavItem[] = [
  { to: "/", label: "Home" },
  {
    to: "/resources",
    label: "Resources",
    children: [
      { to: "/resources/news", label: "News" },
      { to: "/resources/trading-tools", label: "Trading Tools" },
      { to: "/resources/prop-firms", label: "Prop Firms" },
    ],
  },
  {
    to: "/free-education",
    label: "Free Education",
    children: [
      { to: "/free-education/what-is-forex", label: "What is Forex" },
      { to: "/free-education/learning-to-trade", label: "Learning To Trade" },
      { to: "/free-education/why-trade", label: "Why Trade" },
    ],
  },
  { to: "/my-channel", label: "My Channel" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-4">
        <Link to="/" aria-label="Learn Train Trade home" className="flex flex-col items-center">
          <img src={logo} alt="LTT logo" width={1024} height={1024} className="h-16 w-auto object-cover" style={{ objectPosition: "center", aspectRatio: "2 / 1" }} />
          <span className="-mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-muted-foreground">Learn · Train · Trade</span>
        </Link>
        <button className="my-3 text-sm font-semibold text-primary md:hidden" onClick={() => setOpen(!open)}>
          {open ? "Close menu" : "Menu"}
        </button>
        <nav className={`${open ? "flex" : "hidden"} w-full flex-col items-center gap-1 pb-4 md:flex md:flex-row md:justify-center md:gap-8 md:py-3`}>
          {NAV.map((item) => (
            <div key={item.to} className="group relative text-center">
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                onClick={() => setOpen(false)}
                className="block px-2 py-2 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="left-1/2 top-full z-50 min-w-52 -translate-x-1/2 rounded-lg border border-border bg-card p-2 shadow-glow md:invisible md:absolute md:opacity-0 md:transition md:group-hover:visible md:group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link key={c.to} to={c.to} onClick={() => setOpen(false)} activeProps={{ className: "text-primary" }} className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-primary">
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold text-gold">Learn Train Trade</p>
          <p className="mt-2 text-sm text-muted-foreground">Real experience. Free knowledge. Better trading.</p>
        </div>
        {NAV.filter((n) => n.children).map((n) => (
          <div key={n.to}>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">{n.label}</p>
            <ul className="mt-3 space-y-2">
              {n.children!.map((c) => (
                <li key={c.to}><Link to={c.to} className="text-sm text-muted-foreground hover:text-primary">{c.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        Trading forex involves significant risk. Content here is educational and not financial advice. © {new Date().getFullYear()} Learn Train Trade
      </p>
    </footer>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold md:text-6xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{intro}</p>
      </div>
    </section>
  );
}

export type CardItem = { title: string; text: string; href?: string; to?: string; tag?: string };

export function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <div className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => {
        const body: ReactNode = (
          <>
            {i.tag && <span className="text-xs font-semibold uppercase tracking-widest text-primary">{i.tag}</span>}
            <h3 className="mt-2 text-2xl font-bold">{i.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.text}</p>
            {(i.href || i.to) && <span className="mt-5 inline-block text-sm font-semibold text-primary">{i.href ? "Visit site →" : "Read more →"}</span>}
          </>
        );
        const cls = "block h-full rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-glow";
        if (i.to) return <Link key={i.title} to={i.to} className={cls}>{body}</Link>;
        if (i.href) return <a key={i.title} href={i.href} target="_blank" rel="noreferrer" className={cls}>{body}</a>;
        return <div key={i.title} className={cls}>{body}</div>;
      })}
    </div>
  );
}

export function Prose({ sections }: { sections: { h: string; p: string[] }[] }) {
  return (
    <div className="mx-auto mt-16 max-w-3xl space-y-12 px-4">
      {sections.map((s) => (
        <section key={s.h}>
          <h2 className="text-3xl font-bold text-gold">{s.h}</h2>
          {s.p.map((t, k) => <p key={k} className="mt-4 leading-relaxed text-muted-foreground">{t}</p>)}
        </section>
      ))}
    </div>
  );
}

export function meta(title: string, description: string) {
  const t = `${title} | Learn Train Trade`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
