import * as recievedEventUtils from './recievedEventUtils';
import io from 'socket.io-client';

export default class ConnectionManager {
    constructor() {
        this.conn = null;
    }

    connect() {
        this.conn = io();
        this.conn.addEventListener('open', () => {
            console.log('Connection established');
        });
        this.conn.addEventListener('message', event => {
            console.log('Received message', event);
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
        console.log("msg ", msg);
        const data = JSON.parse(msg);
        if (data.type === 'username-update') {
            recievedEventUtils.usernameUpdate(data);
        } else if (data.type === 'watchroom-create') {
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
		}
    }

    send(data) {
        const msg = JSON.stringify(data);
        console.log('Sending message', msg);
        this.conn.send(msg);
    }
}
