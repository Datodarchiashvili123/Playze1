const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const axios = require('axios');

// Static URLs for the first sitemap
const staticUrls = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/games', changefreq: 'daily', priority: 0.85 },
    { url: '/news', changefreq: 'daily', priority: 0.85 },
    // Add more static URLs here
];

async function generateStaticSitemap(hostname = 'https://playze.io') {
    const sitemapStream = new SitemapStream({ hostname });

    try {
        // Add static URLs to the sitemap stream
        staticUrls.forEach((url) => sitemapStream.write(url));
        sitemapStream.end();

        // Generate sitemap content
        const data = await streamToPromise(sitemapStream);

        // Write static sitemap file
        fs.writeFileSync(
            './dist/play/browser/sitemap-1.xml',
            data.toString()
        );

        return staticUrls.length;
    } catch (error) {
        console.error('Error generating static sitemap:', error.message);
        throw error;
    }
}

async function generateDynamicSitemap(streamId, hostname = 'https://playze.io') {
    const sitemapStream = new SitemapStream({ hostname });
    const urls = [];

    try {
        const response = await axios.get(
            `https://playze.betterdevjobs.com/source/urls?SourceTypeId=1&StreamId=${streamId}`
        );

        console.log(`API Response for Stream ${streamId}:`, response.data);

        if (response.data && Array.isArray(response.data.urlNames)) {
            response.data.urlNames.forEach((game) => {
                urls.push({
                    url: `/games/${game.urlName}`,
                    changefreq: 'monthly',
                    priority: 0.5,
                });
            });
        } else {
            throw new Error(`Invalid data received from API for Stream ${streamId}`);
        }

        // Add URLs to the sitemap stream
        urls.forEach((url) => sitemapStream.write(url));
        sitemapStream.end();

        // Generate sitemap content
        const data = await streamToPromise(sitemapStream);

        // Write dynamic sitemap file (sitemap-2.xml, sitemap-3.xml, sitemap-4.xml)
        const sitemapNumber = streamId + 1; // streamId 1 -> sitemap-2.xml, etc.
        fs.writeFileSync(
            `./dist/play/browser/sitemap-${sitemapNumber}.xml`,
            data.toString()
        );

        return urls.length;
    } catch (error) {
        console.error(`Error generating dynamic sitemap ${streamId}:`, error.message);
        throw error;
    }
}

async function generateSitemapIndex(totalSitemaps, hostname = 'https://playze.io') {
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${Array.from({ length: totalSitemaps }, (_, i) => i + 1)
        .map(
            (id) => `
        <sitemap>
            <loc>${hostname}/sitemap-${id}.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>`
        )
        .join('')}
    </sitemapindex>`;

    fs.writeFileSync('./dist/play/browser/sitemap.xml', sitemapIndex);
}

// Main execution
(async () => {
    try {
        const results = [];
        const totalSitemaps = 5; // 1 static + 3 dynamic sitemaps

        // Generate static sitemap (sitemap-1.xml)
        const staticUrlCount = await generateStaticSitemap();
        results.push({ sitemapId: 1, type: 'static', urlCount: staticUrlCount });
        console.log(`Static sitemap generated with ${staticUrlCount} URLs`);

        // Generate dynamic sitemaps (sitemap-2.xml, sitemap-3.xml, sitemap-4.xml)
        for (let streamId = 1; streamId <= 4; streamId++) {
            const urlCount = await generateDynamicSitemap(streamId);
            results.push({ sitemapId: streamId + 1, type: 'dynamic', urlCount });
            console.log(`Dynamic sitemap ${streamId + 1} generated with ${urlCount} URLs`);
        }

        // Generate sitemap index file
        await generateSitemapIndex(totalSitemaps);

        console.log('All sitemaps generated successfully!');
        console.log('Summary:', results);
    } catch (error) {
        console.error('Error in sitemap generation process:', error);
        process.exit(1);
    }
})();