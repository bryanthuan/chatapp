const socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    var wrap = document.getElementById('messages');
    var messageElm = document.createElement('li');
    var text = document.createTextNode(message.from+': '+message.text); 
    messageElm.appendChild(text);
    wrap.appendChild(messageElm);
});

// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hello'
// }, function (data) {
//     console.log('got it', data);
// });

document.getElementById('message-form').addEventListener('submit',function (e) {
    e.preventDefault();
    var text = document.getElementById('messageInput').value;
    socket.emit('createMessage', {
        from: 'User',
        text
    }, function (data) {
        // console.log('got it', data);
    });
});