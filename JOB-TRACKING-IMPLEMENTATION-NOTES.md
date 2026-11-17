# OANK Cleaning job tracking implementation

## New features
- Customer tracking page: `/track-job` (reference-only lookup; displays name, service, preferred date and status). Customer confirmation emails include a direct link to this page and remind customers to keep their reference private.
- Admin page: `/admin/jobs` (not linked publicly; email OTP sign-in to `info@oankcleaning.co.uk`).
- Each delivery status update requires a fresh, one-use email OTP.
- Successful updates set `status` to `Delivered`, record timestamps and append an audit row to `job_status_history`.
- New contact and quote submissions receive `OANK-` plus 24 uppercase hexadecimal characters (96 bits of random entropy). Existing references are preserved and remain available to admins.

## Required database migration
Before deploying the updated site, run `migrations/2026-11-15-job-tracking.sql` once against the production database. Back up the database first. The migration adds delivery timestamps and creates OTP and status-history tables; it does not rewrite existing customer records.

## Email requirement
The PHP host must be configured to send mail from the website. OTPs are sent to the fixed `NOTIFICATION_EMAIL` value (`info@oankcleaning.co.uk`). Test delivery to that mailbox before enabling the feature for live use.

## Deployment order
1. Back up the production database and website files.
   - Customer tracking URL: `https://oankcleaning.co.uk/track-job`
   - Admin update URL: `https://oankcleaning.co.uk/admin/jobs` (share only with authorised staff; email OTP is still required).
2. Run the SQL migration.
3. Deploy the updated PHP API files and root `.htaccess`.
4. Deploy the built frontend (`dist`) and ensure the API PHP files are deployed at `/api/`.
5. Test an admin OTP sign-in, job lookup, delivery OTP, Delivered update, and customer tracking with a test record.
6. Only after the deletion process is implemented and verified should automatic retention cleanup be enabled.

## Security notes and limitations
- Admin pages are not protected by obscurity of their URL; all job data access is gated by email OTP authentication.
- Admin sessions use HttpOnly, SameSite=Strict cookies, a CSRF token, a 30-minute idle expiry, and per-IP OTP request throttling.
- Delivery OTPs expire after 10 minutes, are stored as password hashes, are single-use and allow at most five verification attempts.
- Public tracking returns only limited job fields, not email, phone, postcode or enquiry message. New references have 96 bits of randomness. Legacy six-digit `OANK-123456` and `QUOTE-123456` references remain searchable by admins but are intentionally not accepted by the public tracker; customers with older references should contact the team. Older six-digit references remain supported by the admin lookup but should not be exposed through public tracking.
- Confirm the production PHP version supports modern session cookie options and that the site is served over HTTPS.
- This implementation currently supports the requested Pending-to-Delivered workflow; it does not add booking acceptance, rescheduling, cancellation or multiple delivery states.
