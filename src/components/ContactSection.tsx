import { Mail, MapPin, Phone } from "lucide-react";

interface ContactSectionProps {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  mapUrl: string;
}

export function ContactSection({ title, subtitle, email, phone, address, mapUrl }: ContactSectionProps) {
  return (
    <section className="section-space" id="kontakt">
      <div className="site-container grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="panel p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Kontakt</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-foreground md:text-5xl">{title}</h2>
          <p className="mt-4 text-muted-foreground">{subtitle}</p>

          <div className="mt-8 space-y-5">
            <a href={`mailto:${email}`} className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/75 p-4 transition-colors hover:border-primary/30">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <strong className="block text-sm uppercase tracking-[0.14em] text-foreground/85">E-Mail</strong>
                <span className="text-sm text-muted-foreground md:text-base">{email}</span>
              </span>
            </a>

            <a href={`tel:${phone}`} className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/75 p-4 transition-colors hover:border-primary/30">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <strong className="block text-sm uppercase tracking-[0.14em] text-foreground/85">Telefon</strong>
                <span className="text-sm text-muted-foreground md:text-base">{phone}</span>
              </span>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/75 p-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <span>
                <strong className="block text-sm uppercase tracking-[0.14em] text-foreground/85">Adresse</strong>
                <span className="text-sm text-muted-foreground md:text-base">{address}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/60 shadow-[0_16px_45px_-28px_rgba(40,28,10,0.55)]">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
          <div className="relative aspect-[16/11] min-h-[340px]">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Karte Alter Krug"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
