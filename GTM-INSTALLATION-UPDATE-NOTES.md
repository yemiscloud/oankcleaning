# OANK Cleaning CIC — GTM installation update notes

Date: 17 November 2026

## What changed

### `index.html`

- Added the Google Consent Mode v2 default state in the document head, before the GTM loader.
- Set `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` to `denied` by default.
- Set necessary functionality/security storage to `granted`; personalization storage remains denied.
- Installed GTM container `GTM-MHHNSVRF` directly in the page head.
- Deliberately omitted the GTM `noscript` iframe fallback because it cannot reliably honour the JavaScript cookie preference and could bypass the consent controls.

### `src/components/CookieConsent.tsx`

- Removed the dynamic GTM loader and its placeholder container ID. GTM is now installed only in `index.html`.
- Kept the existing cookie banner, accept/reject actions, separate Analytics and Marketing toggles, persisted preferences and settings panel.
- Kept Consent Mode v2 updates based on the visitor's saved choices.
- Added the `oank_consent_updated` data-layer event with `analytics_consent` and `marketing_consent` values. This supports GTM tags when a returning visitor already has a saved choice, and when consent changes during a visit.
- Kept direct GA4 (`G-LQB16ZXJEC`) gated by Analytics consent. Avoid duplicate GA4 tags in GTM.
- Removed the direct Meta Pixel loader, `fbq` bootstrap, init and PageView calls. Meta Pixel must be configured inside GTM.
- Kept `window.oankTrackLead` for server-confirmed contact and quote submissions. It sends `oank_lead_submitted` only while Marketing consent is granted.
- Kept Google Ads conversion placeholders and the existing Marketing-consent gate.

## GTM configuration still required

In GTM container `GTM-MHHNSVRF`, configure:

1. Meta Pixel base tag for Pixel ID `1801963148593783`, triggered by `oank_consent_updated` where `marketing_consent` is `true`, requiring `ad_storage`, initialising once and sending one PageView.
2. Meta consent-revocation tag triggered by `oank_consent_updated` where `marketing_consent` is `false`; it calls `fbq('consent','revoke')` if the Pixel is present. This revocation tag must be allowed to execute on the consent-update event even though advertising storage is denied.
3. Meta Lead tag triggered by `oank_lead_submitted`, requiring `ad_storage`, and sending one `Lead` event. Do not send personal data in the event.

Detailed sample tags and test steps are in `GOOGLE-TRACKING-SETUP.md`. GTM account configuration and publishing are separate from editing this website ZIP.

## Not yet completed / not claimed

- Google Ads conversion ID and label are still placeholders.
- The GTM container has not been edited or published from this project delivery.
- The website has not been deployed.
- Live browser/network, Tag Assistant, GA4 DebugView and Meta Events Manager tests remain to be completed after GTM configuration and deployment.
