import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import {REQUEST} from "@angular/core";

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Example Express Rest API endpoints
    // server.get('/api/**', (req, res) => { });
    // Serve static files from /browser
    server.get('*.*', express.static(browserDistFolder, {
        maxAge: '1y'
    }));

    // Serve the Google verification HTML file
    server.get('/google7ff99fd29e799a03.html', (req, res, next) => {
        res.sendFile(join(browserDistFolder, 'google7ff99fd29e799a03.html'), (err) => {
            if (err) {
                console.error('Error serving google verification file:', err);
                next(err);
            }
        });
    });

    server.get('/robots.txt', (req, res, next) => {
        res.sendFile(join(__dirname, 'dist', 'play', 'assets', 'robots.txt'), (err) => {
            if (err) {
                console.error('Error serving robots.txt:', err);
                next(err);
            }
        });
    });

    // All regular routes use the Angular engine
    server.get('*', (req, res, next) => {
        const { protocol, originalUrl, baseUrl, headers } = req;

        commonEngine
            .render({
                bootstrap,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: browserDistFolder,
                providers: [
                    { provide: REQUEST, useValue: req }, // **ამატებს REQUEST პროვაიდერს**
                ],
            })
            .then((html) => res.send(html))
            .catch((err) => next(err));
    });

    return server;
}

function run(): void {
    const port = process.env['PORT'] || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

run();