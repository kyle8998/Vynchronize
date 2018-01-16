// Calls the play video function on the server
function playVideo(roomnum){
	socket.emit('play video', roomnum);
}

// Calls the sync function on the server
function syncVideo(roomnum){
	var currTime = player.getCurrentTime();
	socket.emit('sync video', { room: roomnum, time: currTime });
}
