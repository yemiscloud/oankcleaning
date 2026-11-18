# OANK Cleaning CIC — Master Project Knowledge Base

**Knowledge-base revision:** 17 November 2026  
**Source project:** `Oank-0.zip` from the ChatGPT Library  
**Purpose:** Working source of truth for the website architecture, production deployment, tracking, security, content and outstanding verification. This document records the state found in the supplied archive and the follow-up hardening applied in this revision. It does not certify the live website or backend.

---

## 1. Organisation and public website facts

- **Organisation:** OANK Cleaning CIC, a Community Interest Company.
- **Primary website:** `https://oankcleaning.co.uk/`.
- **Public service area:** Renfrewshire and Glasgow. OANK is a service-area business; the website should not present a private business address as a customer reception location.
- **Public telephone currently used by the website:** `+44 77 3195 6727`.
- **Public email currently used by the website:** `info@oankcleaning.co.uk`.
- **Community programmes:** OANK Home Reset and Employment Pathway. The project describes Home Reset as cleaning support and Employment Pathway as employment/job-training support; do not describe either as medical treatment, nursing or regulated personal care.

### Current website service catalogue

The current homepage source displays these starting prices. Treat them as the current website copy, not as a guarantee that every job will be charged at that amount:

| Service | Website starting price |
|---|---:|
| Regular home cleaning | From £18.50/hour |
| Deep cleaning | From £85 one-off |
| End-of-tenancy cleaning | From £145/package |
| Office and commercial cleaning | From £19.50/hour on contract |
| Care home and healthcare cleaning | Custom quote |
| Carpet and upholstery cleaning | From £45/room |

The website says final quotes depend on the property and agreed cleaning scope.

### Content conflicts to resolve before reusing older copy

Some legacy documents in the archive contain inconsistent or potentially outdated information. In particular, `GOVERNANCE.md` lists different direct telephone numbers from the current homepage. Use the current public number above unless the organisation explicitly confirms a replacement. Legacy documents also contain strong operational/compliance and guarantee claims; do not republish those claims without checking that they remain accurate, documented and approved.

---

## 2. Current application architecture

- **Frontend:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4.
- **Build command:** `npm run build` (`vite build` followed by `scripts/prerender-routes.mjs`).
- **Production document entry point:** `index.html` only. Do not restore an `index.php` entry point or use PHP as the frontend index.
- **Client application:** `src/main.tsx`, `src/App.tsx`, page components in `src/pages/`, reusable components in `src/components/`.
- **Production assets:** Vite emits fingerprinted bundles into `dist/`; files in `public/` are copied to the output, including `public/.htaccess` and the local tracking scripts.
- **Backend:** PHP endpoints are expected on the hosting account and are called by the React frontend. The supplied `Oank-0.zip` archive contains no `.php` files and no `api/` directory, so backend implementation and runtime security cannot be audited from this archive.

### Main frontend functions

- `src/components/ContactForm.tsx` — contact enquiry submission to `/api/contact`.
- `src/components/QuoteCalculator.tsx` — cleaning quote calculations and submission to `/api/quote`.
- `src/components/CookieConsent.tsx` — consent UI, saved preferences, Consent Mode v2 updates, direct GA4 setup and lead-event hook.
- `src/components/ChatWidget.tsx` — visitor chat interface; logs conversations through `/api/chat-log`.
- `src/pages/TrackJobPage.tsx` — customer job lookup through `/api/job-track`.
- `src/pages/AdminJobsPage.tsx` — admin job-management interface through `/api/job-admin`.
- `src/lib/security.ts`, `src/lib/telemetry.ts` — client-side security/telemetry utilities.

### Expected backend routes

The Apache rules and frontend expect the following PHP targets on the live host:

| Public route | Expected PHP target | Purpose |
|---|---|---|
| `/api/contact` | `api/contact.php` | Contact submissions |
| `/api/quote` | `api/quote.php` | Quote submissions |
| `/api/config` | `api/config.php` | Public configuration |
| `/api/chat-log` | `api/chat_log.php` | Chat logging |
| `/api/job-admin` | `api/job_admin.php` | Restricted admin actions |
| `/api/job-track` | `api/job_track.php` | Customer job tracking |
| `/sitemap.xml` | `api/sitemap.php` | XML sitemap |

The direct URL `/api/sitemap.php` is intentionally denied; `/sitemap.xml` is the canonical public route. Missing or unknown `/api/*` paths return 404 rather than the React HTML shell.

---

## 3. Analytics, advertising and consent architecture

### Identifiers currently in source

- **Google Tag Manager:** `GTM-MHHNSVRF`.
- **GA4 measurement ID:** `G-LQB16ZXJEC`.
- **Meta Pixel ID:** `1801963148593783`.
- **Google Ads conversion ID:** placeholder `ENTER_GOOGLE_ADS_CONVERSION_ID_HERE` in `src/components/CookieConsent.tsx`; replace only when the real ID is supplied.

### Required loading sequence

1. `index.html` synchronously loads `/js/oank-tracking-bootstrap.js` in the document head.
2. The bootstrap queues Consent Mode v2 defaults as denied for analytics and advertising before GTM loads.
3. `index.html` directly loads `https://www.googletagmanager.com/gtm.js?id=GTM-MHHNSVRF`.
4. The cookie banner updates consent after the visitor makes or retrieves a choice.
5. GA4 remains directly configured by `CookieConsent.tsx` after Analytics consent. Do not add a duplicate GA4 configuration tag in GTM unless the direct integration is deliberately removed.
6. Meta Pixel is intended to be initialised through consent-gated GTM tags after Marketing consent. The local helper scripts are:
   - `/js/oank-meta-pixel-base.js`
   - `/js/oank-meta-pixel-lead.js`
   - `/js/oank-meta-pixel-revoke.js`
7. Lead tracking uses the `oank_lead_submitted` data-layer event and the Meta `Lead` event. A lead should be emitted only after the backend confirms a successful saved submission and only under the relevant marketing consent.

### GTM workspace work still required

The website source does not publish or configure the remote GTM container. In GTM, confirm the Meta base, Lead and consent-revocation tags and triggers are configured as described in `GOOGLE-TRACKING-SETUP.md`. Marketing tags must respect Marketing consent. Rejecting optional consent must not fire GA4 or Meta optional tags. The live GTM workspace was not available for inspection during this archive review.

---

## 4. Production security baseline

### Apache files

- Root `.htaccess` is the project-level reference.
- `public/.htaccess` is the deployable copy that Vite places into `dist/`.
- These two files must remain byte-for-byte identical.
- Apache 2.4, `mod_rewrite`, `mod_headers`, `mod_expires` and `mod_deflate` are expected.

### CSP policy

The current enforced CSP:

- Defaults to same-origin resources.
- Blocks plugins/objects (`object-src 'none'`), framing (`frame-ancestors 'none'`), unapproved form destinations and inline event-handler attributes.
- Allows only the current same-origin app plus the explicitly listed Google and Meta origins needed by the tracking implementation.
- Does not contain `'unsafe-inline'` or `'unsafe-eval'` in script policy.
- Uses `script-src-attr 'none'` and `style-src-attr 'none'`.
- Includes one SHA-256 hash for the exact inline Schema.org JSON-LD script in the root `index.html`. If that JSON-LD content changes, recalculate the hash and update both `.htaccess` copies. Do not replace this with a blanket inline-script allowance.
- Restricts `manifest-src`, `media-src` and `worker-src` to same origin.

CSP changes and deployment checks are documented in `CSP-HARDENING-UPDATE-NOTES.md`.

### Other response headers and server settings

The Apache files set:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- HSTS for the current host with `max-age=31536000`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy` disabling camera, microphone and geolocation
- `X-Permitted-Cross-Domain-Policies: none`

HSTS deliberately does not currently include `includeSubDomains` or `preload`; enable those only after verifying every affected subdomain is permanently HTTPS-ready. `ServerTokens Prod`, `ServerSignature Off` and `TraceEnable Off` are server/vhost settings, not valid `.htaccess` directives. Configure them at hosting/server level if permitted. The `Server` response header was still visible in the local Apache test.

### Routing and file protections

- `index.html` is the only `DirectoryIndex`.
- React routes fall back to `index.html` only after real files/directories and API routes are considered.
- Unknown/missing `/api/*` paths return 404.
- Direct `/api/sitemap.php` access is denied; `/sitemap.xml` is routed internally to the generator.
- Directory listing is disabled.
- Hidden paths are denied except `/.well-known/`.
- `chat_history.php`, `.env` variants, `.gitignore`, `.htaccess` and `.htpasswd` are denied from direct web access.
- HTML and JSON are not given long-lived Expires caching. Generic, non-fingerprinted JS/CSS are cached for one day; fingerprinted Vite JS/CSS receive immutable one-year caching.

---

## 5. Build and deployment workflow

1. Preserve the original archive as an untouched source backup.
2. Install dependencies from `package-lock.json` with `npm ci`.
3. Run `npm run lint` and resolve TypeScript errors.
4. Run `npm run build`; this creates the Vite production assets and prerendered route pages under `dist/`.
5. Confirm `dist/.htaccess` exists and matches the source `public/.htaccess`.
6. Deploy the contents of `dist/` to the website document root. Ensure the PHP backend endpoints and required server-side configuration remain present on the host; this frontend archive is not a replacement for those backend files.
7. Confirm HTTPS, Apache modules and `.htaccess` overrides are enabled.
8. Test the homepage, all prerendered routes, quote/contact forms, job tracking, admin authentication, sitemap, cookie preferences and tracking in staging before production sign-off.

### Prerender tracking requirement

Every prerendered route must include the synchronous Consent Mode bootstrap followed by the direct GTM container script in its `<head>`. `scripts/prerender-routes.mjs` has been updated to enforce this and fail the build if either script is missing from `index.html`.

---

## 6. Known gaps and required production verification

1. **Backend absent from source ZIP:** obtain the current deployed PHP backend (and relevant server config) for a separate security and compatibility review. Do not infer its security from frontend code or route rules.
2. **Database:** review `schema.sql` and the migrations against the actual production database; take a verified backup before applying migrations.
3. **Admin access:** verify authentication, authorization, CSRF protection, session cookie flags, rate limiting and audit logging in the actual PHP admin endpoints.
4. **Secrets:** ensure database credentials, mail credentials and API keys are outside the public web root and never committed to the frontend archive.
5. **GTM:** inspect and publish the intended tags/triggers in the live `GTM-MHHNSVRF` container; test with Tag Assistant.
6. **Consent:** test Reject All, Analytics Only, Marketing Only, Accept All, saved preferences and withdrawal. Confirm optional tags do not fire before consent or after withdrawal.
7. **CSP:** inspect browser console violations on homepage and all routes, including third-party tags. Do not broaden CSP merely to silence a violation; identify the resource and add only a necessary origin or hash.
8. **Headers:** verify the actual HTTPS response contains one effective CSP header and the expected security headers. Check for duplicate or conflicting CDN/hosting headers.
9. **HSTS:** verify all subdomains before adding `includeSubDomains` or `preload`.
10. **Live functionality:** submit test enquiries and quotes; confirm database persistence, email delivery, one lead event per successful submission, and correct consent behavior.
11. **Full production build:** this revision's dependency installation (`npm ci`) did not complete in the working environment, so a full Vite build and full TypeScript type-check have not been certified here. Re-run them in the normal project environment before deployment.

---

## 7. Revision log

### 17 November 2026 — source archive hardening

- Reconciled the Apache CSP in root and public `.htaccess` and added the JSON-LD SHA-256 hash.
- Added `RewriteEngine On`, Apache 2.4 method authorization, canonical sitemap routing, direct sitemap-generator denial, hidden-file protection and 404 handling for missing API paths.
- Reduced HSTS scope pending subdomain verification and corrected caching for non-fingerprinted tracking scripts.
- Corrected prerendered pages so Consent Mode defaults and GTM load in the correct order on every generated route.
- Added this master knowledge base to centralise the current architecture, tracking decisions, security posture and unresolved production checks.
