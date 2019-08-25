function login() {
    const username = document.querySelector('#username').value;
    const alert = document.querySelector('#alert-msg');
    console.log("login ", username);
    if (!username) {
        alert.className = "alert alert-danger";
        alert.innerText = "Please enter the username";
    } else {
        connectionManager.send({
            username,
            type: 'set-username'
        });
    }
}

function createWatchroom() {
    const id = document.querySelector('#watchroom-name').value;
    const alert = document.querySelector('#create-watchroom-alert-msg');
    if (!id) {
        alert.className = "alert alert-danger";
        alert.innerText = "Please enter the watchroom name";
    } else {
        connectionManager.send({
            id,
            type: 'create-watchroom'
        });
    }
}

function getVideoId(url) {
    let video_id = url.split('v=')[1];
    const ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
}

function playVideo() {
    const url = document.querySelector('#video-url').value;
    const alert = document.querySelector('#video-url-alert-msg');
    if (!url) {
        alert.className = "alert alert-danger";
        alert.innerText = "Please enter the valid link";
    } else {
        alert.className = "";
        alert.innerText = "";
        const videoId = getVideoId(url);
        console.log("getVideoId ", videoId);
        cueVideoById(videoId);
        connectionManager.send({
            videoId,
            type: 'set-video-id'
        });
    }
}

function usernameUpdate(data) {
    console.log("data ", data);
    const logoutBtn = document.querySelector("#logout-btn");
    logoutBtn.style.display = 'block';
    const login = document.querySelector("#login");
    login.style.display = 'none';
    const watchRoom = document.querySelector("#watch-room");
    watchRoom.style.display = 'block';
}

function watchroomCreate(data) {
    console.log("data ", data);
    if (data.err) {
        const alert = document.querySelector('#create-watchroom-alert-msg');
        alert.className = "alert alert-danger";
        alert.innerText = data.err;
    } else {
        const watchRoom = document.querySelector("#watch-room");
        watchRoom.style.display = 'none';
        const player = document.querySelector("#player-container");
        player.style.display = 'block';
        cueVideoById(data.videoId);
    }
}

function getAllRooms() {
    const searchName = document.querySelector('#watchroom-search-name').value;
    connectionManager.send({
        searchName,
        type: 'get-all-rooms'
    });
}

function showAllRooms(data) {
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
            btn.className = "btn btn-primary";
            btn.innerText = "join";
            btn.onclick = () => joinWatchroom(room);
            li.appendChild(btn);
            ul.appendChild(li);
        });
    }
}

function changeVideoId(data) {
    videoId = data.videoId;
    changedBy = data.username;
    console.log(videoId, changedBy)
    cueVideoById(videoId);
}

function joinWatchroom(room) {
    if (room)
        connectionManager.send({
            room,
            type: 'join-watchroom'
        });
}

function setInitialstate(data) {
    console.log("data ", data);
    if (data.err) {
    } else {
        const watchRoom = document.querySelector("#watch-room");
        watchRoom.style.display = 'none';
        const player = document.querySelector("#player-container");
        player.style.display = 'block';
        cueVideoById(data.state.videoId);
    }
}

function sendPlayerStatus(status, time) {
    connectionManager.send({
        type: 'play-status',
        status,
        time
    })
}
