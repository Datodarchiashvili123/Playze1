const { join } = require('path');
const { existsSync } = require('fs');
const express = require('express');

const app = express();
const distFolder = join(__dirname, '../dist/play/browser');
const server = require('../dist/play/server/main');

if (existsSync(distFolder)) {
    app.use(express.static(distFolder, {
        maxAge: '1y'
    }));
}

app.use((req, res) => {
    server.app(req, res);
});

module.exports = app;
