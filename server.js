var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
rooms = [];

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
    //socket.join("room-"+roomno);

    //Send this event to everyone in the room.
    //io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);


    // Play video
    socket.on('play video', function(data){
        var roomnum = data
        //console.log("The data"+data)
        // This calls the playVideo function on the client side
        io.sockets.in("room-"+roomnum).emit('playVideoClient');
    });

    // Sync video
    socket.on('sync video', function(data){
        var roomnum = data.room
        var currTime = data.time
        io.sockets.in("room-"+roomnum).emit('syncVideoClient', { time: currTime });
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
        var encodedMsg = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // console.log(data);
        io.sockets.emit('new message', {msg: encodedMsg, user: socket.username});
    });

    // New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        //console.log(socket.username)
        users.push(socket.username);
        updateUsernames();
    });

    // New room
    socket.on('new room', function(data, callback){
        callback(true);
        socket.roomnum = data;

        // Adds the room to a global array
        if (!rooms.includes(socket.roomnum)){
            rooms.push(socket.roomnum);
        }

        //console.log(socket.roomnum)
        // Sets default room value to 1
        if (socket.roomnum == null || socket.roomnum == "") {
            socket.roomnum = 1
        }
        console.log(socket.username+" connected to room-"+socket.roomnum)
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
