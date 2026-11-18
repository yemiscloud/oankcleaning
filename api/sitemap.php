
<?php
/**
 * OANK Cleaning CIC - XML Sitemap Generator
 * Public sitemap is served at /sitemap.xml
 */

header('Content-Type: application/xml; charset=utf-8');

$domain = 'https://oankcleaning.co.uk';

$paths = [
    '/',
    '/services',
    '/about',
    '/contact',
    '/privacy-policy',
    '/quote',
    '/faqs',
    '/community',
    '/governance',

    // Individual cleaning services
    '/services/domestic-cleaning',
    '/services/deep-cleaning',
    '/services/end-of-tenancy',
    '/services/commercial-office',
    '/services/healthcare-cleaning',
    '/services/carpet-upholstery',
];

echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

foreach ($paths as $path) {
    echo "  <url>" . PHP_EOL;
    echo '    <loc>' .
        htmlspecialchars($domain . $path, ENT_XML1 | ENT_QUOTES, 'UTF-8') .
        '</loc>' . PHP_EOL;
    echo "  </url>" . PHP_EOL;
}

echo '</urlset>' . PHP_EOL;
