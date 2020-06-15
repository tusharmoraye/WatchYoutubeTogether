import * as recievedEventUtils from './recievedEventUtils';
import io from 'socket.io-client';

export default class ConnectionManager {
    constructor() {
		this.conn = null;
		this.isAdmin = false;
    }

    connect() {
        this.conn = io();
        this.conn.addEventListener('open', () => {
        });
        this.conn.addEventListener('message', event => {
            this.receive(event);
        });
    }

    createWatchroom() {
        this.send({
            type: 'join-session',
        });
    }

    joinWatchroom() {
        this.send({
            type: 'join-session',
        });
    }

    receive(msg) {
        const data = JSON.parse(msg);
        if (data.type === 'watchroom-create') {
			this.isAdmin = true;
            recievedEventUtils.watchroomCreate(data);
        } else if (data.type === 'set-video-id') {
            recievedEventUtils.changeVideoId(data);
        } else if (data.type === 'get-all-rooms') {
            recievedEventUtils.showAllRooms(data);
        } else if (data.type === 'join-watchroom') {
            recievedEventUtils.setInitialstate(data);
        } else if (data.type === 'play-status') {
            recievedEventUtils.playerStatusUpdate(data);
        } else if (data.type === 'chat-message') {
			recievedEventUtils.messageReceived(data);
		} else if (data.type === 'client-join') {
			recievedEventUtils.userJoined({ ...data, isJoined: true});
			if(this.isAdmin) 
				window.youtubePlayer.broadcastPlayerState();
		} else if (data.type === 'client-left') {
			recievedEventUtils.userJoined({ ...data, isJoined: false});
		} else if (data.type === 'typing-status') {
            recievedEventUtils.updateTypingStatus(data);
        }
    }

    send(data) {
        const msg = JSON.stringify(data);
        this.conn.send(msg);
    }
}
