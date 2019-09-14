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
    const playerContainer = document.querySelector('#player');
    playerContainer.appendChild(tag);
}