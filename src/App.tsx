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

  // Initialize and synchronize with standard pathname routing (e.g. /home, /services)
  useEffect(() => {
    const parseRouteFromUrl = (): PageRoute => {
      // If legacy hash exists (e.g. #/home or #home), extract route and clear the hash
      if (window.location.hash) {
        const hashClean = window.location.hash.replace(/^#\/?/, '').trim();
        if (VALID_ROUTES.includes(hashClean as PageRoute)) {
          const cleanPath = hashClean === 'home' ? '/home' : `/${hashClean}`;
          window.history.replaceState({ route: hashClean }, '', cleanPath);
          return hashClean as PageRoute;
        } else {
          window.history.replaceState({ route: 'home' }, '', '/home');
          return 'home';
        }
      }

      // Read clean pathname
      const pathname = window.location.pathname.replace(/^\/+/, '').split('/')[0];
      if (VALID_ROUTES.includes(pathname as PageRoute)) {
        return pathname as PageRoute;
      }
      return 'home';
    };

    const initialRoute = parseRouteFromUrl();
    setCurrentRoute(initialRoute);

    // Ensure the browser address bar is set to clean /<route>
    const expectedPath = initialRoute === 'home' ? '/home' : `/${initialRoute}`;
    if (window.location.pathname !== expectedPath && !window.location.hash) {
      window.history.replaceState({ route: initialRoute }, '', expectedPath);
    }

    // Handle browser Back / Forward buttons
    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/^\/+/, '').split('/')[0];
      if (VALID_ROUTES.includes(pathname as PageRoute)) {
        setCurrentRoute(pathname as PageRoute);
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    const targetPath = route === 'home' ? '/home' : `/${route}`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({ route }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (service: CleaningService) => {
    setSelectedService(service);
    handleNavigate('service-detail');
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
