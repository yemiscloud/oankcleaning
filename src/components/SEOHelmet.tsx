import React, { useEffect } from 'react';
import { PageRoute } from '../types';

interface SEOHelmetProps {
  currentRoute: PageRoute;
  serviceTitle?: string;
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({ currentRoute, serviceTitle }) => {
  useEffect(() => {
    let title = 'OANK Cleaning CIC | Friendly Community Cleaning | Paisley, Scotland';
    let description = 'OANK Cleaning is a friendly community cleaning company in Paisley, Scotland (PA3 2PJ). We clean homes and workplaces and help our local community. Call +44 75 1091 1940.';

    switch (currentRoute) {
      case 'home':
        title = 'OANK Cleaning CIC | Friendly Cleaning & Community Help | Paisley';
        description = 'Top-rated cleaning for homes and businesses in Paisley and Glasgow. Friendly, police-checked cleaners and free community home cleaning.';
        break;
      case 'services':
        title = 'Cleaning Services | Home, Office & Move Out | OANK Cleaning CIC';
        description = 'Explore our simple cleaning services: home cleaning, 100% deposit back move-out cleaning, carpet cleaning, and office cleaning.';
        break;
      case 'service-detail':
        if (serviceTitle) {
          title = `${serviceTitle} | OANK Cleaning CIC Paisley`;
          description = `Book friendly ${serviceTitle} in Paisley and Glasgow. Fully police-checked staff, safe soaps, and 100% satisfaction guarantee.`;
        }
        break;
      case 'community':
        title = 'Our Community Work | Free Home Cleans & Jobs | OANK Cleaning CIC';
        description = 'Learn how we help Paisley: free home cleaning for people having hard times, and real paid jobs with friendly training.';
        break;
      case 'governance':
        title = 'Our Rules & Promises | Safety & Community Care | OANK Cleaning CIC';
        description = 'Read our simple safety rules, police checks, safe soaps, and our 100% deposit back guarantee.';
        break;
      case 'about':
        title = 'About Us | Friendly Community Cleaning in Paisley | OANK Cleaning';
        description = 'Meet OANK Cleaning in Paisley, Scotland. We are an independent Community Interest Company dedicated to clean homes and good local jobs.';
        break;
      case 'quote':
        title = 'Instant Price Check | Fast Online Estimate | OANK Cleaning CIC';
        description = 'Find out how much your clean will cost in seconds! Clear prices, no hidden fees, and fast booking.';
        break;
      case 'faqs':
        title = 'Questions & Answers | Help with Cleaning | OANK Cleaning CIC';
        description = 'Have questions about our cleaners, police checks, keys, or our 100% deposit guarantee? Find easy answers here.';
        break;
      case 'contact':
        title = 'Contact Us | Talk to OANK Cleaning in Paisley | +44 75 1091 1940';
        description = 'Talk to our friendly Paisley team at +44 75 1091 1940 or send us a quick message. We are happy to help!';
        break;
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [currentRoute, serviceTitle]);

  return null;
};
