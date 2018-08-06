const express = require('express');
const http = require('http');
const initializeSocket = require('./socket');

const app = express();
const server = http.Server(app);

/** @type {SocketIO.Server} */
const io = initializeSocket();
io.attach(server);

server.listen(3000, () => {
    console.log('listening on *:3000');
});
