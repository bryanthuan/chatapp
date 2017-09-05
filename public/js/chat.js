const socket = io();

socket.on('connect', function () {

    var url = new URL(window.location.href);
    var name = url.searchParams.get("name");
    var room = url.searchParams.get("room");
    
    socket.emit('join', {name, room}, function (err) {
        if (err) {
            window.location.href = '/';
        } else {

        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});


socket.on('updateUserList', users => {
    console.log('User List', users);
    const userList =document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(function(element) {
        // let child = document.createElement('a');
        // let text = document.createTextNode(element);
        // child.innerText = text;
        // userList.appendChild(text)
        var li = document.createElement('li');
        var a = document.createElement('a');
        var name = document.createTextNode(element);
        a.appendChild(name);
        li.appendChild(a);
        userList.appendChild(li);
    }, this);
    
})

socket.on('newMessage', function (message) {
    console.log('newMessage', message);

    var template = document.getElementById('message-template').innerHTML;
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: message.createdAt
    });
    var child = document.createElement('article');
    child.setAttribute("class", "media");
    child.innerHTML = html;
    document.getElementById('messages').appendChild(child);
});

document.getElementById('message-form').addEventListener('submit',function (e) {
    e.preventDefault();
    var text = document.getElementById('messageInput').value;
    socket.emit('createMessage', {
        text
    }, function () {
        document.getElementById('messageInput').value = '';
        // console.log('got it', data);
    });
});