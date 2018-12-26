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

var locallyLoadedVideoId = '';

// Load video
function htmlLoadVideo(videoId) {
	var localVideoFileIndicatorText = "!LOCALVIDEOFILE!-";
	if (videoId.startsWith(localVideoFileIndicatorText)) {
		videoId = videoId.replace(localVideoFileIndicatorText, "");
		var filePicker = document.getElementById('html5-input');
		if (filePicker.files.length != 0) {
			var selectedLocalVideoFile = filePicker.files[0];
			if (selectedLocalVideoFile.name != videoId) {
				media.src = '';
				alert("Please select the video file '" + videoId + "' on your computer in the file selection window below.");
			} else {
				if (locallyLoadedVideoId != selectedLocalVideoFile) {
					htmlLoadLocalVideo(filePicker.files[0]);
				}
			}
		} else {
			media.src = '';
			alert("Please select the video file '" + videoId + "' on your computer in the file selection window below.");
		}
	} else {
		locallyLoadedVideoId = '';
		media.src = videoId;
	}
    console.log("changing video to: " + videoId)
}

function htmlLoadLocalVideo(localVideoFile) {
	locallyLoadedVideoId = localVideoFile;
	var URL = window.URL || window.webkitURL;
	var localVideoFileUrl = URL.createObjectURL(localVideoFile);
    media.src = localVideoFileUrl;
	
	/*
	Not really needed in this exact case, but since it is really important in other cases,
    don't forget to revoke the blob-URI when you don't need it.
	*/
    media.onend = function(e) {
       URL.revokeObjectURL(this.src);
    }
}