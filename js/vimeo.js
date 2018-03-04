var vimeoPlayer = new Vimeo.Player('player-vimeo');


vimeoPlayer.on('play', function() {
    console.log('played the video!');
    if (host) {
        playOther(roomnum)
    }
    else {
        getHostData(roomnum)
    }
});

vimeoPlayer.on('pause', function() {
    console.log('paused the video!');
    if (host) {
        pauseOther(roomnum)
    }
});

vimeoPlayer.on('seeked', function(data) {
    currTime = data.seconds
    console.log('seeked the video to: ' + currTime);
    if (host) {
        seekOther(roomnum, currTime)
    }
    else {
        getHostData(roomnum)
    }
    // seekOther(roomnum, currTime)
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
