(function (window) {
	var CLOCK_PORT = 5001,
		EPSILON = -1 / 15,
		DURATION = 149.619,

		maxOffset = 1 / 30,
		video = document.getElementById('video'),
		clock = document.getElementById('clock'),
		videoTime = document.getElementById('video-time'),
		volume = document.getElementById('volume'),
		muted = document.getElementById('muted'),

		targetTime = 0,
		serverUrl,
		remoteClock,
		durationInMilliseconds,
		timeout,
		retries = 0,

		isBuffered;

	function updateClockDisplay() {
		clock.textContent = (new Date(remoteClock.time())).toTimeString();
		videoTime.textContent = ((remoteClock.time() % durationInMilliseconds) / 1000).toFixed(2);
		requestAnimationFrame(updateClockDisplay);
	}

	function checkAgain(delay) {
		clearTimeout(timeout);
		timeout = setTimeout(checkSync, delay);
	}

	function checkSync(evt) {
		var currentTime,
			current,
			currentBuffered,
			targetBuffered,
			targetDiff,
			currentDiff,
			skip;

		//currentTime is the time we should be at NOW
		currentTime = (remoteClock.time() % durationInMilliseconds) / 1000;

		//targetTime is the time we're seeking to and want to catch up to later
		//it's a little bit ahead of where we are so we can take time to buffer
		targetTime = Math.max(targetTime, currentTime);

		currentDiff = currentTime - video.currentTime;

		current = currentDiff > EPSILON && currentDiff < maxOffset;
		targetBuffered = isBuffered(targetTime);
		currentBuffered = isBuffered(currentTime) && isBuffered(currentTime + 2);

		if (currentBuffered && current) {
			video.play();
			retries = Math.min(2, retries);
			checkAgain(2000);
			return;
		}

		//we missed our window, so seek ahead and try again
		if (currentDiff >= EPSILON && video.readyState < 2 || currentDiff > 1) {
			skip = Math.pow(2, Math.min(4, Math.max(retries, 1)));
			targetTime = (currentTime + skip) % DURATION;
			video.pause();
			video.currentTime = targetTime;
			retries++;
			maxOffset = Math.max(maxOffset, retries * 0.1);
			checkAgain(1000);
			return;
		}

		//we haven't caught up yet, so give it a little more time to buffer and check in again
		targetDiff = targetTime - currentTime;
		checkAgain(targetDiff * 500);
	}

	function stateUpdate(evt) {
		if (!video.duration) {
			console.log('No video duration yet');
			video.pause();
			return;
		}

		console.log('video metadata', video.duration, video.videoWidth, video.videoHeight);
		durationInMilliseconds = Math.round(DURATION * 1000);
		if (remoteClock.accuracy() > 100) {
			return;
		}

		checkSync(evt || 'clock update');
	}

	function timeBuffered(time) {
		var i;
		if (!video.buffered) {
			return true;
		}

		for (i = 0; i < video.buffered.length; i++) {
			if (video.buffered.start(i) > time) {
				return false;
			}
			if (video.buffered.end(i) >= time) {
				return true;
			}
		}
		return false;
	}

	/*
	This runs whenever either the clock accuracy changes or the video duration changes.
	*/
	if (!video.buffered || 'mozId' in navigator) {
		isBuffered = function (time) {
			return (time - video.currentTime < 5) && video.readyState >= 3 || timeBuffered(time);
		};
	} else {
		isBuffered = timeBuffered;
	}

	serverUrl = location.protocol + '//' + location.hostname + ':' + CLOCK_PORT + '/time-server';
	remoteClock = new RemoteClock(serverUrl, stateUpdate);

	video.muted = true;
	video.addEventListener('durationchange', stateUpdate, false);
	//video.addEventListener('waiting', stateUpdate, false);
	//video.addEventListener('seeked', stateUpdate, false);
	video.addEventListener('volumechange', function () {
		volume.value = video.volume;
		if (video.muted) {
			mute.textContent = 'Unmute';
		} else {
			mute.textContent = 'Mute';
		}
	});
	mute.addEventListener('click', function () {
		video.muted = !video.muted;
	});
	volume.addEventListener('input', function () {
		video.volume = volume.value;
	});
	window.addEventListener('touchstart', function touchstart(evt) {
		video.load();
		evt.preventDefault();
		window.removeEventListener('touchstart', touchstart, true);
	}, true);
	updateClockDisplay();
}(this));