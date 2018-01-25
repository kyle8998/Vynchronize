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
        var roomnum = data.room
        //console.log("The data"+data)
        // This calls the playVideo function on the client side
        io.sockets.in("room-"+roomnum).emit('playVideoClient');
    });

    // Sync video
    socket.on('sync video', function(data){
        var roomnum = data.room
        var currTime = data.time
        var state = data.state
        var videoId = data.videoId
        // var videoId = io.sockets.adapter.rooms['room-'+roomnum].currVideo
        io.sockets.in("room-"+roomnum).emit('syncVideoClient', { time: currTime, state: state, videoId: videoId });
    });

    // Change video
    socket.on('change video', function(data){
        var roomnum = data.room
        var videoId = data.videoId
        io.sockets.in("room-"+roomnum).emit('changeVideoClient', { videoId: videoId });

        // This changes the room variable to the video id
        io.sockets.adapter.rooms['room-'+roomnum].currVideo = videoId
        // console.log(io.sockets.adapter.rooms['room-1'])
    });

    // Change video player
    socket.on('change player', function(data){
        var roomnum = data.room
        var playerId = data.playerId

        io.sockets.in("room-"+roomnum).emit('pauseVideoClient');

        switch(playerId) {
            case 0:
                io.sockets.in("room-"+roomnum).emit('createYoutube', {});
                break;
            case 1:
                io.sockets.in("room-"+roomnum).emit('createDaily', {});
                break;
            default:
                console.log("Error invalid player id")
        }

        // This changes the room variable to the player id
        io.sockets.adapter.rooms['room-'+roomnum].currPlayer = playerId

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
        //callback(true);
        socket.roomnum = data;
        var host = null

        // Sets default room value to 1
        if (socket.roomnum == null || socket.roomnum == "") {
            socket.roomnum = 1
        }

        // Adds the room to a global array
        if (!rooms.includes(socket.roomnum)){
            rooms.push(socket.roomnum);
        }

        // Checks if the room exists or not
        console.log(io.sockets.adapter.rooms['room-'+socket.roomnum] !== undefined)
        if (io.sockets.adapter.rooms['room-'+socket.roomnum] === undefined) {
            socket.send(socket.id)
            host = socket.id
            //console.log(socket.id)
        }
        else {
            console.log(socket.roomnum)
            host = io.sockets.adapter.rooms['room-'+socket.roomnum].host
        }

        console.log(socket.username+" connected to room-"+socket.roomnum)
        socket.join("room-"+socket.roomnum);

        // Sets the host
        io.sockets.adapter.rooms['room-'+socket.roomnum].host = host

        var currVideo = io.sockets.adapter.rooms['room-'+socket.roomnum].currVideo
        // Change the video to current One
        socket.emit('changeVideoClient', { videoId: currVideo });

        // Get time from host which calls change time for that socket
        if (socket.id != host) {
            //socket.broadcast.to(host).emit('getTime', { id: socket.id });
            socket.broadcast.to(host).emit('getData');

            // This calls back the function on the host client
            //callback(true)
        } else {
            console.log("I am the host")
            //socket.emit('auto sync');
            socket.broadcast.to(host).emit('auto sync');
        }

        // This is all of the rooms
        // io.sockets.adapter.rooms['room-1'].currVideo = "this is the video"
        // console.log(io.sockets.adapter.rooms['room-1']);
    });

    // Changes time for a specific socket
    socket.on('change time', function(data){
        // console.log(data);
        var caller = data.id
        var time = data.time
        socket.broadcast.to(caller).emit('changeTime', { time: time });
    });

    // This just calls the syncHost function
    socket.on('sync host', function(data){
        //socket.broadcast.to(host).emit('syncVideoClient', { time: time, state: state, videoId: videoId });
        socket.emit('syncHost');
    });

    // Emits the player status
    socket.on('player status', function(data){
        // console.log(data);
        console.log(data)
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }


//------------------------------------------------------------------------------
// Async get current time
    socket.on('auto sync', function(data){
        var async = require("async");
        var http = require("http");

        //Delay of 5 seconds
        var delay = 5000;

        async.forever(

            function(next) {
                // Continuously update stream with data
                //var time = io.sockets.in("room-"+1).emit('getTime', {});
                //Store data in database
                //console.log(time);

                console.log("i am auto syncing")
                socket.emit('syncHost');

                //Repeat after the delay
                setTimeout(function() {
                    next();
                }, delay)
            },
            function(err) {
                console.error(err);
            }
        );
    });

});
