/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { PageRoute, CleaningService } from './types';
import { CLEANING_SERVICES } from './data/cleaningData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { SEOHelmet } from './components/SEOHelmet';
import { CookieConsent } from './components/CookieConsent';

// Critical Route: Statically imported for instant FCP & LCP on initial load
import { HomePage } from './pages/HomePage';

// Non-Critical Secondary Routes: Lazy loaded with code-splitting
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(m => ({ default: m.CommunityPage })));
const GovernancePage = lazy(() => import('./pages/GovernancePage').then(m => ({ default: m.GovernancePage })));
const QuotePage = lazy(() => import('./pages/QuotePage').then(m => ({ default: m.QuotePage })));
const FAQsPage = lazy(() => import('./pages/FAQsPage').then(m => ({ default: m.FAQsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const OhkayGroupPage = lazy(() => import('./pages/OhkayGroupPage').then(m => ({ default: m.OhkayGroupPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TrackJobPage = lazy(() => import('./pages/TrackJobPage').then(m => ({ default: m.TrackJobPage })));
const AdminJobsPage = lazy(() => import('./pages/AdminJobsPage').then(m => ({ default: m.AdminJobsPage })));

// Telemetry & Vitals: Only loaded and visible in development mode
const DevTelemetryModal = import.meta.env.DEV
  ? lazy(() => import('./components/DevTelemetryModal').then(m => ({ default: m.DevTelemetryModal })))
  : null;

// Route loading skeleton with zero layout shift
function RouteLoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 animate-pulse space-y-6">
      <div className="h-44 bg-slate-200/80 rounded-3xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-slate-200/70 rounded-2xl" />
        <div className="h-64 bg-slate-200/70 rounded-2xl" />
        <div className="h-64 bg-slate-200/70 rounded-2xl" />
      </div>
    </div>
  );
}

const ROUTE_PATHS: Record<Exclude<PageRoute, 'service-detail'>, string> = {
  home: '/',
  services: '/services',
  about: '/about',
  community: '/community',
  governance: '/governance',
  quote: '/quote',
  faqs: '/faqs',
  contact: '/contact',
  privacy: '/privacy-policy',
  'track-job': '/track-job',
  'admin-jobs': '/admin/jobs',
  'ohkay-group': '/ohkay-group',
};

function routeFromPath(pathname: string): { route: PageRoute; service?: CleaningService } {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const service = CLEANING_SERVICES.find((item) => cleanPath === `/services/${item.slug}`);
  if (service) return { route: 'service-detail', service };

  const match = Object.entries(ROUTE_PATHS).find(([, path]) => path === cleanPath);
  return { route: (match?.[0] as PageRoute) ?? 'home' };
}

export default function App() {
  const initialRoute = routeFromPath(window.location.pathname);
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(initialRoute.route);
  const [selectedService, setSelectedService] = useState<CleaningService>(
    initialRoute.service ?? CLEANING_SERVICES[0]
  );

  useEffect(() => {
    const handlePopState = () => {
      const next = routeFromPath(window.location.pathname);
      setCurrentRoute(next.route);
      if (next.service) setSelectedService(next.service);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPath = (path: string) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
  };

  const handleNavigate = (route: PageRoute) => {
    if (route !== 'service-detail') {
      navigateToPath(ROUTE_PATHS[route]);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (service: CleaningService) => {
    setSelectedService(service);
    navigateToPath(`/services/${service.slug}`);
    setCurrentRoute('service-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0F382C]">
      {/* Dynamic SEO Tags */}
      <SEOHelmet currentRoute={currentRoute} serviceTitle={selectedService?.title} />

      {/* Main Header Navigation */}
      <Header currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Dynamic Page Views with Suspense */}
      <main className="flex-grow">
        {currentRoute === 'home' && (
          <HomePage onNavigate={handleNavigate} onSelectService={handleSelectService} />
        )}

        <Suspense fallback={<RouteLoadingFallback />}>
          {currentRoute === 'about' && <AboutPage onNavigate={handleNavigate} />}
          {currentRoute === 'services' && (
            <ServicesPage onNavigate={handleNavigate} onSelectService={handleSelectService} />
          )}
          {currentRoute === 'service-detail' && (
            <ServiceDetailPage service={selectedService} onNavigate={handleNavigate} />
          )}
          {currentRoute === 'community' && <CommunityPage onNavigate={handleNavigate} />}
          {currentRoute === 'governance' && <GovernancePage onNavigate={handleNavigate} />}
          {currentRoute === 'quote' && <QuotePage onNavigate={handleNavigate} />}
          {currentRoute === 'faqs' && <FAQsPage onNavigate={handleNavigate} />}
          {currentRoute === 'contact' && <ContactPage onNavigate={handleNavigate} />}
          {currentRoute === 'privacy' && <PrivacyPage />}
          {currentRoute === 'track-job' && <TrackJobPage />}
          {currentRoute === 'admin-jobs' && <AdminJobsPage />}
          {currentRoute === 'ohkay-group' && <OhkayGroupPage onNavigate={handleNavigate} />}
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Performance & Telemetry Diagnostics Inspector - Only visible in Development Mode */}
      {DevTelemetryModal && (
        <Suspense fallback={null}>
          <DevTelemetryModal />
        </Suspense>
      )}

      {/* Interactive Virtual Receptionist Clara Widget */}
      <ChatWidget onNavigate={handleNavigate} />

      {/* Privacy controls and consent-gated optional analytics/advertising */}
      <CookieConsent />
    </div>
  );
}
