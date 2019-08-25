var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
let lastStatus, secondLastStatus;
let isUpdated = false;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '400',
        width: '100%',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        // playerVars: { 'autoplay': 0, 'autohide': 1, 'wmode': 'opaque', 'origin': window.origin }
    });
    player.addEventListener('click', console.log("clicked"));
}

function onPlayerReady(event) {
    // event.target.playVideo();
}

function onPlayerStateChange(event) {
    console.log(event);
    if (!isUpdated && lastStatus !== YT.PlayerState.BUFFERING && (event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.PAUSED)) {
        sendPlayerStatus(event.data, player.getCurrentTime());
    } else if (lastStatus === -1 && event.data === YT.PlayerState.BUFFERING) {
        sendPlayerStatus(YT.PlayerState.PLAYING, 0);
    } else if (secondLastStatus === YT.PlayerState.PAUSED && lastStatus === YT.PlayerState.BUFFERING && event.data === YT.PlayerState.PLAYING) {
        sendPlayerStatus(event.data, player.getCurrentTime());
    }
    secondLastStatus = lastStatus;
    lastStatus = event.data;
    isUpdated = false;
}

function stopVideo() {
    player.stopVideo();
}

function cueVideoById(videoId) {
    const timer = setInterval(() => {
        console.log('inside interval');
        if (player && typeof player.cueVideoById === 'function') {
            console.log('inside interval if');
            player.cueVideoById(videoId);
            clearTimer();
        }
    }, 500);
    // player.cueVideoById(videoId);
    const clearTimer = () => clearInterval(timer);
}

function changePlayerStatus(data) {
    console.log("status ", data);
    if (data.status === YT.PlayerState.PLAYING) player.playVideo();
    else if (data.status === YT.PlayerState.PAUSED) player.pauseVideo();
    player.seekTo(data.time, true);
    isUpdated = true;
}