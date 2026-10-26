
import React, { useEffect } from 'react';
import { PageRoute } from '../types';

interface SEOHelmetProps {
  currentRoute: PageRoute;
  serviceTitle?: string;
}

const SITE_URL = 'https://oankcleaning.co.uk';

const PRIMARY_PHONE = '+447731956727';
const ALTERNATIVE_PHONE = '+447510911940';

const PAGES: Record<
  string,
  { title: string; description: string; path: string }
> = {
  home: {
    title: 'OANK Cleaning CIC | Cleaning Services Across Scotland',
    description:
      'OANK Cleaning CIC provides domestic and commercial cleaning across Scotland, with our head office in Paisley. Our staff undergo certification training. Contact us for a quote.',
    path: '/',
  },

  services: {
    title: 'Cleaning Services Across Scotland | OANK Cleaning CIC',
    description:
      'Explore domestic cleaning, deep cleaning, end-of-tenancy cleaning, carpet cleaning and commercial office cleaning across Scotland.',
    path: '/services',
  },

  community: {
    title: 'Community Cleaning & Support | OANK Cleaning CIC',
    description:
      'Discover OANK Cleaning CIC, our community-focused mission, and our cleaning and employment initiatives in Scotland.',
    path: '/ohkay-group',
  },

  governance: {
    title: 'Our Policies & Standards | OANK Cleaning CIC',
    description:
      'Learn about OANK Cleaning CIC policies, staff training, service standards and community commitments.',
    path: '/governance',
  },

  about: {
    title: 'About OANK Cleaning CIC | Paisley, Scotland',
    description:
      'Meet OANK Cleaning CIC, a community-focused cleaning company headquartered in Paisley and serving customers across Scotland.',
    path: '/about',
  },

  quote: {
    title: 'Request a Cleaning Quote | OANK Cleaning CIC',
    description:
      'Request a cleaning quote from OANK Cleaning CIC. Explore our services and check availability across Scotland.',
    path: '/quote',
  },

  faqs: {
    title: 'Cleaning FAQs | OANK Cleaning CIC',
    description:
      'Find answers to common questions about our cleaning services, staff training, bookings and service arrangements.',
    path: '/faqs',
  },

  contact: {
    title: 'Contact OANK Cleaning CIC | Scotland-Wide Cleaning',
    description:
      'Contact OANK Cleaning CIC about domestic or commercial cleaning across Scotland. Call our primary or alternative business number.',
    path: '/contact',
  },
};

const SERVICES = [
  'Domestic Cleaning',
  'Deep Cleaning',
  'End of Tenancy Cleaning',
  'Commercial Office Cleaning',
  'Healthcare Cleaning',
  'Carpet and Upholstery Cleaning',
];

export const SEOHelmet: React.FC<SEOHelmetProps> = ({
  currentRoute,
  serviceTitle,
}) => {
  useEffect(() => {
    const page =
      currentRoute === 'service-detail' && serviceTitle
        ? {
            title: `${serviceTitle} Across Scotland | OANK Cleaning CIC`,
            description:
              `Explore ${serviceTitle} from OANK Cleaning CIC. Our head office is in Paisley, and we serve customers across Scotland. Contact us to check availability and request a quote.`,
            path: window.location.pathname,
          }
        : PAGES[currentRoute] ?? PAGES.home;

    const canonicalUrl = new URL(page.path, SITE_URL).href;

    document.title = page.title;

    const setMeta = (
      selector: string,
      attribute: string,
      key: string,
      value: string
    ) => {
      let element = document.head.querySelector(
        selector
      ) as HTMLMetaElement | null;

      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }

      element.setAttribute(attribute, key);
      element.setAttribute('content', value);
    };

    setMeta(
      'meta[name="description"]',
      'name',
      'description',
      page.description
    );

    setMeta(
      'meta[property="og:title"]',
      'property',
      'og:title',
      page.title
    );

    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      page.description
    );

    setMeta(
      'meta[property="og:url"]',
      'property',
      'og:url',
      canonicalUrl
    );

    setMeta(
      'meta[property="og:type"]',
      'property',
      'og:type',
      'website'
    );

    setMeta(
      'meta[name="twitter:card"]',
      'name',
      'twitter:card',
      'summary'
    );

    setMeta(
      'meta[name="twitter:title"]',
      'name',
      'twitter:title',
      page.title
    );

    setMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      page.description
    );

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;

    // Structured business data.
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HouseCleaning',
      '@id': `${SITE_URL}/#business`,
      name: 'OANK Cleaning CIC',
      url: SITE_URL,
      description:
        'OANK Cleaning CIC provides domestic and commercial cleaning services across Scotland. Headquartered in Paisley, our staff undergo certification training.',
      telephone: PRIMARY_PHONE,

      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: PRIMARY_PHONE,
          contactType: 'customer service',
          areaServed: {
            '@type': 'Country',
            name: 'Scotland',
          },
          availableLanguage: 'English',
        },
        {
          '@type': 'ContactPoint',
          telephone: ALTERNATIVE_PHONE,
          contactType: 'alternative customer service',
          areaServed: {
            '@type': 'Country',
            name: 'Scotland',
          },
          availableLanguage: 'English',
        },
      ],

      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Paisley',
        addressRegion: 'Scotland',
        addressCountry: 'GB',
      },

      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Scotland',
      },

      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Cleaning Services',
        itemListElement: SERVICES.map((name) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name,
            provider: {
              '@id': `${SITE_URL}/#business`,
            },
            areaServed: {
              '@type': 'AdministrativeArea',
              name: 'Scotland',
            },
          },
        })),
      },
    };

    const scriptId = 'json-ld-schema';

    let script = document.getElementById(
      scriptId
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
  }, [currentRoute, serviceTitle]);

  return null;
};
