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
	const username = document.querySelector('#username');
    const watchroomName = document.querySelector('#watchroom-name');
	const alert = document.querySelector('#create-watchroom-alert-msg');
	if(!username.value) {
		alert.className = "alert alert-danger";
		alert.innerText = "Please enter the username";
		return;
	}
    if (!watchroomName.value) {
        alert.className = "alert alert-danger";
		alert.innerText = "Please enter the watchroom name";
		return;
    } else {
        connectionManager.send({
			id: watchroomName.value,
			username: username.value,
            type: 'create-watchroom'
		});
		watchroomName.value = '';
		username.value = '';
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
}

function watchroomCreate(data) {
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
	const usernameInput = document.querySelector('#join-username');
	const username = usernameInput.value;
	if (username && room) {
        connectionManager.send({
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

function setInitialstate(data) {
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
        cueVideoById(data.state.videoId);
    }
}

function sendPlayerStatus(status, time) {
    connectionManager.send({
        type: 'play-status',
        status,
        time
    });
}

function getMessageBody(message, time, username = null) {
	const div = document.createElement('div');
	div.className = "sent-message";
	const messageHeader = document.createElement('div');
	messageHeader.className = "message-header";
	const messageTime = document.createElement('span');
	messageTime.innerText = time;
	messageTime.className = "message-time";
	if(username) {
		div.className = "recieved-message";
		const messageUser = document.createElement('span');
		messageUser.innerText = "# " + username;
		messageHeader.appendChild(messageUser);
	}
	messageHeader.appendChild(messageTime);
	const messageBody = document.createElement('div');
	messageBody.className = "message-body"
	messageBody.innerText = message;
	div.appendChild(messageHeader);
	div.appendChild(messageBody);
	return div;
}

function sendMessage() {
	const messageInput = document.querySelector("#chat-input");
	const chatBody = document.querySelector("#chat-body");
	const message = messageInput.value;
	const time = new Date().toLocaleString();
	if(!message) return;
	connectionManager.send({
		type: 'chat-message',
		message,
		time
	});
	messageInput.value = '';
	const messageSent = getMessageBody(message, time);
	chatBody.appendChild(messageSent);
	chatBody.scrollTop = chatBody.scrollHeight;
}

function messageReceived(data) {
	const chatBody = document.querySelector("#chat-body");
	chatBody.appendChild(getMessageBody(data.message, data.time, data.username));
	chatBody.scrollTop = chatBody.scrollHeight;
}

function checkForSubmit() {
	console.log(event);
	if(event.keyCode == 13) {
		sendMessage();
	}
}