// file deepcode ignore PT: <please specify a reason of ignoring this>
// file deepcode ignore NoRateLimitingForExpensiveWebOperation: <please specify a reason of ignoring this>
const express = require('express');

function setupWebserver(app) {
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    app.use(express.static('views'));

    // fix path traversal vulnerability
    app.use((req, res, next) => {
        if (req.path.includes('..')) {
            res.status(403).send('Forbidden');
            return;
        }
        next();
    });

    app.get('/', (req, res) => {
        res.render('index', { title: 'Main Menu' });
    })

    app.get('/levels/:levelName.json', (req, res) => {
        res.sendFile(__dirname + `/levels/${req.params.levelName}.json`);
    });

    app.get('/levels/:levelName.bjs', (req, res) => {
        res.sendFile(__dirname + `/levels/${req.params.levelName}.bjs`);
    });

    app.get('/levels', (req, res) => {
        res.sendFile(__dirname + '/levels.json');
    });

    console.log('Webserver setup complete');
}



module.exports = {
    setupWebserver,
};
