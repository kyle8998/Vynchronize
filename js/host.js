//-----------------------------------------------------------------------------
// Host stuff
var host = false
var notifyfix = false

// Sets the host for the room
socket.on('setHost', function(data) {
    notifyfix = true
    console.log("You are the new host!")
    host = true
});
// Unsets the host
socket.on('unSetHost', function(data) {
    console.log("Unsetting host")
    host = false
});

// This grabs data and calls sync FROM the host
socket.on('getData', function(data) {
    console.log("Hi im the host, you called?")
    socket.emit('sync host', {});
});
// Calls sync
socket.on('syncHost', function(data) {
    syncVideo(roomnum)
});

//Change the host
function changeHost(roomnum) {
    if (!host){
        socket.emit('change host', {
            room: roomnum
        });
        socket.emit('notify alerts', {
            alert: 1,
            user: username
        })
    }
}
// Change the host label
socket.on('changeHostLabel', function(data) {
    var user = data.username
    // Change label
    var hostlabel = document.getElementById('hostlabel')
    hostlabel.innerHTML = "<i class=\"fas fa-user\"></i> Current Host: " + user

    // Generate notify alert
    // CANNOT CALL IT HERE
    // socket.emit('notify alerts', {
    //     alert: 1,
    //     user: user
    // })
})

// When the host leaves, the server calls this function on the next socket
socket.on('autoHost', function(data) {
    changeHost(data.roomnum)
})

// If user gets disconnected from the host, give warning!
function disconnected() {
    // boolean to prevent alert on join
    if (notifyfix) {
        disconnectedAlert()
    } else {
        notifyfix = true
    }
}

// Grab all host data
function getHostData(roomnum) {
    socket.emit('get host data', {
        room: roomnum
    });
}

// Uses the host data to compare
socket.on('compareHost', function(data) {
    // The host data
    var hostTime = data.currTime
    var hostState = data.state

    switch (currPlayer) {
        case 0:
            var currTime = player.getCurrentTime()
            var state = playerStatus

            // If out of sync
            console.log("curr: " + currTime + " Host: " + hostTime)
            if (currTime < hostTime - 2 || currTime > hostTime + 2) {
                disconnected()
            }

            break;
        case 1:
            var currTime = dailyPlayer.currentTime
            var state = dailyPlayer.paused;

            // If out of sync
            console.log("curr: " + currTime + " Host: " + hostTime)
            if (currTime < hostTime - 2 || currTime > hostTime + 2) {
                disconnected()
            }

            break;
        case 2:
            vimeoPlayer.getCurrentTime().then(function(seconds) {
                // seconds = the current playback position
                var currTime = seconds

                // Need to nest async functions
                vimeoPlayer.getPaused().then(function(paused) {
                    // paused = whether or not the player is paused
                    var state = paused

                    // If out of sync
                    console.log("curr: " + currTime + " Host: " + hostTime)
                    if (currTime < hostTime - 2 || currTime > hostTime + 2) {
                        disconnected()
                    }

                }).catch(function(error) {
                    // an error occurred
                    console.log("Error: Could not retrieve Vimeo Player state")
                });

            }).catch(function(error) {
                // an error occurred
                console.log("Error: Could not retrieve Vimeo player current time")
            });

            break;
        case 3:
            var currTime = media.currentTime
            var state = media.paused

            // If out of sync
            console.log("curr: " + currTime + " Host: " + hostTime)
            if (currTime < hostTime - 2 || currTime > hostTime + 2) {
                disconnected()
            }

            break;
        default:
            console.log("Error invalid player id")
    }
});

function test() {
    document.getElementById('player').src = document.getElementById('player').src + '&controls=0'
}


// DEPRECATED DOES NOT WORK PROPERLY
// Set controls on api to the host, remove controls on other sockets
socket.on('hostControls', function(data) {
    // If host disable controls
    if (!host) {
        console.log("SOURCE: " + document.getElementById('player').src)
        // document.getElementById('player').src = document.getElementById('player').src + '&controls=0'
        document.getElementById('player').src = document.getElementById('player').src.replace("&controls=1", "&controls=0")
        console.log("POSTSOURCE: " + document.getElementById('player').src)

    }
    // Give back controls, if needed!
    else {
        document.getElementById('player').src = document.getElementById('player').src.replace("&controls=0", "&controls=1")
    }
});

//-----------------------------------------------------------------------------
