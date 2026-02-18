import { getSiteContent } from "@/lib/content";
import { ContactSection } from "@/components/ContactSection";
import { FeatureSection } from "@/components/FeatureSection";
import { GallerySection } from "@/components/GallerySection";
import { Hero } from "@/components/Hero";
import { PromoSection } from "@/components/PromoSection";

export default async function Home() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  return (
    <main className="min-h-screen">
      <Hero content={content.hero} />

      <FeatureSection
        id="hotel"
        title={content.home_hotel.title}
        description={content.home_hotel.description}
        buttonText={content.home_hotel.buttonText}
        buttonLink={content.home_hotel.buttonLink}
        imageSrc={content.home_hotel.image}
        reversed={false}
      />

      <FeatureSection
        id="restaurant"
        title={content.home_restaurant.title}
        description={content.home_restaurant.description}
        buttonText={content.home_restaurant.buttonText}
        buttonLink={content.home_restaurant.buttonLink}
        imageSrc={content.home_restaurant.image}
        reversed={true}
      />

      <FeatureSection
        id="events"
        title={content.home_events.title}
        description={content.home_events.description}
        buttonText={content.home_events.buttonText}
        buttonLink={content.home_events.buttonLink}
        imageSrc={content.home_events.image}
        reversed={false}
      />

      <GallerySection images={content.home_gallery?.images || []} />

      {content.home_promo && (
        <PromoSection
          title={content.home_promo.title}
          subtitle={content.home_promo.subtitle}
          description={content.home_promo.description}
          buttonText={content.home_promo.buttonText}
          buttonLink={content.home_promo.buttonLink}
          image={content.home_promo.image}
        />
      )}

      {content.home_contact && (
        <ContactSection
          title={content.home_contact.title}
          subtitle={content.home_contact.subtitle}
          email={content.home_contact.email}
          phone={content.home_contact.phone}
          address={content.home_contact.address}
          mapUrl={content.home_contact.mapUrl}
        />
      )}
    </main>
  );
}
