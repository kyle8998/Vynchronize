// Calls the play video function on the server
function playVideo(roomnum) {
    // dailyPlayer.play();
    //vimeoPlayer.play()
    socket.emit('play video', {
        room: roomnum
    });

    // Doesn't work well unless called in server
    //io.sockets.in("room-"+roomnum).emit('playVideoClient');
}

// Calls the sync function on the server
function syncVideo(roomnum) {
    var currTime = 0
    var state
    var videoId = id

    // var syncText = document.getElementById("syncbutton")
    // console.log(syncText.innerHTML)
    // syncText.innerHTML = "<i class=\"fas fa-sync fa-spin\"></i> Sync"

    switch (currPlayer) {
        case 0:
            currTime = player.getCurrentTime();
            state = playerStatus
            console.log("I am host and my current time is "+currTime)
            break;
        case 1:
            currTime = dailyPlayer.currentTime;
            state = dailyPlayer.paused;
            break;
        case 2:
            vimeoPlayer.getCurrentTime().then(function(seconds) {
                // seconds = the current playback position
                currTime = seconds

                // Need to nest async functions
                vimeoPlayer.getPaused().then(function(paused) {
                    // paused = whether or not the player is paused
                    state = paused
                    console.log("state=" + state)
                    socket.emit('sync video', {
                        room: roomnum,
                        time: currTime,
                        state: state,
                        videoId: videoId
                    });
                }).catch(function(error) {
                    // an error occurred
                    console.log("Error: Could not retrieve Vimeo Player state")
                });

            }).catch(function(error) {
                // an error occurred
                console.log("Error: Could not retrieve Vimeo player current time")
            });
            break;
        default:
            console.log("Error invalid player id")
    }

    // Required due to vimeo asyncronous functionality
    if (currPlayer != 2) {
        socket.emit('sync video', {
            room: roomnum,
            time: currTime,
            state: state,
            videoId: videoId
        });
    }
}

// Change playVideo
function changeVideo(roomnum) {
    //var videoId = 'sjk7DiH0JhQ';
    var videoId = document.getElementById("inputVideoId").value;
    socket.emit('change video', {
        room: roomnum,
        videoId: videoId
    });
    //player.loadVideoById(videoId);
}

function changeVideoId(roomnum, id) {
    //var videoId = 'sjk7DiH0JhQ';
    document.getElementById("inputVideoId").innerHTML = id;
    socket.emit('change video', {
        room: roomnum,
        videoId: id
    });
    //player.loadVideoById(videoId);
}

function loveLive(roomnum) {
    var test = document.getElementById("inputVideoId").innerHTML = "sjk7DiH0JhQ";

    // Only for YouTube testing
    socket.emit('change video', {
        room: roomnum,
        videoId: 'sjk7DiH0JhQ'
    });
}

// Get time
socket.on('getTime', function(data) {
    var caller = data.id
    var time = player.getCurrentTime()
    console.log("Syncing new socket to time: " + time)
    socket.emit('change time', {
        time: time,
        id: caller
    });
    //socket.emit('change video', { time: time });
});

// This just calls the sync host function in the server
socket.on('getData', function(data) {
    socket.emit('sync host', {});
    //socket.emit('change video', { time: time });
});

function changePlayer(roomnum, playerId) {
    if (playerId != currPlayer) {
        console.log("I changed!")
        socket.emit('change player', {
            room: roomnum,
            playerId: playerId
        });
    }
}

// Change a single player
function changeSinglePlayer(playerId) {
    return new Promise((resolve, reject) => {
        if (playerId != currPlayer) {
            console.log("I changed!")
            socket.emit('change single player', {
                playerId: playerId
            });
        }
        resolve("socket entered change single player function")
    })
}
