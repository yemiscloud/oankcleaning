<?php
/**
 * Oank Cleaning - Dynamic XML Sitemap Generator
 * Enhances Google Search Console indexing & SEO
 */

header('Content-Type: application/xml; charset=utf-8');

$domain = 'https://oankcleaning.co.uk';
$currentDate = date('Y-m-d');

$urls = [
    '' => ['priority' => '1.0', 'freq' => 'daily'],
    '/services' => ['priority' => '0.9', 'freq' => 'weekly'],
    '/about' => ['priority' => '0.8', 'freq' => 'monthly'],
    '/ohkay-group' => ['priority' => '0.8', 'freq' => 'monthly'],
    '/quote' => ['priority' => '0.9', 'freq' => 'weekly'],
    '/faqs' => ['priority' => '0.7', 'freq' => 'monthly'],
    '/contact' => ['priority' => '0.9', 'freq' => 'weekly'],
    '/services/domestic-cleaning' => ['priority' => '0.8', 'freq' => 'weekly'],
    '/services/deep-cleaning' => ['priority' => '0.8', 'freq' => 'weekly'],
    '/services/end-of-tenancy' => ['priority' => '0.8', 'freq' => 'weekly'],
    '/services/commercial-office' => ['priority' => '0.8', 'freq' => 'weekly'],
    '/services/healthcare-cleaning' => ['priority' => '0.8', 'freq' => 'weekly'],
    '/services/carpet-upholstery' => ['priority' => '0.8', 'freq' => 'weekly']
];

echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

foreach ($urls as $path => $meta) {
    echo '  <url>' . PHP_EOL;
    echo '    <loc>' . htmlspecialchars($domain . $path) . '</loc>' . PHP_EOL;
    echo '    <lastmod>' . $currentDate . '</lastmod>' . PHP_EOL;
    echo '    <changefreq>' . $meta['freq'] . '</changefreq>' . PHP_EOL;
    echo '    <priority>' . $meta['priority'] . '</priority>' . PHP_EOL;
    echo '  </url>' . PHP_EOL;
}

echo '</urlset>' . PHP_EOL;
