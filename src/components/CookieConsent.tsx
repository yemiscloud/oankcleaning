import React, { useEffect, useState } from 'react';

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const STORAGE_KEY = 'oank_cookie_consent_v1';
const GA_ID = 'G-LQB16ZXJEC';
// Replace these placeholders before production if Google Ads direct conversion tracking is enabled. Keep the quotes.
const GOOGLE_ADS_ID = 'AW-18535494055';
const GOOGLE_ADS_CONVERSION_LABEL = 'Leads-Search-Build';
const isConfigured = (value: string, prefix: string) => value.startsWith(prefix) && !value.includes('ENTER_');

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    oankTrackLead?: (source: 'contact' | 'quote') => void;
    __oankGaConfigured?: boolean;
  }
}

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;
    return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing, updatedAt: parsed.updatedAt || '' };
  } catch {
    return null;
  }
}

function removeCookies(prefixes: string[]) {
  document.cookie.split(';').forEach((part) => {
    const name = part.split('=')[0]?.trim();
    if (!name || !prefixes.some((prefix) => name.startsWith(prefix))) return;
    const domains = [window.location.hostname, `.${window.location.hostname}`];
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    });
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  });
}

function applyTracking(consent: Consent) {
  const adsConfigured = isConfigured(GOOGLE_ADS_ID, 'AW-') && isConfigured(GOOGLE_ADS_CONVERSION_LABEL, '');

  // Consent Mode v2 defaults are set synchronously in index.html before GTM loads.
  // Update Consent Mode v2 and notify GTM so consent-gated tags (such as Meta Pixel) react cleanly.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (...args: unknown[]) { window.dataLayer?.push(args); };
  const gtag = window.gtag as NonNullable<Window['gtag']>;
  gtag('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
    personalization_storage: consent.analytics ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  });

  window.dataLayer.push({
    event: 'oank_consent_updated',
    analytics_consent: consent.analytics,
    marketing_consent: consent.marketing,
  });

  // Retain the existing direct GA4 integration. Do not add a second GA4
  // configuration tag in GTM unless this direct integration is removed.
  if (consent.analytics) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = false;
    if (!document.getElementById('oank-google-analytics') && !document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement('script');
      script.id = 'oank-google-analytics';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
    }
    if (!window.__oankGaConfigured) {
      gtag('js', new Date());
      gtag('config', GA_ID, { anonymize_ip: true });
      window.__oankGaConfigured = true;
    }
  } else {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
    window.__oankGaConfigured = false;
    document.getElementById('oank-google-analytics')?.remove();
    removeCookies(['_ga', '_gid', '_gat']);
  }

  // Google Ads config and conversion events are marketing-consent gated.
  if (consent.marketing && adsConfigured) {
    if (!document.getElementById('oank-google-ads-library') && !document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement('script');
      script.id = 'oank-google-ads-library';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
      document.head.appendChild(script);
    }
    gtag('config', GOOGLE_ADS_ID);
  }

  // Meta Pixel is managed inside GTM via consent-gated tags on oank_consent_updated
  // and oank_lead_submitted. When Marketing consent is off, clear accessible Meta cookies.
  if (!consent.marketing) {
    removeCookies(['_fbp', '_fbc']);
  }

  // Public lead conversion hook; called only after the server confirms a saved
  // enquiry/quote. GTM triggers Meta Lead tag from oank_lead_submitted when Marketing consent is granted.
  window.oankTrackLead = (source: 'contact' | 'quote') => {
    if (!consent.marketing) return;
    window.dataLayer?.push({ event: 'oank_lead_submitted', lead_source: source });
    if (adsConfigured) {
      gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
        value: 1,
        currency: 'GBP',
      });
    }
  };
}


export const CookieConsent: React.FC = () => {
  const [consent, setConsent] = useState<Consent | null>(() => readConsent());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (consent) applyTracking(consent);
  }, [consent]);

  const saveConsent = (analyticsChoice: boolean, marketingChoice: boolean) => {
    const next: Consent = {
      necessary: true,
      analytics: analyticsChoice,
      marketing: marketingChoice,
      updatedAt: new Date().toISOString(),
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Consent controls still work for this visit. */ }
    setConsent(next);
    setSettingsOpen(false);
  };

  const openSettings = () => {
    setAnalytics(consent?.analytics ?? false);
    setMarketing(consent?.marketing ?? false);
    setSettingsOpen(true);
  };

  return (
    <>
      {!consent && (
        <section className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] sm:p-6" aria-label="Cookie preferences">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-base font-bold text-slate-900">Your privacy choices</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                We use essential storage to make this website work. With your permission, we also use analytics to understand website use and marketing technologies, including Meta Pixel, to measure advertising. You can accept all optional technologies, reject them, or choose separately. You can change your choice at any time in Cookie settings. Read our Privacy Policy for more information.
              </p>
              <a href="/privacy-policy" className="mt-2 inline-block text-xs font-semibold text-[#0F382C] underline">Read our Privacy Policy</a>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <button type="button" onClick={() => saveConsent(true, true)} className="rounded-lg bg-[#0F382C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1B4332]">Accept all</button>
              <button type="button" onClick={() => saveConsent(false, false)} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">Reject optional cookies</button>
              <button type="button" onClick={openSettings} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">Cookie settings</button>
            </div>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 p-3 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="cookie-settings-title" className="text-lg font-bold text-slate-900">Cookie settings</h2>
                <p className="mt-1 text-sm text-slate-600">Choose which optional technologies OANK Cleaning may use.</p>
              </div>
              <button type="button" onClick={() => setSettingsOpen(false)} className="rounded-md px-2 py-1 text-xl text-slate-500 hover:bg-slate-100" aria-label="Close cookie settings">×</button>
            </div>
            <div className="mt-5 divide-y divide-slate-200">
              <div className="flex items-center justify-between gap-4 py-4">
                <div><h3 className="font-semibold text-slate-900">Strictly necessary</h3><p className="text-sm text-slate-600">Required for core website functions and remembering your privacy choice.</p></div>
                <span className="shrink-0 text-xs font-semibold text-emerald-800">Always on</span>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span><span className="block font-semibold text-slate-900">Analytics</span><span className="block text-sm text-slate-600">Google Analytics and Google Tag Manager help us understand website use. GTM tags are subject to your analytics and marketing choices.</span></span>
                <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="h-5 w-5 accent-[#0F382C]" />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span><span className="block font-semibold text-slate-900">Marketing</span><span className="block text-sm text-slate-600">Meta Pixel and Google Ads help measure advertising and campaign performance.</span></span>
                <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} className="h-5 w-5 accent-[#0F382C]" />
              </label>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => saveConsent(false, false)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800">Reject optional</button>
              <button type="button" onClick={() => saveConsent(analytics, marketing)} className="rounded-lg bg-[#0F382C] px-4 py-2.5 text-sm font-semibold text-white">Save my choices</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
