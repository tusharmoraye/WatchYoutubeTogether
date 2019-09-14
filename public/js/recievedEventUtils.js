import { joinWatchroom } from './eventUtils';
import { getMessageBody, initializeYoutubePlayer } from './utils';

export const usernameUpdate = data => {
    console.log("data ", data);
    const logoutBtn = document.querySelector("#logout-btn");
    logoutBtn.style.display = 'block';
}

export const watchroomCreate = data => {
    console.log("data ", data);
    if (data.err) {
        const alert = document.querySelector('#create-watchroom-alert-msg');
        alert.className = "alert alert-danger";
        alert.innerText = data.err;
    } else {
        const logoutBtn = document.querySelector("#logout-btn");
        logoutBtn.style.display = 'block';
        const watchRoom = document.querySelector("#watch-room");
        watchRoom.style.display = 'none';
        const player = document.querySelector("#player-container");
        player.style.display = 'block';
        initializeYoutubePlayer();
        window.youtubePlayer.cueVideoById(data.videoId);
    }
}

export const changeVideoId = data => {
    window.youtubePlayer.cueVideoById(data.videoId);
}

export const showAllRooms = data => {
    const ul = document.querySelector('#all-watchrooms');
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    const roomNames = data.roomNames;
    if (roomNames && roomNames.length) {
        roomNames.map(room => {
            const li = document.createElement('li');
            li.innerText = room;
            li.className = "list-elements p-2";
            const btn = document.createElement('button');
            btn.className = "btn btn-primary float-right";
            btn.innerText = "join";
            btn.onclick = () => joinWatchroom(room);
            li.appendChild(btn);
            ul.appendChild(li);
        });
    }
}

export const setInitialstate = data => {
    console.log("data ", data);
    if (data.err) {
        const alert = document.querySelector("#join-watchroom-alert-msg");
        alert.className = "alert alert-danger";
        alert.innerText = data.err;
    } else {
        const logoutBtn = document.querySelector("#logout-btn");
        logoutBtn.style.display = 'block';
        const watchRoom = document.querySelector("#watch-room");
        watchRoom.style.display = 'none';
        const player = document.querySelector("#player-container");
        player.style.display = 'block';
        initializeYoutubePlayer();
        window.youtubePlayer.cueVideoById(data.state.videoId);
    }
}

export const playerStatusUpdate = data => window.youtubePlayer.changePlayerStatus(data);

export const messageReceived = data => {
    const chatBody = document.querySelector("#chat-body");
    chatBody.appendChild(getMessageBody(data.message, data.time, data.username));
    chatBody.scrollTop = chatBody.scrollHeight;
}