const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const dotenv = require('dotenv')
dotenv.config()

const webserver = require('./webserver');
webserver.setupWebserver(app);
const websocket = require('./websocket');
websocket.setupWebsocket(app);



app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`)
});

