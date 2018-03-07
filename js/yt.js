var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

var playerStatus = -1;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        playerVars: {
            autoplay: 0,
            rel: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

}

function onPlayerReady(event) {
    //document.getElementById('player').style.borderColor = '#FF6D00';
    document.getElementById('player').style.borderColor = '#00000000';
}

function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
        color = "#37474F"; // unstarted = gray
    } else if (playerStatus == 0) {
        color = "#FFFF00"; // ended = yellow
    } else if (playerStatus == 1) {
        color = "#33691E"; // playing = green
    } else if (playerStatus == 2) {
        color = "#DD2C00"; // paused = red
    } else if (playerStatus == 3) {
        color = "#AA00FF"; // buffering = purple
    } else if (playerStatus == 5) {
        color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
        document.getElementById('player').style.borderColor = color;
    }
}

function onPlayerStateChange(event) {
    //changeBorderColor(event.data);
    //socket.emit('player status', event.data);
    playerStatus = event.data;

    // Event Listeners
    switch (playerStatus) {
        case 0:
            //record('video ended');
            break;
        case 1:
            console.log(host)
            if (host) {
                playOther(roomnum)
            } else {
                getHostData(roomnum)
            }
            break;
        case 2:
            if (host) {
                pauseOther(roomnum)
            }
            break;
        case 3:
            var currTime = player.getCurrentTime();
            if (host) {
                seekOther(roomnum, currTime)
                // syncVideo(roomnum)
            }
            break;
    }

}

function play() {
    if (playerStatus == -1 || playerStatus == 2) {
        player.playVideo();
    } else {
        player.pauseVideo();
    }
}
