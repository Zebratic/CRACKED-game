function setupWebsocket(app) {
    app.ws('/ws', (ws, req) => {
        ws.on('message', (msg) => {
            console.log(msg)
        })

        ws.on('close', () => {
            console.log('WebSocket was closed')
        })

        ws.send(JSON.stringify({ message: 'Hello from server!' }))
    });

    console.log('WebSocket server started')
}


module.exports = {
    setupWebsocket
};
