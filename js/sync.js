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
            console.log("I am host and my current time is " + currTime)
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

    // Sync notify
    $.notify({
        title: '<strong>Sync: </strong>',
        icon: 'fas fa-users',
        message: " The room is now synced with you"
    }, {
        type: 'success',
        delay: 400,
        animate: {
            enter: 'animated fadeInUp',
            exit: 'animated fadeOutRight'
        },
        placement: {
            from: "bottom",
            align: "right"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
    });
}

// Change playVideo
function changeVideo(roomnum) {
    //var videoId = 'sjk7DiH0JhQ';
    var videoId = document.getElementById("inputVideoId").value;

    // If user enters a full link
    if (videoId.includes("https://") || videoId.includes("http://")) {
        // Do some string processing with regex
        switch (currPlayer) {
            case 0:
                var myRegex = /.+watch\?v=([A-Za-z0-9\-_]+)/g
                var match = myRegex.exec(videoId)
                if (match != null) {
                    console.log("You entered a link, but you really meant " + match[1])
                    videoId = match[1]
                }
                break;

            case 1:
                var myRegex = /.+\/(.+)/g
                if (videoId.includes("playlist")) {
                    myRegex = /.+video=(.+)/g
                }

                var match = myRegex.exec(videoId)
                if (match != null) {
                    console.log("You entered a link, but you really meant " + match[1])
                    videoId = match[1]
                }
                break;

            case 2:
                var myRegex = /.+\/(.+)/g
                var match = myRegex.exec(videoId)
                if (match != null) {
                    console.log("You entered a link, but you really meant " + match[1])
                    videoId = match[1]
                }
                break;

            default:
                console.log("Error invalid videoId")
        }
    }

    // Actually change the video!
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

var noises = false

function loveLive(roomnum) {
    var test = document.getElementById("inputVideoId").innerHTML = "sjk7DiH0JhQ";

    // Only for YouTube testing
    if (!noises) {
        socket.emit('change video', {
            room: roomnum,
            videoId: 'sjk7DiH0JhQ'
        });
        noises = true
    } else {
        socket.emit('change video', {
            room: roomnum,
            videoId: '97uviVyw0_o'
        });
        noises = false
    }
}

// Get time
socket.on('getTime', function(data) {
    var caller = data.caller
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
    console.log("Hi im the host, you called?")
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



//------------------------------//
// Client Synchronization Stuff //
//------------------------------//

var socket = io.connect();
var roomnum = 1
var id = "M7lc1UVf-VE"

// Calls the play/pause function
socket.on('playVideoClient', function(data) {
    // Calls the proper play function for the player
    switch (currPlayer) {
        case 0:
            play()
            break;
        case 1:
            dailyPlay()
            break;
        case 2:
            vimeoPlay()
            break;
        default:
            console.log("Error invalid player id")
    }
});

socket.on('pauseVideoClient', function(data) {
    switch (currPlayer) {
        case 0:
            player.pauseVideo();
            break;
        case 1:
            dailyPlayer.pause();
            break;
        case 2:
            vimeoPlayer.pause();
            break;
        default:
            console.log("Error invalid player id")
    }
});

// Syncs the video client
socket.on('syncVideoClient', function(data) {
    var currTime = data.time
    var state = data.state
    var videoId = data.videoId
    var playerId = data.playerId
    console.log("current time is: " + currTime)
    console.log("curr vid id: " + id + " " + videoId)
    console.log("state" + state)

    // There should no longer be any need to sync a video change
    // Video should always be the same
    // if (id != videoId){
    //     console.log(id == videoId)
    //     changeVideoId(roomnum, videoId)
    // }

    // This switchs you to the correct player
    // Should only happen when a new socket joins late

    // Current issue: changePlayer is called asynchronously when we need this function to wait for it to finish
    // changeSinglePlayer(playerId)
    // currPlayer = playerId

    // Change the player if necessary
    if (currPlayer != playerId) {
        // This changes the player then recalls sync afterwards on the host
        changeSinglePlayer(playerId)
    } else {
        // This syncs the time and state
        switch (currPlayer) {
            case 0:
                var clientTime = player.getCurrentTime();
                // Only seek if off by more than .1 seconds
                // CURRENTLY ALL SET TO TRUE TO TO SYNCING ISSUES
                if (true || clientTime < currTime - .1 || clientTime > currTime + .1) {
                    player.seekTo(currTime);
                }
                // Sync player state
                // IF parent player was paused
                if (state == -1 || state == 2) {
                    console.log("paused?")
                    player.pauseVideo();
                }
                // If not paused
                else {
                    player.playVideo();
                }
                break;

            case 1:
                var clientTime = dailyPlayer.currentTime;
                // Only seek if off by more than .1 seconds
                if (true || clientTime < currTime - .1 || clientTime > currTime + .1) {
                    dailyPlayer.seek(currTime);
                }
                if (state) {
                    console.log("i pausing!")
                    dailyPlayer.pause()
                } else {
                    dailyPlayer.play()
                }
                break;

            case 2:
                vimeoPlayer.getCurrentTime().then(function(seconds) {
                    // seconds = the current playback position
                    if (true || seconds < currTime - .1 || seconds > currTime + .1) {
                        vimeoPlayer.setCurrentTime(currTime).then(function(seconds) {
                            if (state) {
                                vimeoPlayer.pause()
                            } else {
                                vimeoPlayer.play()
                            }

                        }).catch(function(error) {
                            switch (error.name) {
                                case 'RangeError':
                                    // the time was less than 0 or greater than the video’s duration
                                    console.log("the time was less than 0 or greater than the video’s duration")
                                    break;

                                default:
                                    // some other error occurred
                                    break;
                            }
                        });
                    }
                }).catch(function(error) {
                    // an error occurred
                    console.log("Error: Could not retrieve Vimeo player current time")
                });
                break;

            default:
                console.log("Error invalid player id")
        }
    }

});

// Change video
socket.on('changeVideoClient', function(data) {
    var videoId = data.videoId;
    console.log("video id is: " + videoId)

    // This changes the video
    id = videoId

    switch (currPlayer) {
        case 0:
            player.loadVideoById(videoId);
            break;
        case 1:
            dailyPlayer.load(videoId, {
                autoplay: true
            });
            break;
        case 2:
            vimeoPlayer.loadVideo(videoId).then(function(id) {
                // the video successfully loaded
            }).catch(function(error) {
                switch (error.name) {
                    case 'TypeError':
                        // the id was not a number
                        break;

                    case 'PasswordError':
                        // the video is password-protected and the viewer needs to enter the
                        // password first
                        break;

                    case 'PrivacyError':
                        // the video is password-protected or private
                        break;

                    default:
                        // some other error occurred
                        break;
                }
            });
            break;
        default:
            console.log("Error invalid player id")
    }

    // Auto sync with host after 1000ms of changing video
    // setTimeout(function() {
    //     socket.emit('sync host', {});
    // }, 1000);

});

// Change time
socket.on('changeTime', function(data) {
    var time = data.time
    player.seekTo(time);
});
