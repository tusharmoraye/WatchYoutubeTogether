import ConnectionManager from './ConnectionManager';
import YoutubePlayer from './YoutubePlayer';
import * as listeners from './eventUtils';

// for adding bootstrap to webpack bundle
import '../css/styles.css';

// add event listeners
document.querySelector('#logout-btn').addEventListener('click', listeners.logout);
document.querySelector('#welcome-btn').addEventListener('click', listeners.welcome);
document.querySelector('#join-watchroom-tab').addEventListener('click', listeners.getAllRooms);
document.querySelector('#watchroom-search-name').addEventListener('keyup', listeners.getAllRooms);
document.querySelector('#create-watchroom-btn').addEventListener('click', listeners.createWatchroom);
document.querySelector('#play-video-btn').addEventListener('click', listeners.playVideo);
document.querySelector('#chat-input').addEventListener('keypress', listeners.checkForSubmit);
document.querySelector('#chat-send-btn').addEventListener('click', listeners.sendMessage);

// create socket connection with server
window.connectionManager = new ConnectionManager();
window.connectionManager.connect();

window.youtubePlayer = new YoutubePlayer();

// gets called when youtube iframe api is ready
window.onYouTubeIframeAPIReady = () => {
    window.youtubePlayer.onYoutubePlayerReady();
}
