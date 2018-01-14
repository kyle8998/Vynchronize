var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

app.use(express.static(__dirname + '/'));

server.listen(process.env.PORT || 3000);
console.log('Server Started . . .');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    // Connect Socket
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    // io.sockets.emit('broadcast',{ description: connections.length + ' clients connected!'});


    // Disconnect
    socket.on('disconnect', function(data){
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // // Send Message in chat
    // socket.on('send message', function(data){
    //     // console.log(data);
    //     io.sockets.emit('new message', {msg: data, user: socket.username});
    // });

    // New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    // Emits the player status
    socket.on('player status', function(data){
        // console.log(data);
        console.log(data)
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

    ////////

});
