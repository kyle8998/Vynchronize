var currPlayer = 0

// 0 - YouTube
// 1 - Daily Motion

// Create Youtube Player
socket.on('createYoutube', function(data) {
    if (currPlayer != 0){
        // var playerIn = document.getElementById("playerArea")
        // console.log(playerIn.innerHTML)
        // playerIn.innerHTML = "<iframe id=\"player\"allowfullscreen=\"0\"width=\"640\" height=\"360\"src=\"https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1\"frameborder=\"0\"style=\"border: solid 4px #37474F\"></iframe>"
        // onYouTubeIframeAPIReady()

        var daily = document.getElementById('dailyArea');
        daily.style.display='none';

        var you = document.getElementById('playerArea');
        you.style.display='block';
        currPlayer = 0

    }
});

// Create Daily Motion Player
socket.on('createDaily', function(data) {
    console.log("i am in create daily")
    // player.destroy()
    if (currPlayer != 1) {
    //     var playerIn = document.getElementById("playerArea")
    //     console.log(playerIn.innerHTML)
    //     playerIn.innerHTML = "<iframe id=\"player-daily\" frameborder=\"0\" width=\"640\" height=\"360\"src=\"//www.dailymotion.com/embed/video/x26m1j4\"allowfullscreen allow=\"autoplay\"></iframe>"

        var you = document.getElementById('playerArea');
        you.style.display='none';

        var daily = document.getElementById('dailyArea');
        daily.style.display='block';
        currPlayer = 1
        console.log("hey i am number 1")
    }
});


// changeSinglePlayer(roomnum, playerId){
//
// 	return new Promise((resolve, reject) => {
//         switch(playerId) {
//             case 0:
//                 if (currPlayer != 0){
//                     // var playerIn = document.getElementById("playerArea")
//                     // console.log(playerIn.innerHTML)
//                     // playerIn.innerHTML = "<iframe id=\"player\"allowfullscreen=\"0\"width=\"640\" height=\"360\"src=\"https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1\"frameborder=\"0\"style=\"border: solid 4px #37474F\"></iframe>"
//                     // onYouTubeIframeAPIReady()
//
//                     var daily = document.getElementById('dailyArea');
//                     daily.style.display='none';
//
//                     var you = document.getElementById('playerArea');
//                     you.style.display='block';
//                     currPlayer = 0
//
//                 }
//                 break;
//             case 1:
//                 if (currPlayer != 1) {
//                 //     var playerIn = document.getElementById("playerArea")
//                 //     console.log(playerIn.innerHTML)
//                 //     playerIn.innerHTML = "<iframe id=\"player-daily\" frameborder=\"0\" width=\"640\" height=\"360\"src=\"//www.dailymotion.com/embed/video/x26m1j4\"allowfullscreen allow=\"autoplay\"></iframe>"
//
//                     var you = document.getElementById('playerArea');
//                     you.style.display='none';
//
//                     var daily = document.getElementById('dailyArea');
//                     daily.style.display='block';
//                     currPlayer = 1
//                     console.log("hey i am number 1")
//                 }
//                 break;
//             default:
//                 console.log("Error invalid player id")
//         }
//       })
//
// }
