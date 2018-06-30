// Read in video input
var html5input = document.getElementById('html5-input');
html5input.onchange = function(e) {
    var html5 = document.getElementById('html5src');
    html5.src = URL.createObjectURL(this.files[0]);
    // not really needed in this exact case, but since it is really important in other cases,
    // don't forget to revoke the blobURI when you don't need it
    html5.onend = function(e) {
        URL.revokeObjectURL(this.src);
    }
}

var media = document.querySelector('video');
// var controls = document.querySelector('.controls');
//
// var play = document.querySelector('.play');
// var stop = document.querySelector('.stop');
// var rwd = document.querySelector('.rwd');
// var fwd = document.querySelector('.fwd');
//
// var timerWrapper = document.querySelector('.timer');
// var timer = document.querySelector('.timer span');
// var timerBar = document.querySelector('.timer div');
//
// media.removeAttribute('controls');
// controls.style.visibility = 'visible';

// play.addEventListener('click', playPauseMedia);

function playPauseMedia() {
    if (media.paused) {
        play.setAttribute('data-icon', 'u');
        media.play();
    } else {
        play.setAttribute('data-icon', 'P');
        media.pause();
    }
}
