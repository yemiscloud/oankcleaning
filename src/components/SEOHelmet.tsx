import React, { useEffect } from 'react';
import { PageRoute } from '../types';

interface SEOHelmetProps {
  currentRoute: PageRoute;
  serviceTitle?: string;
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({ currentRoute, serviceTitle }) => {
  useEffect(() => {
    let title = 'OANK Cleaning CIC | Community Interest Company | Paisley PA3 2PJ';
    let description = 'OANK Cleaning CIC is an independent Community Interest Company in Paisley, Scotland. Commercial & domestic cleaning, Home Reset pilot, and Employment Pathway initiatives. Call +44 75 1091 1940.';

    switch (currentRoute) {
      case 'home':
        title = 'OANK Cleaning CIC | Professional Cleaning & Social Enterprise Paisley';
        description = 'Top-rated UK cleaning service in Paisley, Scotland (PA3 2PJ). Domestic cleaning, deep cleans, end of tenancy, and community initiatives.';
        break;
      case 'services':
        title = 'Cleaning Services | Domestic, End of Tenancy & Office | OANK Cleaning CIC';
        description = 'Explore OANK Cleaning CIC’s range of professional UK cleaning services: regular housekeeping, 100% deposit back end of tenancy, carpet care, and CQC healthcare cleaning.';
        break;
      case 'service-detail':
        if (serviceTitle) {
          title = `${serviceTitle} Services Paisley & Glasgow | OANK Cleaning CIC`;
          description = `Book professional ${serviceTitle} in Paisley, Renfrewshire & Greater Glasgow. Fully vetted DBS staff, eco-friendly products, 100% satisfaction guarantee.`;
        }
        break;
      case 'community':
        title = 'Community Activities & Pilot Programmes | OANK Cleaning CIC';
        description = 'Learn about our planned community projects: OANK Home Reset (hygiene support for individuals with practical barriers) and Employment Pathway (paid training and work).';
        break;
      case 'governance':
        title = 'Governance, Policies & Compliance | OANK Cleaning CIC Paisley';
        description = 'Official CIC governance, asset lock statement, safeguarding, health & safety (COSHH), privacy (GDPR), and 100% deposit guarantee terms.';
        break;
      case 'about':
        title = 'About Us | OANK Cleaning CIC - Independent Community Interest Company';
        description = 'Learn about OANK Cleaning CIC in Paisley, Scotland. Independent, self-funded social enterprise providing professional cleaning and community impact. DBS checked staff.';
        break;
      case 'quote':
        title = 'Instant Online Cleaning Quote Calculator | OANK Cleaning CIC Paisley';
        description = 'Calculate an instant estimated price for your home or office cleaning in Paisley & Glasgow. Transparent UK pricing, zero hidden fees, fast booking.';
        break;
      case 'faqs':
        title = 'Frequently Asked Questions | OANK Cleaning CIC Scotland';
        description = 'Got questions about domestic cleaners, insurance, keys handling, CIC initiatives, or end of tenancy guarantees in Paisley? Read our helpful FAQs.';
        break;
      case 'contact':
        title = 'Get in Touch | Contact OANK Cleaning CIC Paisley | +44 75 1091 1940';
        description = 'Contact OANK Cleaning CIC in Paisley, Scotland, PA3 2PJ. Call +44 75 1091 1940 or +44 75 2244 1379, or submit our secure online form for quick callback.';
        break;
    }

    document.title = title;

    // Update meta description tag
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [currentRoute, serviceTitle]);

  return null;
};
