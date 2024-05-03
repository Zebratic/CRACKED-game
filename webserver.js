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
        const levelName = req.params.levelName;
        res.sendFile(__dirname + `/levels/${levelName}.json`);
    });

    app.get('/levels/:levelName-script.bjs', (req, res) => {
        const levelName = req.params.levelName;
        res.sendFile(__dirname + `/levels/${levelName}-script.bjs`);
    });

    console.log('Webserver setup complete');
}



module.exports = {
    setupWebserver,
};
