import { Mail, MapPin, Phone } from "lucide-react";

interface ContactSectionProps {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  mapUrl: string;
}

export function ContactSection({ subtitle, email, phone, address, mapUrl }: ContactSectionProps) {
  return (
    <section className="section-space" id="kontakt">
      <div className="site-container grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="panel p-6 md:p-8">
          <p className="section-label">Kontakt</p>
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

        <div className="overflow-hidden rounded-3xl border border-white/60 shadow-[0_16px_45px_-28px_rgba(40,28,10,0.55)]">
          <iframe
            src={mapUrl}
            style={{ border: 0, width: "100%", height: "100%", minHeight: "400px" }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Karte Alter Krug"
          />
        </div>
      </div>
    </section>
  );
}
