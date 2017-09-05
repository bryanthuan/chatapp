const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const publicPath = path.join(__dirname,'../public');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const users = new Users();

// Config middleware to use static file
app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');
    
    // Emit newMessage event to client
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required')
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    })

    // Event Listenner 
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        const { from, text, createdAt } = message;
        io.emit('newMessage',generateMessage(from, text));
        callback('This is from the server');
    });
    
    socket.on('disconnect', () => {
        // console.log('User was disconnected');
        const user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

