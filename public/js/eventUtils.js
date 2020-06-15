import { getMessageBody, getVideoId } from './utils';

let timer, isStatusSent;

export const logout = () => location.reload();

export const welcome = () => {
    document.querySelector('#welcome').style.display = 'none';
    document.querySelector('#watch-room').style.display = 'block';
}

export const getAllRooms = () => {
    const searchName = document.querySelector('#watchroom-search-name').value;
    window.connectionManager.send({
        searchName,
        type: 'get-all-rooms'
    });
}

export const createWatchroom = () => {
    const username = document.querySelector('#username');
    const watchroomName = document.querySelector('#watchroom-name');
    const alert = document.querySelector('#create-watchroom-alert-msg');
    if (!username.value) {
        alert.className = "alert alert-danger";
        alert.innerText = "Please enter the username";
        return;
    }
    if (!watchroomName.value) {
        alert.className = "alert alert-danger";
        alert.innerText = "Please enter the watchroom name";
        return;
    } else {
        window.connectionManager.send({
            id: watchroomName.value,
            username: username.value,
            type: 'create-watchroom'
        });
        watchroomName.value = '';
        username.value = '';
    }
}

export const playVideo = () => {
    const url = document.querySelector('#video-url').value;
    const alert = document.querySelector('#video-url-alert-msg');
    if (!url) {
        alert.className = "alert alert-danger";
        alert.innerText = "Please enter the valid link";
    } else {
        alert.className = "";
        alert.innerText = "";
        const videoId = getVideoId(url);
        window.youtubePlayer.cueVideoById(videoId);
        window.connectionManager.send({
            videoId,
            type: 'set-video-id'
        });
    }
}

const sendTypingStatus = status => {
    window.connectionManager.send({
        type: 'typing-status',
        status
    });
    isStatusSent = status;
};

export const checkForSubmit = () => {
    if (event.keyCode == 13) {
        sendMessage();
    } else {
        if (!isStatusSent)
            sendTypingStatus(true);
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => sendTypingStatus(false), 2000);
    }
};

export const sendMessage = () => {
    sendTypingStatus(false);
    const messageInput = document.querySelector("#chat-input");
    const chatBody = document.querySelector("#chat-body");
    const message = messageInput.value;
    const time = new Date().toISOString();
    if (!message) return;
    window.connectionManager.send({
        type: 'chat-message',
        message,
        time
    });
    messageInput.value = '';
    const messageSent = getMessageBody(message, time);
    chatBody.appendChild(messageSent);
    chatBody.scrollTop = chatBody.scrollHeight;
}

export const sendPlayerStatus = (status, time) => {
    window.connectionManager.send({
        type: 'play-status',
        status,
        time
    });
}

export const joinWatchroom = room => {
    const usernameInput = document.querySelector('#join-username');
    const username = usernameInput.value;
    if (username && room) {
        window.connectionManager.send({
            type: 'join-watchroom',
            room,
            username
        });
        usernameInput.value = "";
        return;
    }
    const alert = document.querySelector("#join-watchroom-alert-msg");
    alert.className = "alert alert-danger";
    alert.innerText = "please enter the username";
}