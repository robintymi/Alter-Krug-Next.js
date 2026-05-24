import Link from "next/link";
import { BedDouble, CalendarDays, ChefHat } from "lucide-react";

const highlights = [
  {
    title: "Hotel",
    description: "Komfortable Zimmer für Ihre Auszeit am Motzener See.",
    href: "/hotel",
    Icon: BedDouble,
  },
  {
    title: "Restaurant",
    description: "Regionale Küche, saisonale Angebote und herzliche Gastlichkeit.",
    href: "/restaurant",
    Icon: ChefHat,
  },
  {
    title: "Veranstaltungen",
    description: "Feiern, Musik und besondere Abende – entdecken Sie unsere Events.",
    href: "/events",
    Icon: CalendarDays,
  },
] as const;

export function HomeHighlights() {
  return (
    <section className="defer-render py-10 md:py-12">
      <div className="site-container grid gap-4 md:grid-cols-3">
        {highlights.map(({ title, description, href, Icon }) => (
          <Link
            key={title}
            href={href}
            prefetch={false}
            className="panel group flex flex-col gap-4 p-6 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary shadow-sm">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">{title}</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
            <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/90">
              Mehr erfahren
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

