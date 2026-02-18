import { getSiteContent } from "@/lib/content";

export default async function JobPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { job_page } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space pb-8 text-center">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Karriere</p>
          <h1 className="section-title mt-3">{job_page.title}</h1>
          <p className="section-lead mx-auto">{job_page.intro}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container max-w-3xl space-y-5">
          {job_page.jobs.map((job: { title: string; type: string; description: string }, idx: number) => (
            <article key={job.title + idx} className="panel p-6 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-serif text-3xl md:text-4xl">{job.title}</h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {job.type}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground md:text-base">{job.description}</p>
            </article>
          ))}

          <div className="panel p-6 text-center md:p-7">
            <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Bewerbung an</p>
            <a href={`mailto:${content.footer.address.email}`} className="mt-2 inline-block text-lg font-semibold text-primary hover:underline">
              {content.footer.address.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
