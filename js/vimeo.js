var vimeoPlayer = new Vimeo.Player('player-vimeo');


// player.on('play', function() {
//     console.log('played the video!');
// });
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
