export interface NavItem {
    label: string;
    href: string;
    items?: NavItem[];
}

export interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    price: string;
    description: string;
    image?: string;
    galleryImage?: string;
    recurring?: boolean; // New field for recurring events
}

export interface JobOffer {
    title: string;
    type: string;
    description: string;
}

export type MenuSectionLayout = 'auto' | 'items-left' | 'image-left';

export interface MenuItem {
    name: string;
    price: string;
    description?: string;
    image?: string;
}

export interface MenuCategory {
    name: string;
    items: MenuItem[];
    image?: string;
    layout?: 'list' | 'alternating'; // Legacy field kept for compatibility
    layoutDirection?: MenuSectionLayout;
}

export interface Room {
    type: string;
    features: string[];
    price: string;
    image?: string;
    images?: string[]; // New field for gallery
}

export interface SiteContent {
    header: {
        navItems: NavItem[];
        bookingUrl: string;
        reservationUrl: string;
    };
    hero: {
        title: string;
        subtitle: string;
        buttonText: string;
        buttonLink: string;
        images: string[];
    };
    home_hotel: {
        title: string;
        description: string;
        buttonText: string;
        buttonLink: string;
        image: string;
    };
    home_restaurant: {
        title: string;
        description: string;
        buttonText: string;
        buttonLink: string;
        image: string;
    };
    home_events: {
        title: string;
        description: string;
        buttonText: string;
        buttonLink: string;
        image: string;
    };
    home_gallery: {
        images: string[];
    };
    home_promo: {
        title: string;
        subtitle: string;
        description: string;
        buttonText: string;
        buttonLink: string;
        image: string;
    };
    home_contact: {
        title: string;
        subtitle: string;
        email: string;
        phone: string;
        address: string;
        mapUrl: string;
    };
    hotel_page: {
        mission: string;
        galleryText: string;
        bookingText: string;
        buttonText: string;
        buttonLink: string;
        image?: string;
        heroButtonText?: string;
        heroButtonLink?: string;
        gallery?: string[];
        bottomBooking?: {
            title: string;
            text: string;
            buttonText: string;
            buttonLink: string;
        };
    };
    rooms_page: {
        title: string;
        subtitle?: string;
        intro: string;
        buttonText: string;
        buttonLink: string;
        rooms: Room[];
        bottomBooking?: {
            title: string;
            text: string;
            buttonText: string;
            buttonLink: string;
        };
    };
    restaurant_page: {
        title: string;
        sections: {
            title: string;
            content: string;
        }[];
    };
    wellness_page: {
        title: string;
        description: string;
        image?: string;
        contact: {
            name: string;
            phone: string;
            mobile: string;
            website: string;
        };
    };
    menu_page: {
        title: string;
        intro: string;
        categories: MenuCategory[];
    };
    drinks_page: {
        title: string;
        categories: MenuCategory[];
    };
    buffet_page: {
        title: string;
        intro: string;
        buffets: {
            name: string;
            description: string;
        }[];
    };
    events_page: {
        title: string;
        intro: string;
        events: Event[];
        gallery: string[];
    };
    job_page: {
        title: string;
        intro: string;
        jobs: JobOffer[];
    };
    contact_page: {
        title: string;
        intro: string;
    };
    directions_page: {
        title: string;
        intro: string;
    };
    footer: {
        address: {
            title: string;
            lines: string[];
            email: string;
            phone: string;
        };
        openingHours: {
            title: string;
            lines: string[];
        };
    };
}
