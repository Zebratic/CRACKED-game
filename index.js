const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const webserver = require('./webserver');
webserver.setupWebserver(app);

app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`)
});