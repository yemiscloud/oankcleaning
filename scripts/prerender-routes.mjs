import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('Vite build output dist/index.html was not found.');
const template = fs.readFileSync(indexPath, 'utf8');

// Fail-safe: Vite normally copies public/ into dist/. Explicitly verify and
// restore the consent/tracking scripts before prerendering so a successful
// build can never silently omit a script referenced by index.html or GTM.
const trackingAssets = [
  'js/oank-tracking-bootstrap.js',
  'js/oank-meta-pixel-base.js',
  'js/oank-meta-pixel-lead.js',
  'js/oank-meta-pixel-revoke.js',
];
for (const asset of trackingAssets) {
  const source = path.resolve('public', asset);
  const destination = path.join(dist, asset);
  if (!fs.existsSync(source)) {
    throw new Error(`Required public tracking asset is missing: ${source}`);
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  if (!fs.existsSync(destination) || fs.statSync(destination).size === 0) {
    throw new Error(`Tracking asset was not copied into the production build: ${destination}`);
  }
}
const privacyPolicyBody = fs.readFileSync(path.resolve('scripts/privacy-policy-prerender.html'), 'utf8');
const scripts = [...template.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"[^>]*><\/script>/g)].map(m => m[0]);
const styles = [...template.matchAll(/<link[^>]+rel="stylesheet"[^>]+>/g)].map(m => m[0]);
const scriptTags = scripts.join('\n');
const styleTags = styles.join('\n');

// Keep consent defaults and the directly-installed GTM container on every
// prerendered route, not only the root index.html. The bootstrap must remain
// before GTM so Consent Mode v2 defaults enter dataLayer before GTM executes.
const consentBootstrapTag = template.match(/<script src="\/js\/oank-tracking-bootstrap\.js"><\/script>/)?.[0];
const gtmContainerTag = template.match(/<script async src="https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-MHHNSVRF"><\/script>/)?.[0];
if (!consentBootstrapTag || !gtmContainerTag) {
  throw new Error('Consent bootstrap or GTM container script is missing from index.html. Refusing to generate routes without tracking consent initialization.');
}
const trackingHeadScripts = `${consentBootstrapTag}\n${gtmContainerTag}`;

const services = [
  { slug: 'domestic-cleaning', title: 'Regular Home Cleaning', price: 'From £18.50 per hour', description: 'Regular home cleaning for customers who want help keeping their homes tidy. The existing service information describes dusting, vacuuming, mopping, kitchen cleaning and bathroom cleaning.' },
  { slug: 'deep-cleaning', title: 'Deep Cleaning', price: 'From £85 one-off', description: 'A thorough one-off clean for homes that need extra attention. The existing service information includes detailed kitchen and bathroom cleaning, limescale removal and cleaning of hard-to-reach areas.' },
  { slug: 'end-of-tenancy', title: 'End-of-Tenancy Cleaning', price: 'From £145 per package', description: 'Move-out cleaning for tenants and landlords. The scope can include kitchen cupboards, oven and cooker cleaning, bathrooms, windows, skirting boards and floors.' },
  { slug: 'commercial-office', title: 'Office and Commercial Cleaning', price: 'From £19.50 per hour on contract', description: 'Cleaning for offices and business premises, including desks and touchpoints, floors, kitchens, washrooms and shared areas.' },
  { slug: 'healthcare-cleaning', title: 'Care Home and Healthcare Cleaning', price: 'Custom quote', description: 'Cleaning services for care homes and healthcare settings. Contact OANK Cleaning CIC to discuss the setting, cleaning requirements and a suitable service arrangement.' },
  { slug: 'carpet-upholstery', title: 'Carpet and Upholstery Cleaning', price: 'From £45 per room', description: 'Carpet and upholstery cleaning, including treatment of common stains and dirt. Contact the team to discuss fabric type and the areas to be cleaned.' },
];

const pages = [
  { path: 'track-job', title: 'Track Your Cleaning Job | OANK Cleaning CIC', description: 'Check the status of your OANK Cleaning enquiry or job using your reference code.', canonical: 'https://oankcleaning.co.uk/track-job', body: `<main><h1>Track your cleaning job</h1><p>Enter the reference code sent to you by OANK Cleaning CIC to check your job status.</p><p>For help, email <a href="mailto:info@oankcleaning.co.uk">info@oankcleaning.co.uk</a>.</p></main>` },
  {
    path: 'services',
    title: 'Cleaning Services in Renfrewshire and Glasgow | OANK Cleaning CIC',
    description: 'Explore six cleaning services and starting prices from OANK Cleaning CIC across Renfrewshire and Glasgow.',
    canonical: 'https://oankcleaning.co.uk/services',
    body: `<main><h1>Cleaning Services in Renfrewshire and Glasgow</h1><p>OANK Cleaning CIC provides cleaning at customers' homes and workplaces across the whole of Renfrewshire and Glasgow.</p><h2>Our cleaning services and starting prices</h2><ul>${services.map(s => `<li><h3><a href="/services/${s.slug}">${s.title}</a></h3><p><strong>${s.price}</strong></p><p>${s.description}</p></li>`).join('')}</ul><p>Prices are starting prices and may vary with the property, scope of work and booking requirements. <a href="/contact">Contact OANK Cleaning CIC</a> to discuss your requirements or <a href="/quote">request a quote</a>.</p></main>`
  },
  {
    path: 'about',
    title: 'About OANK Cleaning CIC | Renfrewshire and Glasgow',
    description: 'Learn about OANK Cleaning CIC, its community interest company status and cleaning services across Renfrewshire and Glasgow.',
    canonical: 'https://oankcleaning.co.uk/about',
    body: `<main><h1>About OANK Cleaning CIC</h1><p>OANK Cleaning CIC is a Community Interest Company based in Paisley, Scotland. It provides cleaning for homes and workplaces across the whole of Renfrewshire and Glasgow.</p><h2>Our approach</h2><p>The original project describes OANK Cleaning CIC as a community-focused cleaning organisation. Its stated community programmes include OANK Home Reset and the OANK Employment Pathway.</p><h2>Our cleaning services</h2><p>Our services include regular home cleaning, deep cleaning, end-of-tenancy cleaning, office and commercial cleaning, care home and healthcare cleaning, and carpet and upholstery cleaning.</p><p>To discuss a cleaning requirement, please <a href="/contact">contact our team</a>.</p></main>`
  },
  {
    path: 'community',
    title: 'Home Reset & Employment Pathway | OANK Cleaning CIC',
    description: 'Learn about OANK Home Reset, offering free or subsidised cleaning support, and the Employment Pathway for employment and job training support.',
    canonical: 'https://oankcleaning.co.uk/community',
    body: `<main><h1>OANK Cleaning CIC Community Programmes</h1><h2>OANK Home Reset</h2><p>Home Reset provides free or subsidised cleaning support for people facing difficult circumstances. The level of support depends on individual needs and circumstances. Contact OANK to ask about the current programme and whether support is available.</p><h2>OANK Employment Pathway</h2><p>The Employment Pathway supports local people through employment and job training opportunities connected with OANK cleaning work. Contact OANK to ask about current opportunities.</p><p><a href="/contact">Contact OANK Cleaning CIC</a> to ask about either programme.</p></main>`
  },
  {
    path: 'faqs',
    title: 'Cleaning FAQs | OANK Cleaning CIC',
    description: 'Answers about OANK Cleaning CIC services, starting prices, service area and community programmes.',
    canonical: 'https://oankcleaning.co.uk/faqs',
    body: `<main><h1>Frequently Asked Questions</h1><h2>Where does OANK Cleaning CIC provide services?</h2><p>We provide cleaning at customers’ homes and workplaces across the whole of Renfrewshire and Glasgow. Customers are not received at a public office.</p><h2>What cleaning services do you offer?</h2><p>Regular home cleaning, deep cleaning, end-of-tenancy cleaning, office and commercial cleaning, care home and healthcare cleaning, and carpet and upholstery cleaning.</p><h2>What are your starting prices?</h2><ul><li>Regular home cleaning: from £18.50 per hour.</li><li>Deep cleaning: from £85 one-off.</li><li>End-of-tenancy cleaning: from £145 per package.</li><li>Office and commercial cleaning: from £19.50 per hour on contract.</li><li>Care home and healthcare cleaning: custom quote.</li><li>Carpet and upholstery cleaning: from £45 per room.</li></ul><p>All prices are starting prices. Contact OANK to confirm the scope and final quote.</p><h2>What is Home Reset?</h2><p>Home Reset provides free or subsidised cleaning support for people facing difficult circumstances. The level of support depends on individual needs and circumstances.</p><h2>What is the Employment Pathway?</h2><p>It supports employment and job training opportunities connected with OANK cleaning work.</p><p><a href="/contact">Contact OANK</a> for more information.</p></main>`
  },
  {
    path: 'quote',
    title: 'Request a Cleaning Quote | OANK Cleaning CIC',
    description: 'Request a quote for cleaning services across Renfrewshire and Glasgow. View confirmed starting prices.',
    canonical: 'https://oankcleaning.co.uk/quote',
    body: `<main><h1>Request a Cleaning Quote</h1><p>Choose the service you need and share your property details. OANK will review the requested scope and confirm the final quote.</p><ul><li>Regular home cleaning: from £18.50 per hour.</li><li>Deep cleaning: from £85 one-off.</li><li>End-of-tenancy cleaning: from £145 per package.</li><li>Office and commercial cleaning: from £19.50 per hour on contract.</li><li>Care home and healthcare cleaning: custom quote.</li><li>Carpet and upholstery cleaning: from £45 per room.</li></ul><p><a href="/contact">Contact OANK Cleaning CIC</a> if you prefer to discuss your requirements.</p></main>`
  },
  {
    path: 'governance',
    title: 'Community Purpose & Service Approach | OANK Cleaning CIC',
    description: 'Read about OANK Cleaning CIC community programmes, service arrangements and customer information.',
    canonical: 'https://oankcleaning.co.uk/governance',
    body: `<main><h1>OANK Cleaning CIC Community Purpose & Service Approach</h1><h2>Home Reset</h2><p>Free or subsidised cleaning support for people facing difficult circumstances. The level of support depends on individual needs and circumstances.</p><h2>Employment Pathway</h2><p>Employment and job training support connected with OANK cleaning work. Contact OANK to ask about current opportunities.</p><h2>Customer information</h2><p>Read our <a href="/privacy-policy">Privacy Policy</a> to learn how information provided through the website is handled.</p></main>`
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | OANK Cleaning CIC',
    description: 'Read how OANK Cleaning CIC collects, uses and protects personal information, including website enquiries and cookie preferences.',
    canonical: 'https://oankcleaning.co.uk/privacy-policy',
    body: privacyPolicyBody
  },
  {
    path: 'contact',
    title: 'Contact OANK Cleaning CIC | Renfrewshire and Glasgow',
    description: 'Contact OANK Cleaning CIC for home, commercial and specialist cleaning across Renfrewshire and Glasgow. Call +44 77 3195 6727.',
    canonical: 'https://oankcleaning.co.uk/contact',
    body: `<main><h1>Contact OANK Cleaning CIC</h1><p>Contact OANK Cleaning CIC to ask about cleaning services or request a quote.</p><h2>Telephone</h2><p><a href="tel:+447731956727">+44 77 3195 6727</a></p><h2>Email</h2><p><a href="mailto:info@oankcleaning.co.uk">info@oankcleaning.co.uk</a></p><h2>Service area</h2><p>We provide cleaning at customers' homes and workplaces across the whole of Renfrewshire and Glasgow. We do not receive customers at a public office.</p><p><a href="/services">View our cleaning services and prices</a> or <a href="/quote">request a quote</a>.</p></main>`
  },
];

for (const service of services) {
  pages.push({
    path: `services/${service.slug}`,
    title: `${service.title} in Renfrewshire and Glasgow | OANK Cleaning CIC`,
    description: `${service.title} from OANK Cleaning CIC across Renfrewshire and Glasgow. ${service.price}.`,
    canonical: `https://oankcleaning.co.uk/services/${service.slug}`,
    body: `<main><p><a href="/services">All cleaning services</a></p><h1>${service.title}</h1><p><strong>${service.price}</strong></p><p>${service.description}</p><p>OANK Cleaning CIC serves customers across the whole of Renfrewshire and Glasgow.</p><p><a href="/contact">Contact us</a> or <a href="/quote">request a quote</a>.</p></main>`
  });
}

for (const page of pages) {
  const outDir = path.join(dist, page.path);
  fs.mkdirSync(outDir, { recursive: true });
  const pageHtml = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="robots" content="${page.path === 'track-job' ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'}">
<link rel="canonical" href="${page.canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${page.canonical}">
${styleTags}
${trackingHeadScripts}
</head>
<body>
<div id="root">${page.body}</div>
${scriptTags}
</body>
</html>`;
  fs.writeFileSync(path.join(outDir, 'index.html'), pageHtml);
}
console.log(`Pre-rendered ${pages.length} route pages.`);
