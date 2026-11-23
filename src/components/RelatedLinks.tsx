import Link from "next/link";

interface RelatedLink {
    href: string;
    label: string;
}

interface RelatedLinksProps {
    title: string;
    links: RelatedLink[];
}

/**
 * Kontextbezogene Verlinkung am Ende einer Seite (z.B. von einer Event-Seite
 * zum Hotel). Hilft Besuchern beim Weiterklicken und Google dabei, den
 * Zusammenhang zwischen den Seiten zu verstehen.
 */
export function RelatedLinks({ title, links }: RelatedLinksProps) {
    return (
        <section className="pb-14 md:pb-20">
            <div className="site-container">
                <div className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
                    <p className="text-sm font-semibold text-foreground/80">{title}</p>
                    <div className="flex flex-wrap gap-3">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} prefetch={false} className="btn-brand-soft">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
