const express = require('express');

function setupWebserver(app) {
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    // temp solution
    app.get('/assets/js/game.js', (req, res) => { res.sendFile(__dirname + '/views/assets/js/game.js'); });

    app.get('/', (req, res) => {
        res.render('index', { title: 'Main Menu' });
    })

    app.get('/game', (req, res) => {
        res.render('game', { title: 'Game' });
    });

    console.log('Webserver setup complete');
}



module.exports = {
    setupWebserver,
};
