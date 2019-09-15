export const getMessageBody = (message, time, username = null) => {
    const div = document.createElement('div');
    div.className = "sent-message";
    const messageHeader = document.createElement('div');
    messageHeader.className = "message-header";
    const messageTime = document.createElement('span');
    messageTime.innerText = time;
    messageTime.className = "message-time";
    if (username) {
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

export const getVideoId = url => {
    let video_id = url.split('v=')[1];
    const ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
}

export const initializeYoutubePlayer = () => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.querySelector('#player').appendChild(tag);
}

export const addNewMessage = message => {
	const chatBody = document.querySelector("#chat-body");
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
}

export const getUserJoinedMessage = data => {
	const div = document.createElement('div');
	div.className = data.isJoined ? "client-join py-1" : "client-left py-1";
	div.innerText = data.isJoined ? " joined the watchroom" : " left the watchroom";
	const span = document.createElement('span');
	span.className = "chat-user-name";
	span.innerText = data.username;
	div.insertBefore(span, div.firstChild);
	return div;
}
