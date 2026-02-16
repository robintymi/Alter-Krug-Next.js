import { getSiteContent } from "@/app/actions";

export default async function DirectionsPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { directions_page } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space pb-8 text-center">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Anfahrt</p>
          <h1 className="section-title mt-3">{directions_page.title}</h1>
          <p className="section-lead mx-auto">{directions_page.intro}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container">
          <div className="overflow-hidden rounded-[2rem] border border-white/60 shadow-[0_18px_44px_-33px_rgba(22,12,6,0.52)]">
            <div className="relative aspect-[16/9] min-h-[320px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2446.463378351664!2d13.56588297693575!3d52.17983636195619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a810f135677717%3A0xe53d6118029d5b0!2sAlter%20Krug%20Kallinchen!5e0!3m2!1sen!2sde!4v1707758378546!5m2!1sen!2sde"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Anfahrt Alter Krug"
              />
            </div>
          </div>

          <div className="panel mx-auto mt-8 max-w-xl p-6 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/80">Adresse fürs Navi</h2>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              {content.footer.address.lines.map((line: string, i: number) => (
                <p key={line + i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
