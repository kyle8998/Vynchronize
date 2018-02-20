var vimeoPlayer = new Vimeo.Player('player-vimeo');


vimeoPlayer.on('play', function() {
    console.log('played the video!');
    playOther(roomnum)
});

vimeoPlayer.on('pause', function() {
    console.log('paused the video!');
    pauseOther(roomnum)
});

vimeoPlayer.on('seeked', function(data) {
    console.log('seeked the video to: '+data.seconds);
    seekOther(roomnum, data.seconds)
});
//
// player.getVideoTitle().then(function(title) {
//     console.log('title:', title);
// });

function vimeoPlay() {
    vimeoPlayer.getPaused().then(function(paused) {
        // paused = whether or not the player is paused
        if (paused) {
            vimeoPlayer.play();
        } else {
            vimeoPlayer.pause();
        }

    }).catch(function(error) {
        // an error occurred
        console.log("Error: Could not retrieve Vimeo Player state")
    });
}
