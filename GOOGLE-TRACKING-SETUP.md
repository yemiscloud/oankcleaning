# Google Tag Manager, Consent Mode v2 and tracking setup

## IDs currently installed

- Google Tag Manager container: `GTM-MHHNSVRF` (installed directly in `index.html`).
- Google Analytics 4 measurement ID: `G-LQB16ZXJEC` (the existing direct GA4 integration is retained).
- Meta Pixel: `1801963148593783` (must be configured as a tag inside Google Tag Manager; it is not installed directly by the website source).
- Google Ads conversion ID: `ENTER_GOOGLE_ADS_CONVERSION_ID_HERE` (placeholder).
- Google Ads conversion label: `ENTER_GOOGLE_ADS_CONVERSION_LABEL_HERE` (placeholder).

Do not put the Meta Pixel base-code snippet in `index.html`, `CookieConsent.tsx`, or another website component. Manage Meta Pixel from the GTM container.

## Consent Mode v2 behaviour

The GTM bootstrap is in the document head in `index.html`. Before the GTM script is requested, the page initialises `dataLayer` and sets these defaults:

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

- Tag type: Custom HTML (or a trusted Meta Pixel template if your GTM workspace provides one).
- Trigger: Custom Event, event name `oank_consent_updated`, with condition `marketing_consent` equals `true`.
- Consent settings: require additional consent `ad_storage`.
- Pixel ID: `1801963148593783`.
- Initialise the pixel once, then send one `PageView`. Guard initialisation so later consent updates do not initialise it or send duplicate PageViews.
- On a later consent withdrawal, the revoke tag below must revoke the existing pixel consent.

Example Custom HTML for the base tag (use only in GTM, not in the site source):

```html
<script>
(function() {
  if (typeof window.fbq !== 'function') {
    !function(f,b,e,v,n,t,s) {
      if (f.fbq) return; n=f.fbq=function() {
        n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq=n; n.push=n; n.loaded=true; n.version='2.0'; n.queue=[];
      t=b.createElement(e); t.async=true; t.src=v;
      s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  }
  if (!window.__oankMetaPixelInitialised) {
    window.fbq('init','1801963148593783');
    window.fbq('track','PageView');
    window.__oankMetaPixelInitialised=true;
  }
  window.fbq('consent','grant');
})();
</script>
```

If your GTM Custom HTML tag is checked by a strict Content Security Policy, confirm the deployed policy permits GTM and Meta endpoints. The project `.htaccess` policies already list the required Google and Meta hosts; the hosting/CDN may apply additional headers.

### 2. Meta Pixel consent-revocation tag

- Tag type: Custom HTML.
- Trigger: Custom Event `oank_consent_updated`, with condition `marketing_consent` equals `false`.
- This tag must be allowed to run for the consent-update event even when `ad_storage` is denied, because its job is to revoke permission. Do not give it permission to send marketing events.
- Code:

```html
<script>
if (typeof window.fbq === 'function') {
  window.fbq('consent','revoke');
}
</script>
```

### 3. Meta Lead event tag

- Tag type: Custom HTML (or Meta template event tag).
- Trigger: Custom Event `oank_lead_submitted`.
- Consent settings: require additional consent `ad_storage`.
- Event: `Lead`.
- Fire once per lead event. Do not add names, email addresses, phone numbers, addresses, or other personal information to the event.
- The site only pushes this event after the server confirms a contact enquiry or quote request and only when Marketing consent is currently granted.

Example event code:

```html
<script>
if (typeof window.fbq === 'function') {
  window.fbq('track','Lead');
}
</script>
```

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
