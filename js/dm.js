var dailyPlayer

setTimeout(function() {
    DM.init({
        status: false, // check login status
        cookie: true // enable cookies to allow the server to access the session
    });

    dailyPlayer = DM.player(document.querySelector('#player-daily'), {
        video: 'x26m1j4',
        width: '640',
        height: '360',
        params: {
            autoplay: false,
            mute: false
        }
    });


    dailyPlayer.addEventListener('apiready', function(e) {
        console.log('api ready', e);
        // When api is ready
        document.getElementById('loading').style.display = 'none';
    });

    // Play Event
    dailyPlayer.addEventListener('play', function(e) {
        console.log('dm playing', e);
        if (host) {
            playOther(roomnum)
        }
        else {
            getHostData(roomnum)
        }
    });

    // Pause Event
    dailyPlayer.addEventListener('pause', function(e) {
        console.log('dm pausing', e);
        if (host) {
            pauseOther(roomnum)
        }
    });

    // Seek Event
    dailyPlayer.addEventListener('seeked', function(e) {
        console.log('dm seeking', e);
        currTime = dailyPlayer.currentTime
        if (host) {
            seekOther(roomnum, currTime)
        }
    });


    dailyPlayer.addEventListener('error', function(e) {
        console.log('error', e);
    });

    dailyPlayer.addEventListener('canplay', function(e) {
        console.log('canplay', e);
    });

    dailyPlayer.addEventListener('canplaythrough', function(e) {
        console.log('canplaythrough', e);
    });

    dailyPlayer.addEventListener('progress', function(e) {
        console.log('progress', e);
    });

    dailyPlayer.addEventListener('ad_play', function(e) {
        console.log('ad_play', e);
    });

    dailyPlayer.addEventListener('ad_end', function(e) {
        console.log('ad_end', e);
    });

    // document.querySelector('#play').addEventListener('click', function() {
    //     console.log('click on play');
    //     player.play();
    // });
    //
    // document.querySelector('#pause').addEventListener('click', function() {
    //     console.log('click on pause');
    //     player.pause();
    // });

}, 1000);

// Play/pause function for dailymotion
function dailyPlay() {
    if (dailyPlayer.paused) {
        dailyPlayer.play();
    } else
        dailyPlayer.pause();
}
