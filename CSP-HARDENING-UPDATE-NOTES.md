# OANK Cleaning CIC — CSP Hardening Update Notes

Package date: 17 November 2026

## Files changed

- `.htaccess`
- `public/.htaccess`
- `index.html`
- `src/components/ChatWidget.tsx`
- `src/index.css`
- `public/js/oank-tracking-bootstrap.js` (new)
- `public/js/oank-meta-pixel-base.js` (new)
- `public/js/oank-meta-pixel-lead.js` (new)
- `public/js/oank-meta-pixel-revoke.js` (new)
- `GOOGLE-TRACKING-SETUP.md`
- `GTM-INSTALLATION-UPDATE-NOTES.md`
- `MARKETING-TRACKING-DELIVERY-NOTES.md`

## What changed

### CSP

- Removed general inline-script permission. `script-src` contains no `'unsafe-inline'` or `'unsafe-eval'`.
- Added `script-src-attr 'none'` to block inline event-handler attributes.
- Restricted style policy to same-origin stylesheets and Google Fonts; set `style-src-attr 'none'`; moved the three React chat typing animation delays into named CSS classes.
- Retained explicit image, font, connection and frame allowlists for the website's Google and Meta integrations.
- Kept `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and `frame-ancestors 'none'`.
- Changed `X-Frame-Options` from `SAMEORIGIN` to `DENY` to match `frame-ancestors 'none'`.
- Added a restrictive Permissions-Policy disabling camera, microphone and geolocation.
- Kept the existing HSTS policy. `includeSubDomains` and `preload` must only be retained if every relevant subdomain is permanently HTTPS-ready.

### GTM / Consent Mode compatibility

- Moved Consent Mode v2 defaults into `/js/oank-tracking-bootstrap.js`; `index.html` then loads the GTM JavaScript directly from `https://www.googletagmanager.com/gtm.js`.
- The local bootstrap runs synchronously from the head and sets denied defaults before requesting GTM.
- Added same-origin external Meta Pixel files for base initialisation, Lead events and consent revocation. These are intended to be loaded by consent-gated GTM tags.
- Updated the GTM guide: do not use inline JavaScript in Custom HTML tags; use only the documented same-origin external script references.

### HTML cleanup

- Removed the Google Fonts `onload` inline event handler. Google Fonts now uses a normal stylesheet link so `script-src-attr 'none'` can be enforced.

## Deployment and verification checklist

1. Deploy the project to a staging URL first.
2. Confirm the deployed response has exactly one effective `Content-Security-Policy` header. If the hosting platform/CDN adds another CSP, reconcile the policies rather than assuming they merge harmlessly.
3. Confirm `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, Referrer-Policy and Permissions-Policy are present.
4. Inspect the browser console for CSP violations on home, services, quote, contact, privacy and job-tracking pages.
5. Confirm `/js/oank-tracking-bootstrap.js` returns HTTP 200 and Consent Mode defaults are queued before the GTM request.
6. Reject optional cookies: GTM may load, but no GA4, Meta Pixel or Google Ads optional tags should fire.
7. Grant Analytics only: GA4 should load; Meta should remain blocked.
8. Grant Marketing only: Meta Pixel should initialise once; GA4 should remain disabled.
9. Withdraw Marketing consent: the revoke tag should run, `_fbp` / `_fbc` cookies should be cleared where accessible, and no further Meta events should be sent.
10. Submit test contact and quote requests: verify one `oank_lead_submitted` event and one Meta Lead event only with Marketing consent.
11. Test GTM Preview / Tag Assistant. If preview requires extra origins, add only the specific documented preview origins temporarily or to a separate staging policy; do not broaden the production policy without need.
12. Verify all pages and API forms after deployment.

## Validation limitations

- This package has been checked statically and its ZIP integrity will be checked before delivery.
- The live Apache response headers, CDN headers, real browser CSP reports, GTM workspace configuration and Meta Events Manager events cannot be verified from the source archive alone.
- A staging browser test and production-host verification are still required before declaring the policy fully validated.


## CSP reporting

No `report-to` / `report-uri` endpoint was added. The project does not currently include a dedicated, access-controlled CSP report collector. Add reporting only after a suitable endpoint or managed reporting service is selected; otherwise the browser would have nowhere useful and safely managed to send violation reports.


## Follow-up production hardening — 17 November 2026

The source archive was reviewed again and both Apache files (`.htaccess` and `public/.htaccess`) were updated together. The public copy is the one Vite places into the deployable `dist/` directory.

### CSP changes

- Added a SHA-256 source expression for the exact inline Schema.org JSON-LD block in `index.html`. This keeps structured data available to search engines without permitting general inline JavaScript. If that JSON-LD block is edited, its hash must be recalculated and both Apache CSP copies updated.
- Kept `script-src-attr 'none'`, `style-src-attr 'none'`, and no `unsafe-inline` / `unsafe-eval`. A source scan found no React `style` props or literal inline style attributes in `src/`; verify in a real browser after deployment, particularly any third-party GTM Custom HTML tags.
- Added explicit `manifest-src`, `media-src`, and `worker-src` restrictions, all same-origin. Kept the existing explicit Google / Meta destinations required by the current tracking setup.
- Did not add CSP reporting because this project still has no secured report-collection endpoint.

### Apache and delivery changes

- Added `RewriteEngine On` within the rewrite module guard; previously rewrite rules were present without enabling the engine in these files.
- Fixed `scripts/prerender-routes.mjs` so every generated route includes the synchronous Consent Mode v2 bootstrap followed by the direct GTM container script in the document head. The build now fails if either required script is missing from the root template.
- Replaced legacy Apache 2.2 `Order` / `Deny` syntax in the method restriction with Apache 2.4 `Require all denied`.
- Kept `index.html` as the sole document entry point and SPA fallback; no `index.php` fallback was introduced.
- Kept `/sitemap.xml` as the canonical sitemap route and deny direct browser requests to `/api/sitemap.php`.
- Removed the duplicate `/api/sitemap` alias and duplicate chat-log underscore alias; the frontend calls `/api/chat-log`. Unknown or missing `/api/*` paths now return 404 instead of falling through to the React HTML shell.
- Added a deny rule for hidden paths except `/.well-known/`, plus explicit protection for private transcript and environment files.
- Removed HSTS `includeSubDomains` and `preload` pending confirmation that every subdomain is permanently HTTPS-only. The apex host still receives a one-year HSTS policy.
- Removed `ServerSignature` and `TraceEnable` directives from `.htaccess` because they are server/vhost-level settings, not valid per-directory directives. Configure `ServerTokens Prod`, `ServerSignature Off`, and `TraceEnable Off` in the hosting Apache server/vhost configuration if the host permits it. The `Server` response header remained visible in the local Apache test; `.htaccess` cannot reliably remove it.
- Changed generic CSS/JavaScript caching to one day so the non-fingerprinted consent bootstrap and Meta helper scripts do not remain stale for a year. Fingerprinted Vite JS/CSS assets receive immutable one-year caching. HTML and JSON remain non-cacheable by Expires policy.

### Important verification boundary

This ZIP contains no PHP source files or `api/` directory, although the Apache rules and frontend expect PHP endpoints such as `api/contact.php`, `api/quote.php`, `api/chat_log.php`, `api/job_admin.php`, `api/job_track.php`, and `api/sitemap.php`. Their existence, authorization, validation, CSRF protections, response headers, and runtime behavior cannot be audited from this archive. Do not treat the backend as security-verified based on this frontend package.

The SHA-256 allowlist covers only the current JSON-LD block on the root homepage; generated prerender pages do not currently embed that JSON-LD block. If prerendering or later editing changes that inline block in generated HTML, recompute the hash against the final generated HTML and verify the deployed header. GTM container configuration and actual browser behavior still require staging tests.

### Local verification performed in this revision

- Apache 2.4 configuration syntax passed with `mod_rewrite`, `mod_headers`, `mod_expires` and `mod_deflate` loaded.
- Local Apache request smoke tests: homepage and React route returned 200; a known API rewrite returned 200 using a temporary placeholder file; unknown API path returned 404; `/sitemap.xml` rewrote successfully using a temporary placeholder; direct `/api/sitemap.php`, `chat_history.php`, `.env` and `.git` access returned 403.
- `node --check` passed for the prerender script and all local tracking JavaScript files.
- TypeScript transpilation syntax check passed for all 31 `.ts` / `.tsx` source files (syntax only; not a full project type-check).
- A prerender harness generated all 15 configured route pages and confirmed the Consent Mode bootstrap appears before GTM on the services, contact, quote, privacy-policy and service-detail routes.
- Root and public `.htaccess` files were confirmed byte-for-byte identical; the JSON-LD CSP hash was recalculated and matched.
- `npm ci` did not complete in this environment, so the complete Vite production build and full TypeScript type-check remain outstanding. Temporary placeholder PHP files used only for rewrite smoke tests were removed; no backend PHP files were added to the project.
