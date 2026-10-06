import React, { useState, useEffect } from 'react';
import { PageRoute, CleaningService } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEOHelmet } from './components/SEOHelmet';
import { ChatWidget } from './components/ChatWidget';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { CommunityPage } from './pages/CommunityPage';
import { GovernancePage } from './pages/GovernancePage';
import { AboutPage } from './pages/AboutPage';
import { QuotePage } from './pages/QuotePage';
import { FAQsPage } from './pages/FAQsPage';
import { ContactPage } from './pages/ContactPage';

import { CLEANING_SERVICES } from './data/cleaningData';

const VALID_ROUTES: PageRoute[] = [
  'home',
  'services',
  'service-detail',
  'community',
  'governance',
  'about',
  'quote',
  'faqs',
  'contact'
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedService, setSelectedService] = useState<CleaningService | null>(
    CLEANING_SERVICES[0]
  );

  // Initialize and synchronize with standard pathname routing (e.g. /, /services, /services/domestic-cleaning)
  useEffect(() => {
    const parseRouteFromUrl = (): { route: PageRoute; service?: CleaningService } => {
      // If legacy hash exists (e.g. #/services or #services), extract and resolve
      if (window.location.hash) {
        const hashClean = window.location.hash.replace(/^#\/?/, '').trim();
        const hashParts = hashClean.split('/');
        if (hashParts[0] === 'services' && hashParts[1]) {
          const matched = CLEANING_SERVICES.find(s => s.slug === hashParts[1] || s.id === hashParts[1]);
          if (matched) {
            window.history.replaceState({ route: 'service-detail', slug: matched.slug }, '', `/services/${matched.slug}`);
            return { route: 'service-detail', service: matched };
          }
        }
        if (VALID_ROUTES.includes(hashClean as PageRoute)) {
          const cleanPath = hashClean === 'home' ? '/' : `/${hashClean}`;
          window.history.replaceState({ route: hashClean }, '', cleanPath);
          return { route: hashClean as PageRoute };
        }
      }

      // Read clean pathname
      const pathSegments = window.location.pathname.replace(/^\/+/, '').split('/');
      const mainPath = pathSegments[0] || '';

      if (mainPath === '' || mainPath === 'home') {
        return { route: 'home' };
      }

      if (mainPath === 'services' && pathSegments[1]) {
        const slug = pathSegments[1];
        const matched = CLEANING_SERVICES.find(s => s.slug === slug || s.id === slug);
        if (matched) {
          return { route: 'service-detail', service: matched };
        }
        return { route: 'services' };
      }

      if (VALID_ROUTES.includes(mainPath as PageRoute)) {
        return { route: mainPath as PageRoute };
      }

      return { route: 'home' };
    };

    const initial = parseRouteFromUrl();
    setCurrentRoute(initial.route);
    if (initial.service) {
      setSelectedService(initial.service);
    }

    // Handle browser Back / Forward buttons
    const handlePopState = () => {
      const parsed = parseRouteFromUrl();
      setCurrentRoute(parsed.route);
      if (parsed.service) {
        setSelectedService(parsed.service);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    const targetPath = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({ route }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (service: CleaningService) => {
    setSelectedService(service);
    setCurrentRoute('service-detail');
    const targetPath = `/services/${service.slug}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ route: 'service-detail', slug: service.slug }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-slate-900 font-sans selection:bg-[#74C69D] selection:text-[#0F382C]">
      {/* Dynamic SEO Meta & Document Title */}
      <SEOHelmet
        currentRoute={currentRoute}
        serviceTitle={selectedService?.title}
      />

      {/* Main Header */}
      <Header currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* View Switcher */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectService={handleSelectService}
          />
        )}

        {currentRoute === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onSelectService={handleSelectService}
          />
        )}

        {currentRoute === 'service-detail' && selectedService && (
          <ServiceDetailPage
            service={selectedService}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'community' && (
          <CommunityPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'governance' && (
          <GovernancePage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentRoute === 'quote' && <QuotePage onNavigate={handleNavigate} />}

        {currentRoute === 'faqs' && <FAQsPage onNavigate={handleNavigate} />}

        {currentRoute === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Interactive Instant Chat & Support Assistant (Strictly grounded in operation.md) */}
      <ChatWidget onNavigate={handleNavigate} />

      {/* Main Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
