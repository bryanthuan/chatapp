const socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);

    var template = document.getElementById('message-template').innerHTML;
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: message.createdAt
    });
    // var elmNode = 
    var child = document.createElement('article');
    child.setAttribute("class", "media");
    child.innerHTML = html;
    document.getElementById('messages').appendChild(child);
    // var wrap = document.getElementById('messages');
    // var messageElm = document.createElement('li');
    // var text = document.createTextNode(message.from+': '+message.text); 
    // messageElm.appendChild(text);
    // wrap.appendChild(messageElm);
});

document.getElementById('message-form').addEventListener('submit',function (e) {
    e.preventDefault();
    var text = document.getElementById('messageInput').value;
    socket.emit('createMessage', {
        from: 'User',
        text
    }, function () {
        document.getElementById('messageInput').value = '';
        // console.log('got it', data);
    });
});