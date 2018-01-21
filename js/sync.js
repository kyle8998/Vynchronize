// Calls the play video function on the server
function playVideo(roomnum){
	socket.emit('play video', { room: roomnum });
	// Doesn't work well unless called in server
	//io.sockets.in("room-"+roomnum).emit('playVideoClient');
}

// Calls the sync function on the server
function syncVideo(roomnum){
	var currTime = player.getCurrentTime();
	var videoId = id
	socket.emit('sync video', { room: roomnum, time: currTime, state: playerStatus, videoId: videoId });
}

// Change playVideo
function changeVideo(roomnum){
	//var videoId = 'sjk7DiH0JhQ';
	var videoId = document.getElementById("inputVideoId").value;
	socket.emit('change video', { room: roomnum, videoId: videoId });
	//player.loadVideoById(videoId);
}

function changeVideoId(roomnum, id){
	//var videoId = 'sjk7DiH0JhQ';
	document.getElementById("inputVideoId").innerHTML = id;
	socket.emit('change video', { room: roomnum, videoId: id });
	//player.loadVideoById(videoId);
}

function loveLive(roomnum){
	document.getElementById("inputVideoId").innerHTML = "sjk7DiH0JhQ";

	socket.emit('change video', { room: roomnum, videoId: 'sjk7DiH0JhQ' });
}

// Get time
socket.on('getTime', function(data) {
	var caller = data.id
    var time = player.getCurrentTime()
    console.log("Syncing new socket to time: "+time)
    socket.emit('change time', { time: time, id: caller });
    //socket.emit('change video', { time: time });
});

// This just calls the sync host function in the server
socket.on('getData', function(data) {
    socket.emit('sync host', {});
    //socket.emit('change video', { time: time });
});

function changePlayer(roomnum, playerId) {
	socket.emit('change player', { room: roomnum, playerId: playerId });
}
