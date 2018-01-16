function playVideo(roomnum){
	socket.emit('play video', roomnum);
}
