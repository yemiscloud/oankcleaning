# Cookie consent implementation

## What changed

- Added a consent interface with **Accept all**, **Reject optional cookies**, and granular **Cookie settings**.
- Essential storage is always on only for remembering the visitor's choice and core website operation.
- Google Analytics (`G-LQB16ZXJEC`) is now loaded only after Analytics consent.
- Meta Pixel (`1801963148593783`) is configured to be managed through Google Tag Manager and must only initialise after Marketing consent. The website component no longer loads the Pixel directly.
- Visitors can reopen Cookie settings from the persistent control at the lower-left of the page.
- Withdrawing consent updates Consent Mode, pushes an `oank_consent_updated` event for GTM revocation handling, and attempts to remove related first-party cookies.
- Updated the Content Security Policy with the specific Google and Meta script/connection hosts required for consented tracking.

## Important follow-up

GTM loads from `index.html` on every visit, but optional tags must enforce the consent state and remain blocked until the matching choice is granted. This is a technical consent control, not a legal review or a complete privacy notice. Before deployment, OANK Cleaning should ensure its Privacy Policy explains the data collected by Google and Meta, purposes, retention, recipients, international transfers, and how visitors can exercise their rights. Confirm the live cookie behaviour and Meta/Google account configurations after deployment.

## Testing status

The project dependencies were not installed in this environment, so a full Vite production build and TypeScript check could not be completed. The changes have been reviewed statically. Run `npm ci`, `npm run lint`, and `npm run build` in the deployment environment before publishing.
