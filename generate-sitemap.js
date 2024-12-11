const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const axios = require('axios'); // For making HTTP requests

(async () => {
    // Create a sitemap stream
    const sitemapStream = new SitemapStream({ hostname: 'https://playze.io' });

    // Array to store the URLs for the sitemap
    const urls = [];
    urls.push({ url: `/`, changefreq: 'daily', priority: 1 });
    urls.push({ url: `/games`, changefreq: 'daily', priority: 0.85 });

    try {
        // Fetch the game URL names from your backend API
        const response = await axios.get('https://playze.betterdevjobs.com/game/gameurls'); // Replace with your API endpoint

        console.log('API Response:', response.data); // Log the API response

        // Access the array inside the object (e.g., response.data.games)
        if (response.data && Array.isArray(response.data.urlNames)) {
            response.data.urlNames.forEach((game) => {
                urls.push({
                    url: `/games/${game.urlName}`, // Use the dynamically fetched URL name
                    changefreq: 'monthly',
                    priority: 0.5,
                });
            });
        } else {
            console.error('Invalid data received from API.');
            console.log('Expected "games" array, but got:', response.data);
            return;
        }

        // Add URLs to the sitemap stream
        urls.forEach((url) => sitemapStream.write(url));

        // End the stream
        sitemapStream.end();

        // Write the sitemap to a file
        const data = await streamToPromise(sitemapStream);
        fs.writeFileSync('./dist/play/browser/sitemap.xml', data.toString());
        console.log('Sitemap generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error.message);
    }
})();
