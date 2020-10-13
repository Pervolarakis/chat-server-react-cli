const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let users = {}
let counter = 0;

io.on('connection', socket => {
    socket.id = counter++;
    socket.emit('message', 'welcome to the chat room please enter your name');


    socket.on('disconnect', () => {
        socket.broadcast.emit('message', 'Server > A user has left the room');
    })

    socket.on('message', message => {
        if (!users[socket.id]) {
            socket.name = message;
            users[socket.id] = socket;
            socket.emit('message', `Server > Welcome ${socket.name}`)
            return;
        }
        // socket.emit('message', `${socket.name} (You) > ${message}`)
        socket.broadcast.emit('message', `${socket.name} > ${message}`);
    })

})


server.listen(5000);
