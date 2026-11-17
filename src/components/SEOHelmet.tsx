
import React, { useEffect } from 'react';
import { PageRoute } from '../types';

interface SEOHelmetProps {
  currentRoute: PageRoute;
  serviceTitle?: string;
}

const SITE_URL = 'https://oankcleaning.co.uk';

const PRIMARY_PHONE = '+447731956727';


const PAGES: Record<
  string,
  { title: string; description: string; path: string }
> = {
  home: {
    title: 'OANK Cleaning CIC | Cleaning Services Across Renfrewshire and Glasgow',
    description:
      'OANK Cleaning CIC provides six cleaning services across Renfrewshire and Glasgow and delivers Home Reset and Employment Pathway community programmes. Call +44 77 3195 6727.',
    path: '/',
  },

  services: {
    title: 'Cleaning Services Across Renfrewshire and Glasgow | OANK Cleaning CIC',
    description:
      'Explore six cleaning services from OANK Cleaning CIC, with published starting prices for domestic, deep, end-of-tenancy, office and carpet cleaning across Renfrewshire and Glasgow.',
    path: '/services',
  },

  community: {
    title: 'Home Reset & Employment Pathway | OANK Cleaning CIC',
    description:
      'Discover OANK Home Reset, offering free or subsidised cleaning support, and our Employment Pathway for employment and job training support.',
    path: '/community',
  },

  governance: {
    title: 'Our Policies & Standards | OANK Cleaning CIC',
    description:
      'Learn about OANK Cleaning CIC, its community purpose, Home Reset support and Employment Pathway.',
    path: '/governance',
  },

  about: {
    title: 'About OANK Cleaning CIC | Paisley, Scotland',
    description:
      'Learn about OANK Cleaning CIC, its cleaning services and its active community programmes across Renfrewshire and Glasgow.',
    path: '/about',
  },

  quote: {
    title: 'Request a Cleaning Quote | OANK Cleaning CIC',
    description:
      'Request a cleaning quote from OANK Cleaning CIC. Explore our services and check availability across Renfrewshire and Glasgow.',
    path: '/quote',
  },

  faqs: {
    title: 'Cleaning FAQs | OANK Cleaning CIC',
    description:
      'Find answers to common questions about our cleaning services, staff training, bookings and service arrangements.',
    path: '/faqs',
  },

  'ohkay-group': {
    title: 'OANK Cleaning CIC | About Our Group',
    description: 'Information about OANK Cleaning CIC and its group structure.',
    path: '/ohkay-group',
  },

  'track-job': { title: 'Track Your Cleaning Job | OANK Cleaning CIC', description: 'Check the status of your OANK Cleaning enquiry or job using your reference code.', path: '/track-job' },
  'admin-jobs': { title: 'Admin Job Updates | OANK Cleaning CIC', description: 'Restricted OANK Cleaning job administration.', path: '/admin/jobs' },
  privacy: {
    title: 'Privacy Policy | OANK Cleaning CIC',
    description: 'Read how OANK Cleaning CIC collects, uses and protects personal information, including website enquiries and cookie preferences.',
    path: '/privacy-policy',
  },

  contact: {
    title: 'Contact OANK Cleaning CIC | Renfrewshire and Glasgow Cleaning',
    description:
      'Contact OANK Cleaning CIC about cleaning services across Renfrewshire and Glasgow. Call +44 77 3195 6727.',
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
            title: `${serviceTitle} Across Renfrewshire and Glasgow | OANK Cleaning CIC`,
            description:
              `Explore ${serviceTitle} from OANK Cleaning CIC, serving homes and workplaces across Renfrewshire and Glasgow. Contact us for availability and a quote.`,
            path: window.location.pathname,
          }
        : PAGES[currentRoute] ?? PAGES.home;

    const canonicalUrl = new URL(page.path, SITE_URL).href;

    document.title = page.title;
    let robots = document.head.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.content = currentRoute === 'admin-jobs' || currentRoute === 'track-job' || currentRoute === 'ohkay-group' ? 'noindex,nofollow' : 'index,follow';

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

    // Structured business data uses confirmed public details only.
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CleaningService',
      '@id': `${SITE_URL}/#business`,
      name: 'OANK Cleaning CIC',
      url: SITE_URL,
      description:
        'OANK Cleaning CIC provides domestic, deep, end-of-tenancy, office, healthcare, and carpet and upholstery cleaning across Renfrewshire and Glasgow.',
      telephone: PRIMARY_PHONE,
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Renfrewshire, Scotland' },
        { '@type': 'City', name: 'Glasgow, Scotland' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Cleaning Services',
        itemListElement: SERVICES.map((name) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name,
            provider: { '@id': `${SITE_URL}/#business` },
          },
        })),
      },
    };

    let script = document.getElementById(
      'json-ld-schema'
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [currentRoute, serviceTitle]);

  return null;
};
