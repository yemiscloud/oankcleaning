# Privacy Policy implementation notes

A dedicated `/privacy-policy` route has been added, linked from the footer, cookie panel, contact form and quote form, and included in the generated sitemap and prerendered route list.

The policy reflects the current website code: contact and quote form fields, the local receptionist chat and its server-side transcript logging (including IP address and browser user-agent), Google Analytics and Meta Pixel gated by the site's consent preferences, and the website's enquiry storage/email workflow.

## Owner actions before treating this as final compliance documentation

1. Confirm the actual website hosting, database and email providers and check their data-processing terms and locations.
2. Set and implement written retention periods for enquiry database records and `chat_history.php`. The current application does not enforce automatic deletion of these records.
3. Confirm the lawful-basis assessment and legitimate-interests assessment for chat transcript logging and website security logs.
4. Confirm whether OANK Cleaning CIC has appointed a Data Protection Officer and whether it has an ICO registration/fee obligation; add any applicable details.
5. Review Google Analytics and Meta Business settings, retention settings, transfer safeguards and cookie behaviour in a live browser before deployment.
6. The policy is a practical website draft, not a substitute for legal advice or a complete data-protection compliance audit.

The `.htaccess` rule also denies direct web access to the root `chat_history.php` transcript file. Verify the deployed Apache configuration enforces this rule.
