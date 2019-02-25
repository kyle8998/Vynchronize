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
            rel: 0,
            controls: 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    // document.getElementById('player').src = document.getElementById('player').src + '&controls=0'
    console.log(document.getElementById('player').src)
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
            // Video Ended
            // Go to next in queue
            if (host) {
                playNext(roomnum)
            }
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

socket.on('get title', function(data, callback) {
    var videoId = data.videoId
    var user = data.user

    $.get(
        "https://www.googleapis.com/youtube/v3/videos", {
            part: 'snippet',
            id: videoId,
            key: data.api_key
        },
        function(data) {
            // enqueueNotify(user, data.items[0].snippet.title)
            socket.emit('notify alerts', {
                alert: 0,
                user: user,
                title: data.items[0].snippet.title
            })
            // Does a callback and returns title
            callback({
                videoId: videoId,
                title: data.items[0].snippet.title
            })
        }
    )
})

socket.on('get playlist videos', function(data) {
    var playlistId = data.playlistId
    var user = data.user

    $.get(
        "https://www.googleapis.com/youtube/v3/playlistItems", {
            part: 'snippet,contentDetails',
            playlistId: playlistId,
            maxResults: '50',
            key: data.api_key
        },
        function(data) {
          // Iterate through all of the playlist videos
          for (let video of data.items) {
            enqueueVideo(roomnum, video.contentDetails.videoId)
          }
        }
    )
})
