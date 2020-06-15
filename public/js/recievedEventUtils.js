import { joinWatchroom } from './eventUtils';
import { getMessageBody, initializeYoutubePlayer, addNewMessage, getUserJoinedMessage } from './utils';

const typingPeople = [];

export const watchroomCreate = data => {
    if (data.err) {
        const alert = document.querySelector('#create-watchroom-alert-msg');
        alert.className = "alert alert-danger text-center";
        alert.innerHTML = data.err;
    } else {
        document.querySelector("#logout-btn").style.display = 'block';
        document.querySelector("#watch-room").style.display = 'none';
        document.querySelector("#player-container").style.display = 'block';
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
    if (data.err) {
        const alert = document.querySelector("#join-watchroom-alert-msg");
        alert.className = "alert alert-danger text-center";
        alert.innerText = data.err;
    } else {
        document.querySelector("#logout-btn").style.display = 'block';
        document.querySelector("#watch-room").style.display = 'none';
        document.querySelector("#player-container").style.display = 'block';
        initializeYoutubePlayer();
        window.youtubePlayer.cueVideoById(data.videoId);
    }
}

export const playerStatusUpdate = data => 
	window.youtubePlayer.changePlayerStatus(data);

export const messageReceived = data => 
	addNewMessage(getMessageBody(data.message, data.time, data.username));
	
export const userJoined = data => 
    addNewMessage(getUserJoinedMessage(data));
    
const getFormattedTypingPeople = () => {
    return 'typing: ' + typingPeople.join(', ');
}

export const updateTypingStatus = data => {
    const { status, username } = data;
    const typingContainer = document.querySelector('.typing-status');
    if(status) {
        if(typingPeople.indexOf(username) === -1) {
            typingPeople.push(username);
            typingContainer.style.top = "-30px";
            typingContainer.innerText = getFormattedTypingPeople();
        }
    } else {
        if(typingPeople.indexOf(username) != -1) {
            typingPeople.splice(typingPeople.indexOf(username), 1);
            if(typingPeople.length)
                typingContainer.innerText = getFormattedTypingPeople();
            else
                typingContainer.style.top = "0";
        }
    }
};