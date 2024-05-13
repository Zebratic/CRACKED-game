const express = require('express')
const app = express()

const webserver = require('./webserver.js');
webserver.setupWebserver(app);

app.listen(3000, () => {
    console.log(`Server started on http://localhost:3000`);
});