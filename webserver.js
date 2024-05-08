const express = require('express');

function setupWebserver(app) {
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    app.use(express.static('views'));

    app.get('/', (req, res) => {
        res.render('index', { title: 'Main Menu' });
    })

    app.get('/game', (req, res) => {
        res.render('game', { title: 'Game' });
    });

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
