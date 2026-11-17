# OANK Cleaning CIC — SEO and crawlability changes

## What changed

- Added URL-aware React navigation for `/services`, `/about`, `/contact` and individual service URLs. Browser back/forward navigation is supported.
- Added a build-time pre-render step that creates readable HTML for Services, About, Contact and each of the six service detail pages. These pages contain real headings, descriptions, prices and ordinary links before JavaScript runs.
- Added `public/robots.txt` allowing public pages to be crawled while excluding `/api/` endpoints from search crawling.
- Updated the PHP sitemap to list the implemented routes and all six service detail pages. `/sitemap.xml` continues to be served through the existing Apache rewrite.
- Rewrote `public/llms.txt` with the confirmed six services, published starting prices, service area and primary contact number. Removed API endpoint documentation and conflicting phone numbers.
- Updated the homepage structured data and metadata. The public schema no longer publishes a street address or unsupported geographic coordinates.
- Removed the public office street addresses from the Contact page and replaced them with the confirmed service-area description.
- Standardised the public telephone number to +44 77 3195 6727.
- Removed unconfirmed deposit-return / free-reclean promises from customer-facing pages and the chatbot.
- Removed outdated private postcode/address references from visible contact content and form defaults.

## Confirmed service information used

- Regular domestic/home cleaning — from £18.50 per hour.
- Deep cleaning — from £85 one-off.
- End-of-tenancy cleaning — from £145 per package.
- Office and commercial cleaning — from £19.50 per hour on contract.
- Care home and healthcare cleaning — custom quote.
- Carpet and upholstery cleaning — from £45 per room.
- Service area: the whole of Renfrewshire and Glasgow.
- Primary phone: +44 77 3195 6727.

Prices are displayed as starting prices where applicable.

## Deployment

The existing GitHub Actions workflow builds the Vite project and uploads `dist/*` plus the PHP `api/` directory. The new pre-render script is part of `npm run build`, so the generated route directories will be included in the frontend deployment.

Deploy by merging/pushing the updated project to the branch used by the existing production workflow. Do not upload the source tree directly to the web root.

## Validation and limitations

- The pre-render script passed `node --check`.
- The pre-render script was exercised against a simulated Vite build output and generated all nine expected HTML pages.
- `api/sitemap.php` passed PHP syntax validation, and its output parsed as valid XML with 15 URLs.
- The homepage JSON-LD parsed as valid JSON and contains six service offers.
- A full Vite/TypeScript build could not be completed in this environment because `npm ci` could not download all dependencies from the npm registry. Run `npm ci` and `npm run build` in the deployment environment before publishing.
- After deployment, test `/services`, `/about`, `/contact`, each service URL and `/sitemap.xml` in a browser, then use Google Search Console URL Inspection to test the live pages.

## Items still needing owner verification

The original project contains other claims and content outside the three main public pages (for example, staff screening/insurance statements, testimonials, community programme details and some governance statements). Those should be checked against current business records before they are promoted as factual SEO content. This update does not certify those claims.
