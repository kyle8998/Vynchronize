//-----------------------------------------------------------------------------
// Host stuff
var host = false

// Sets the host for the room
socket.on('setHost', function(data) {
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
    socket.emit('change host', {
        room: roomnum
    });
}
// Change the host label
socket.on('changeHostLabel', function(data) {
    var username = data.username
    // Change label
    var hostlabel = document.getElementById('hostlabel')
    hostlabel.innerHTML = "Current Host: " + username

    // Generate notify alert
    $.notify({
        title: '<strong>Host Changed: </strong>',
        icon: 'fas fa-users',
        message: username + " is now the host."
    }, {
        type: 'info',
        delay: 800,
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
});

// When the host leaves, the server calls this function on the next socket
socket.on('autoHost', function(data) {
    changeHost(data.roomnum)
});

// If user gets disconnected from the host, give warning!
function disconnected() {
    $.notify({
        title: '<strong>Warning: </strong>',
        icon: 'fas fa-users',
        message: " You are now out of sync of the host"
    }, {
        type: 'warning',
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
        default:
            console.log("Error invalid player id")
    }
});

//-----------------------------------------------------------------------------
