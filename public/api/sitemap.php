<?php
/**
 * PLANOZERO — sitemap.xml dinámico
 * Genera el sitemap XML leyendo posts publicados de la BD MySQL.
 * Accedido en: https://planozero.cl/sitemap.xml (via .htaccess rewrite o directamente)
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600'); // cachear 1 hora

$baseUrl = 'https://www.planozero.cl';
$today   = date('Y-m-d');

// ── Páginas estáticas ────────────────────────────────────────
$staticPages = [
    ['loc' => '/',                          'priority' => '1.0',  'changefreq' => 'weekly',  'lastmod' => $today],
    ['loc' => '/blog',                       'priority' => '0.9',  'changefreq' => 'daily',   'lastmod' => $today],
    ['loc' => '/agencia-branding',           'priority' => '0.95', 'changefreq' => 'monthly', 'lastmod' => $today],
    ['loc' => '/agencia-marketing-digital',  'priority' => '0.95', 'changefreq' => 'monthly', 'lastmod' => $today],
    ['loc' => '/diseno-ux-ui',               'priority' => '0.85', 'changefreq' => 'monthly', 'lastmod' => $today],
    ['loc' => '/agencia-publicidad',         'priority' => '0.85', 'changefreq' => 'monthly', 'lastmod' => $today],
    ['loc' => '/diseno-web',                 'priority' => '0.85', 'changefreq' => 'monthly', 'lastmod' => $today],
];

// ── Posts publicados desde la BD ─────────────────────────────
$blogUrls = [];
try {
    $db   = getDB();
    $stmt = $db->prepare(
        "SELECT slug, updated_at, created_at 
         FROM posts 
         WHERE published = 1 
         ORDER BY created_at DESC"
    );
    $stmt->execute();
    $posts = $stmt->fetchAll();

    foreach ($posts as $post) {
        $lastmod = !empty($post['updated_at'])
            ? date('Y-m-d', strtotime($post['updated_at']))
            : (!empty($post['created_at']) ? date('Y-m-d', strtotime($post['created_at'])) : $today);

        $blogUrls[] = [
            'loc'        => '/blog/' . htmlspecialchars($post['slug']),
            'priority'   => '0.7',
            'changefreq' => 'monthly',
            'lastmod'    => $lastmod,
        ];
    }
} catch (Exception $e) {
    // Si falla la BD, continúa solo con páginas estáticas
    error_log('[sitemap.php] DB error: ' . $e->getMessage());
}

// ── Páginas CMS publicadas (opcional) ────────────────────────
$cmsUrls = [];
try {
    $db   = getDB();
    $stmt = $db->prepare(
        "SELECT slug, updated_at 
         FROM pages 
         WHERE published = 1 AND slug != 'inicio'
         ORDER BY updated_at DESC"
    );
    $stmt->execute();
    $pages = $stmt->fetchAll();

    foreach ($pages as $page) {
        $lastmod = !empty($page['updated_at'])
            ? date('Y-m-d', strtotime($page['updated_at']))
            : $today;
        $cmsUrls[] = [
            'loc'        => '/' . htmlspecialchars($page['slug']),
            'priority'   => '0.6',
            'changefreq' => 'monthly',
            'lastmod'    => $lastmod,
        ];
    }
} catch (Exception $e) {
    error_log('[sitemap.php] DB pages error: ' . $e->getMessage());
}

// ── Generar XML ───────────────────────────────────────────────
$allUrls = array_merge($staticPages, $blogUrls, $cmsUrls);

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($allUrls as $url) {
    echo "  <url>\n";
    echo "    <loc>" . $baseUrl . $url['loc'] . "</loc>\n";
    echo "    <lastmod>" . $url['lastmod'] . "</lastmod>\n";
    echo "    <changefreq>" . $url['changefreq'] . "</changefreq>\n";
    echo "    <priority>" . $url['priority'] . "</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>';
