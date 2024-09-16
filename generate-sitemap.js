const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');

// Create a sitemap stream
const sitemapStream = new SitemapStream({ hostname: 'https://playze.io' });

// Array to store the URLs for the sitemap
const urls = [];
urls.push({ url: `/`, changefreq: 'daily', priority: 1 });
urls.push({ url: `/games`, changefreq: 'daily', priority: 0.85 });

// Assuming your game IDs range from 1 to 55
for (let id = 1; id <= 1000; id++) {
    urls.push({ url: `/games/${id}`, changefreq: 'monthly', priority: 0.5 });
}

// Add URLs to the stream and generate the sitemap
urls.forEach(url => sitemapStream.write(url));

// End the stream
sitemapStream.end();

// Write the sitemap to a file
streamToPromise(sitemapStream).then((data) => {
    fs.writeFileSync('./dist/play/browser/sitemap.xml', data.toString());
});
