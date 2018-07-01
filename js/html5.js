// Read in video input from filesystem
// var html5input = document.getElementById('html5-input');
// html5input.onchange = function(e) {
//     var html5 = document.getElementById('html5src');
//     html5.src = URL.createObjectURL(this.files[0]);
//     // not really needed in this exact case, but since it is really important in other cases,
//     // don't forget to revoke the blobURI when you don't need it
//     html5.onend = function(e) {
//         URL.revokeObjectURL(this.src);
//     }
// }

var media = document.querySelector('video');

// Event listeners
media.addEventListener("play", function(e) {
    if (host) {
        playOther(roomnum)
    } else {
        getHostData(roomnum)
    }
})
media.addEventListener("pause", function(e) {
    if (host) {
        pauseOther(roomnum)
    }
})
media.addEventListener("seeked", function(e) {
    var currTime = media.currentTime
    if (host) {
        seekOther(roomnum, currTime)
    }
})

// Play/pause function
function html5Play() {
    if (media.paused) {
        media.play();
    } else {
        media.pause();
    }
}

// Load video
function htmlLoadVideo(videoId) {
    console.log("changing video to: " + videoId)
    media.src = videoId
}
