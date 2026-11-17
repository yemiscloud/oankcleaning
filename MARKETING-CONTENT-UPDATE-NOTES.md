# OANK Cleaning CIC – Marketing Content Update Notes

## Applied in this update

- Standardised public business information around OANK Cleaning CIC, Renfrewshire and Glasgow, the confirmed public phone number and business email.
- Kept the six confirmed cleaning services and their confirmed starting prices in the website content and AI-readable `public/llms.txt`.
- Updated Home Reset wording to say **free or subsidised cleaning support**, depending on individual needs and circumstances.
- Updated Employment Pathway wording to describe employment and job training support without promising a particular paid placement or outcome.
- Removed unsupported public claims about police/background checks, insurance, NHS compliance, certified disinfectants, colour-coded cloth protocols, fixed carpet drying times, deposit-return guarantees, response-time guarantees and fixed opening hours.
- Removed unverified sample customer testimonials from the homepage. The testimonial section now appears only when genuine, approved testimonials are supplied.
- Reworked the quote form and PHP quote endpoint to show only confirmed starting-price guidance (or “Custom quote”) rather than invented totals, add-on fees or repeat-booking discounts. The final quote is explicitly left for OANK to confirm.
- Removed the unverified Ohkay Limited parent-company wording from customer confirmation emails and API responses; the separate group page is excluded from the sitemap and marked noindex.
- Removed the private office address from customer-facing confirmation emails.
- Replaced the former public-facing governance/compliance claims page with a plain-language overview of OANK’s community purpose, booking information and Privacy Policy link.
- Added direct links to the six service detail pages and community programme page in `public/llms.txt`.

## Still requiring owner verification before publication

- Any specific staff vetting, insurance, safeguarding qualifications, product certifications or specialist healthcare cleaning procedures.
- Exact eligibility, referral and capacity arrangements for Home Reset.
- Exact training curriculum, payment arrangements and current vacancies under the Employment Pathway.
- Any customer testimonials, awards, external accreditations or service guarantees.
- Whether the separate Ohkay Limited group page and its other brand descriptions should be publicly linked from this OANK website.

## Validation status

- Source copy, quote pricing logic, customer email wording and machine-readable content updated.
- TypeScript/TSX syntax transpilation passed for 31 source files; PHP syntax checks passed for all API PHP files; the PHP sitemap output parsed as valid XML; prerender script passed Node syntax check.
- Full frontend build not verified: dependency installation (`npm ci`) timed out in this environment, so Vite/TypeScript production compilation could not be completed.
- No changes have been deployed to the live website.
