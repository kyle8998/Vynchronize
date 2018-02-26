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
});

//-----------------------------------------------------------------------------
