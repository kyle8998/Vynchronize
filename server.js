var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
rooms = [];
// Store all of the sockets and their respective room numbers
userrooms = {}

app.use(express.static(__dirname + '/'));

server.listen(process.env.PORT || 3000);
console.log('Server Started . . .');

app.get('/', function(req, res) {
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

io.sockets.on('connection', function(socket) {
    // Connect Socket
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    // io.sockets.emit('broadcast',{ description: connections.length + ' clients connected!'});

    // For now have it be the same room for everyone!
    //socket.join("room-"+roomno);

    //Send this event to everyone in the room.
    //io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);


    // Play video
    socket.on('play video', function(data) {
        var roomnum = data.room
        io.sockets.in("room-" + roomnum).emit('playVideoClient');
    });

    socket.on('play other', function(data) {
        var roomnum = data.room
        io.sockets.in("room-" + roomnum).emit('justPlay');
    });

    socket.on('pause other', function(data) {
        var roomnum = data.room
        io.sockets.in("room-" + roomnum).emit('justPause');
    });

    socket.on('seek other', function(data) {
        var roomnum = data.room
        var currTime = data.time
        io.sockets.in("room-" + roomnum).emit('justSeek', {
            time: currTime
        });

        // Sync up
        // host = io.sockets.adapter.rooms['room-' + roomnum].host
        // console.log("let me sync "+host)
        // socket.broadcast.to(host).emit('getData');
    });

    // Sync video
    socket.on('sync video', function(data) {
        var roomnum = data.room
        var currTime = data.time
        var state = data.state
        var videoId = data.videoId
        var playerId = io.sockets.adapter.rooms['room-' + roomnum].currPlayer
        // var videoId = io.sockets.adapter.rooms['room-'+roomnum].currVideo
        io.sockets.in("room-" + roomnum).emit('syncVideoClient', {
            time: currTime,
            state: state,
            videoId: videoId,
            playerId: playerId
        });
    });

    // Change video
    socket.on('change video', function(data) {
        var roomnum = data.room
        var videoId = data.videoId
        io.sockets.in("room-" + roomnum).emit('changeVideoClient', {
            videoId: videoId
        });

        // This changes the room variable to the video id
        io.sockets.adapter.rooms['room-' + roomnum].currVideo = videoId
        // console.log(io.sockets.adapter.rooms['room-1'])
    });

    // Change video player
    socket.on('change player', function(data) {
        var roomnum = data.room
        var playerId = data.playerId

        io.sockets.in("room-" + roomnum).emit('pauseVideoClient');

        switch (playerId) {
            case 0:
                io.sockets.in("room-" + roomnum).emit('createYoutube', {});
                break;
            case 1:
                io.sockets.in("room-" + roomnum).emit('createDaily', {});
                break;
            case 2:
                io.sockets.in("room-" + roomnum).emit('createVimeo', {});
                break;
            default:
                console.log("Error invalid player id")
        }

        // This changes the room variable to the player id
        io.sockets.adapter.rooms['room-' + roomnum].currPlayer = playerId
        console.log(io.sockets.adapter.rooms['room-' + socket.roomnum].currPlayer)

        // This syncs the host whenever the player changes
        host = io.sockets.adapter.rooms['room-' + socket.roomnum].host
        socket.broadcast.to(host).emit('getData');

    });

    // Change video player
    socket.on('change single player', function(data) {
        var playerId = data.playerId

        switch (playerId) {
            case 0:
                socket.emit('createYoutube', {});
                break;
            case 1:
                socket.emit('createDaily', {});
                break;
            case 2:
                socket.emit('createVimeo', {});
                break;
            default:
                console.log("Error invalid player id")
        }
        // After changing the player, resync with the host
        host = io.sockets.adapter.rooms['room-' + socket.roomnum].host
        socket.broadcast.to(host).emit('getData');
    });



    // Disconnect
    socket.on('disconnect', function(data) {
        // console.log(userrooms)
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log(socket.id + ' Disconnected: %s sockets connected', connections.length);
        // console.log(io.sockets.adapter.rooms['room-' + socket.roomnum])
        // console.log(socket.roomnum)


        // HOST DISCONNECT
        // Need to check if current socket is the host of the roomnum
        // If it is the host, needs to auto assign to another socket in the room

        // Grabs room from userrooms data structure
        var id = socket.id
        var roomnum = userrooms[id]
        var room = io.sockets.adapter.rooms['room-' + roomnum]

        // If you are the host
        if (room !== undefined && socket.id == room.host) {
            // Reassign
            console.log("hello i am the host " + socket.id + " and i am leaving my responsibilities to " + Object.keys(room.sockets)[0])
            io.to(Object.keys(room.sockets)[0]).emit('autoHost', {
                roomnum: roomnum
            })
        }

        // Delete socket from userrooms
        delete userrooms[id]

    });

    // Send Message in chat
    socket.on('send message', function(data) {
        var encodedMsg = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // console.log(data);
        io.sockets.emit('new message', {
            msg: encodedMsg,
            user: socket.username
        });
    });

    // New User
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        //console.log(socket.username)
        users.push(socket.username);
        updateUsernames();
    });

    // New room
    socket.on('new room', function(data, callback) {
        //callback(true);
        socket.roomnum = data;

        // This stores the room data for all sockets
        userrooms[socket.id] = data

        var host = null
        var init = false

        // Sets default room value to 1
        if (socket.roomnum == null || socket.roomnum == "") {
            socket.roomnum = '1'
            userrooms[socket.id] = '1'
        }

        // Adds the room to a global array
        if (!rooms.includes(socket.roomnum)) {
            rooms.push(socket.roomnum);
        }

        // Checks if the room exists or not
        // console.log(io.sockets.adapter.rooms['room-' + socket.roomnum] !== undefined)
        if (io.sockets.adapter.rooms['room-' + socket.roomnum] === undefined) {
            socket.send(socket.id)
            // Sets the first socket to join as the host
            host = socket.id
            init = true

            // Set the host on the client side
            socket.emit('setHost');
            //console.log(socket.id)
        } else {
            console.log(socket.roomnum)
            host = io.sockets.adapter.rooms['room-' + socket.roomnum].host
        }

        // Actually join the room
        console.log(socket.username + " connected to room-" + socket.roomnum)
        socket.join("room-" + socket.roomnum);

        // Sets the default values when first initializing
        if (init) {
            // Sets the host
            io.sockets.adapter.rooms['room-' + socket.roomnum].host = host
            // Default Player
            io.sockets.adapter.rooms['room-' + socket.roomnum].currPlayer = 0
            // Default video
            io.sockets.adapter.rooms['room-' + socket.roomnum].currVideo = 'M7lc1UVf-VE'
            // Host username
            io.sockets.adapter.rooms['room-' + socket.roomnum].hostName = socket.username
        }

        // Set Host label
        io.sockets.in("room-" + socket.roomnum).emit('changeHostLabel', {
            username: io.sockets.adapter.rooms['room-' + socket.roomnum].hostName
        });

        // Gets current video from room variable
        var currVideo = io.sockets.adapter.rooms['room-' + socket.roomnum].currVideo
        // Change the video to current One
        socket.emit('changeVideoClient', {
            videoId: currVideo
        });

        // Get time from host which calls change time for that socket
        if (socket.id != host) {
            //socket.broadcast.to(host).emit('getTime', { id: socket.id });
            console.log("call the damn host " + host)
            socket.broadcast.to(host).emit('getData');

            // This calls back the function on the host client
            //callback(true)
        } else {
            console.log("I am the host")
            //socket.emit('auto sync');

            // Auto syncing is not working atm
            // socket.broadcast.to(host).emit('auto sync');
        }

        // This is all of the rooms
        // io.sockets.adapter.rooms['room-1'].currVideo = "this is the video"
        // console.log(io.sockets.adapter.rooms['room-1']);
    });

    // Changes time for a specific socket
    socket.on('change time', function(data) {
        // console.log(data);
        var caller = data.id
        var time = data.time
        socket.broadcast.to(caller).emit('changeTime', {
            time: time
        });
    });

    // This just calls the syncHost function
    socket.on('sync host', function(data) {
        //socket.broadcast.to(host).emit('syncVideoClient', { time: time, state: state, videoId: videoId });
        socket.emit('syncHost');
    });

    // Emits the player status
    socket.on('player status', function(data) {
        // console.log(data);
        console.log(data)
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    // Change host
    socket.on('change host', function(data) {
        var roomnum = data.room
        var newHost = socket.id
        console.log("I want to be the host and my socket id is: " + newHost);
        //console.log(io.sockets.adapter.rooms['room-' + socket.roomnum])

        // Broadcast to current host and set false
        socket.broadcast.to(io.sockets.adapter.rooms['room-' + socket.roomnum].host).emit('unSetHost');
        // Reset host
        io.sockets.adapter.rooms['room-' + socket.roomnum].host = newHost
        // Broadcast to new host and set true
        socket.emit('setHost')

        io.sockets.adapter.rooms['room-' + socket.roomnum].hostName = socket.username
        // Update host label in all sockets
        io.sockets.in("room-" + roomnum).emit('changeHostLabel', {
            username: socket.username
        });

    });

    // Get host data
    socket.on('get host data', function(data) {
        var roomnum = data.room
        var host = io.sockets.adapter.rooms['room-' + roomnum].host

        // Broadcast to current host and set false
        // Call back not supported when broadcasting

        // Checks if it has the data, if not get the data and recursively call again
        if (data.currTime === undefined) {
            // Saves the original caller so the host can send back the data
            var caller = socket.id
            socket.broadcast.to(host).emit('getPlayerData', {
                room: roomnum,
                caller: caller
            })
        } else {
            var caller = data.caller
            // Call necessary function on the original caller
            socket.broadcast.to(caller).emit('compareHost', data);
        }

    });

    //------------------------------------------------------------------------------
    // Async get current time
    socket.on('auto sync', function(data) {
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
