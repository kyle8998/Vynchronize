DM.init({
    apiKey: '1e81e2b5ea5ab3dd737a',
    status: true, // check login status
    cookie: true // enable cookies to allow the server to access the session
  });

  var player = DM.player(document.getElementById('player'), {
      video: 'xwr14q',
      width: '100%',
      height: '100%',
      params: {
        autoplay: true,
        mute: true
      }
    });
