setTimeout(function() {
    console.log("whyewwefwwvrgf")
    DM.init({
        apiKey: '1e81e2b5ea5ab3dd737a',
        status: false, // check login status
        cookie: true // enable cookies to allow the server to access the session
      });

      var player = DM.player(document.querySelector('#player-daily'), {
          video: 'x26m1j4',
          width: '640',
          height: '360',
          params: {
            autoplay: false,
            mute: true
          }
        });


player.addEventListener('apiready', function(e) {
  console.log('api ready', e);
});

player.addEventListener('error', function(e) {
  console.log('error', e);
});

player.addEventListener('canplay', function(e) {
  console.log('canplay', e);
});

player.addEventListener('canplaythrough', function(e) {
  console.log('canplaythrough', e);
});

player.addEventListener('progress', function(e) {
  console.log('progress', e);
});

player.addEventListener('ad_play', function(e) {
  console.log('ad_play', e);
});

player.addEventListener('ad_end', function(e) {
  console.log('ad_end', e);
});

document.querySelector('#play').addEventListener('click', function() {
  console.log('click on play');
  player.play();
});

document.querySelector('#pause').addEventListener('click', function() {
  console.log('click on pause');
  player.pause();
});

}, 1000);
