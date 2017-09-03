const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname,'../public');

const port = process.env.PORT || 3000;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

//Config middleware to use static file
app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');
    
    // Emit newMessage event to client
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

    
    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));

    // Event Listenner 
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        const { from, text, createdAt } = message;
        io.emit('newMessage',generateMessage(from, text));
        callback('This is from the server');
    });
    
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

