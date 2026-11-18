# OANK Cleaning CIC — Marketing & Tracking Update Notes

Package date: 17 November 2026

This delivery contains the complete updated OANK Cleaning website project, not just the standalone files from the marketer's original ZIP. The latest project source was used as the base so the marketing, cookie-consent, job-tracking and website changes remain together.

## Marketing/content changes included

- Updated website marketing copy to use the confirmed OANK Cleaning CIC services, service descriptions and starting prices.
- Kept the six confirmed services and excluded laundry.
- Updated Home Reset wording to explain that support can be free or subsidised, depending on circumstances; it does not promise every recipient a completely free clean.
- Kept the Employment / Job Training Pathway as an active programme without promising guaranteed employment outcomes.
- Removed or revised unsupported claims identified in the content review, including blanket police-check/DBS claims, NHS-standard claims, unverified guarantees, unsupported response times and unsupported deposit-return promises.
- Kept the confirmed service area as Renfrewshire and Glasgow and avoided publishing a private customer-facing office address.
- Retained the confirmed public phone number and existing GA4 / Meta Pixel identifiers.

## Tracking and consent changes included

- Installed Google Tag Manager container `GTM-MHHNSVRF` directly in `index.html`; the container loads once on every page visit.
- Added Google Consent Mode v2 defaults in the document head before the GTM script is requested. Analytics and advertising storage defaults are denied.
- Kept the cookie banner, strictly necessary category, separate Analytics and Marketing controls, saved preferences and settings dialog.
- Removed the old dynamic GTM script injection from `CookieConsent.tsx` to prevent duplicate container loads.
- Kept direct GA4 measurement ID `G-LQB16ZXJEC`, gated by Analytics consent. Do not configure duplicate GA4 page-view tags in GTM unless migrating away from the direct integration.
- Removed direct Meta Pixel script injection and `fbq` management from `CookieConsent.tsx`. Meta Pixel ID `1801963148593783` is documented for installation as a consent-gated tag inside GTM.
- Added an `oank_consent_updated` data-layer event so GTM can initialise Meta Pixel after a previously saved Marketing choice is loaded and revoke it when Marketing consent is withdrawn.
- Preserved the server-confirmed contact and quote lead hook. It emits `oank_lead_submitted` only when Marketing consent is granted.
- Kept Google Ads conversion ID and label as placeholders because the correct conversion details have not yet been provided.
- Updated `GOOGLE-TRACKING-SETUP.md` with GTM tag setup instructions, consent requirements and test cases.
- Added `GTM-INSTALLATION-UPDATE-NOTES.md`.
- Hardened both root and public `.htaccess` CSP policies. Inline scripts and inline event handlers are blocked; Consent Mode defaults and Meta Pixel code use same-origin external JavaScript files, while the GTM container script is loaded directly from `index.html`. Live host/CDN headers still need verification.

## Required GTM workspace configuration

The website source does not publish changes to your GTM account. In container `GTM-MHHNSVRF`, configure and publish the Meta Pixel base tag, consent-revocation tag and Lead event tag as described in `GOOGLE-TRACKING-SETUP.md`. The Meta tags must require Marketing consent / `ad_storage`, with the revocation event permitted to run to withdraw consent.

## Production setup and validation

1. Configure the Meta Pixel tags in GTM using Pixel ID `1801963148593783`, then preview and publish the container.
2. Add the real Google Ads conversion ID and label when available.
3. Build and deploy the website.
4. Test reject, Analytics-only, Marketing-only, both-consented, consent withdrawal, saved-consent return visit, and successful contact/quote submissions.
5. Verify with Google Tag Assistant, GA4 DebugView, Meta Events Manager Test Events and browser network tools.

This is a source-code delivery, not a deployment. The GTM workspace configuration and live network behaviour cannot be certified from this ZIP alone.

## Notes about the marketer's original ZIP

The marketer's original ZIP was reviewed, but its files were not blindly copied over the website. Some contained outdated or conflicting business details, unverified location/coverage and marketing claims, placeholders, or files that duplicated components already in the project. The reviewed and corrected website project in this package is the source of truth. Do not deploy the original marketer ZIP over this project.

## Validation status

- The attached source archive was opened and the updated tracking source, IDs, setup guide and CSP entries were reviewed.
- A full production build and live browser/network verification have not yet been completed in this delivery environment.
- The GTM container ID is installed in source. The Google Ads conversion ID and label remain placeholders. Meta tags still need to be created and published in the GTM workspace before live tracking can be verified.

This is a source-code delivery. It does not deploy changes to the live website.


## CSP hardening included

- Updated both `.htaccess` files with the stricter CSP and aligned `X-Frame-Options: DENY` with `frame-ancestors 'none'`.
- Removed the inline font `onload` handler, moved Consent Mode v2 defaults into a same-origin external script, and loaded GTM directly as an external script from `index.html`.
- Added first-party external Meta Pixel loader, Lead and revoke scripts for GTM Custom HTML tags that contain only external script references.
- Added `CSP-HARDENING-UPDATE-NOTES.md` with the policy changes and deployment test checklist.
- The CSP does not allow `'unsafe-inline'` or `'unsafe-eval'` in any directive. Inline style attributes are also blocked; the chat typing animation delays were moved into CSS classes.
