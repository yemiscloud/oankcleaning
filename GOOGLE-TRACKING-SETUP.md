# Google Tag Manager, Consent Mode v2 and tracking setup

## IDs currently installed

- Google Tag Manager container: `GTM-MHHNSVRF` (installed directly in `index.html`).
- Google Analytics 4 measurement ID: `G-LQB16ZXJEC` (the existing direct GA4 integration is retained).
- Meta Pixel: `1801963148593783` (must be configured as a tag inside Google Tag Manager; it is not installed directly by the website source).
- Google Ads conversion ID: `ENTER_GOOGLE_ADS_CONVERSION_ID_HERE` (placeholder).
- Google Ads conversion label: `ENTER_GOOGLE_ADS_CONVERSION_LABEL_HERE` (placeholder).

Do not put the Meta Pixel base-code snippet in `index.html`, `CookieConsent.tsx`, or another website component. Manage Meta Pixel from the GTM container.

## Consent Mode v2 behaviour

The synchronous same-origin `/js/oank-tracking-bootstrap.js` runs first in the document head and sets the defaults. The external GTM script (`https://www.googletagmanager.com/gtm.js?id=GTM-MHHNSVRF`) is then loaded directly by `index.html`:

- `analytics_storage`: denied
- `ad_storage`: denied
- `ad_user_data`: denied
- `ad_personalization`: denied
- `personalization_storage`: denied
- `functionality_storage` and `security_storage`: granted

The cookie banner retains separate Analytics and Marketing choices. When a saved or new choice is applied, `CookieConsent.tsx` sends a Consent Mode v2 update and pushes an `oank_consent_updated` event with `analytics_consent` and `marketing_consent` booleans. GTM must use consent checks; loading the GTM container does not mean optional tags may run.

The implementation intentionally does not include the GTM `noscript` iframe fallback: that fallback cannot reliably apply this JavaScript-controlled consent preference and could bypass the consent gate for non-JavaScript visitors.

## Configure Meta Pixel in Google Tag Manager (Option B)

Create the following tags in container `GTM-MHHNSVRF`. Publish the container after testing.

### 1. Meta Pixel base tag

- Tag type: Custom HTML containing only an external same-origin script reference:
  ```html
  <script src="/js/oank-meta-pixel-base.js"></script>
  ```
- Trigger: Custom Event, event name `oank_consent_updated`, with condition `marketing_consent` equals `true`.
- Consent settings: require additional consent `ad_storage`.
- Pixel ID: `1801963148593783` (already configured in the first-party loader).
- The loader initialises the Pixel once, grants consent, and sends one PageView per page load. Repeated consent updates do not create duplicate initialisations or PageViews.

Do not paste the standard inline Meta Pixel bootstrap into a Custom HTML tag. The production CSP intentionally blocks inline JavaScript. The same-origin external loader is permitted by `script-src 'self'` and then loads `fbevents.js` from the explicitly allowed Meta host.

### 2. Meta Pixel consent-revocation tag

- Tag type: Custom HTML containing only:
  ```html
  <script src="/js/oank-meta-pixel-revoke.js"></script>
  ```
- Trigger: Custom Event `oank_consent_updated`, with condition `marketing_consent` equals `false`.
- Do not require `ad_storage` for this revocation tag: it must be allowed to run when consent is withdrawn.
- The local script calls `fbq('consent', 'revoke')` when the Pixel is already present. The website also clears accessible `_fbp` / `_fbc` cookies when Marketing consent is off.

### 3. Meta Lead event tag

- Tag type: Custom HTML containing only:
  ```html
  <script src="/js/oank-meta-pixel-lead.js"></script>
  ```
- Trigger: Custom Event `oank_lead_submitted`.
- Consent settings: require additional consent `ad_storage`.
- The local script sends the `Lead` event only when `window.fbq` is available.
- Fire once per lead event. Do not add names, email addresses, phone numbers, addresses, or other personal information to the event.
- The site only pushes this event after the server confirms a contact enquiry or quote request and only when Marketing consent is currently granted.

All three GTM Custom HTML tags must contain only the external `<script src="..."></script>` reference shown above. Do not put inline JavaScript into GTM Custom HTML because the CSP blocks it.

## Google Analytics and Google Ads

- Direct GA4 (`G-LQB16ZXJEC`) remains in `CookieConsent.tsx` and only loads when Analytics consent is granted. Do not add another GA4 Configuration / Google tag that sends duplicate page views in GTM unless you first remove the direct GA4 integration and deliberately migrate it.
- Google Ads conversion details remain placeholders until the correct conversion ID and label are supplied. The existing direct Google Ads conversion hook remains Marketing-consent gated.
- The website pushes `oank_lead_submitted` to the data layer after the server confirms a saved contact enquiry or quote request. If you later move Google Ads conversion tracking into GTM, disable the direct Google Ads conversion call first to avoid duplicate conversions.

## Test before publishing

1. Use a fresh browser profile or clear the site's consent storage/cookies. Confirm Consent Mode defaults are denied before the GTM container starts.
2. Reject optional cookies. Confirm GTM loads, but no GA4, Meta Pixel, or Google Ads optional tracking tags fire.
3. Grant Analytics only. Confirm GA4 loads; Meta Pixel and Google Ads remain blocked.
4. Grant Marketing only. Confirm Meta Pixel initialises once and sends one PageView; GA4 remains disabled.
5. Grant both. Confirm each system fires only its intended events.
6. Withdraw Marketing consent. Confirm the revoke tag runs, `_fbp` / `_fbc` cookies are cleared by the site where accessible, and no later Meta events are sent.
7. Submit a test contact enquiry and quote. Confirm one `oank_lead_submitted` event per successful server response and one Meta `Lead` event only when Marketing consent is granted.
8. Test consent persistence on a return visit, including an already-saved Marketing choice.
9. Check Tag Assistant, GA4 DebugView, Meta Events Manager Test Events, browser network requests, and the live response CSP.

GTM loading is not proof that optional tracking is permitted. Every optional tag must enforce the relevant consent state.


## Content Security Policy compatibility

- The site loads Consent Mode defaults from `/js/oank-tracking-bootstrap.js`, synchronously in the document head, then loads the GTM script directly from `index.html`.
- `script-src` does not include `'unsafe-inline'` or `'unsafe-eval'`.
- GTM Meta tags must load the same-origin external files under `/js/`; those files load the Meta library from `https://connect.facebook.net`.
- Do not use inline Custom HTML snippets, `eval`, or tag templates that require unsafe inline script execution.
- The policy blocks inline style attributes (`style-src-attr 'none'`) and inline script attributes (`script-src-attr 'none'`). The chat typing animation now uses CSS classes.
- Both root and `public/.htaccess` carry the same header policy. Verify which file is active at the hosting document root and check the actual response headers after deployment.
