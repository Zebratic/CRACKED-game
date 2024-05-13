const express = require('express');

function setupWebserver(app) {
    app.use(express.static('views'));

    app.get('/', (req, res) => {
        res.render('index');
    })

    app.get('/levels/:levelName.json', (req, res) => {
        res.sendFile(__dirname + `/levels/${req.params.levelName}.json`);
    });

    app.get('/levels/:levelName.js', (req, res) => {
        res.sendFile(__dirname + `/levels/scripts/${req.params.levelName}.js`);
    });

    app.get('/levels', (req, res) => {
        res.sendFile(__dirname + '/levels.json');
    });

    console.log('Webserver setup complete');
}

module.exports = {
    setupWebserver,
};


