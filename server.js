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

//var roomno = 1;
/*
io.on('connection', function(socket) {

   //Increase roomno 2 clients are present in a room.
   //if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;

   // For now have it be the same room for everyone!
   socket.join("room-"+roomno);

   //Send this event to everyone in the room.
   io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
})*/

var roomno = 1;

io.sockets.on('connection', function(socket){
    // Connect Socket
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    // io.sockets.emit('broadcast',{ description: connections.length + ' clients connected!'});

    // For now have it be the same room for everyone!
    socket.join("room-"+roomno);

    //Send this event to everyone in the room.
    //io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);


    // Play video
    socket.on('play video', function(data){
        // console.log(data);
        io.sockets.emit('playVideo', {});
    });



    // Disconnect
    socket.on('disconnect', function(data){
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // Send Message in chat
    socket.on('send message', function(data){
        // console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    // New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        console.log(socket.username)
        users.push(socket.username);
        updateUsernames();
    });

    // New room
    socket.on('new room', function(data){
        socket.roomnum = data;
        console.log(socket.roomnum)
        if (socket.roomnum == null || socket.roomnum == "") {
            socket.roomnum = 1
        }
        console.log(socket.roomnum)
        //users.push(socket.username);
        socket.join("room-"+socket.roomnum);
    });

    // Emits the player status
    socket.on('player status', function(data){
        // console.log(data);
        console.log(data)
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

});
