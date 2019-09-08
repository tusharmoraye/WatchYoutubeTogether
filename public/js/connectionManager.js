class ConnectionManager {
    constructor() {
        this.conn = null;
    }

    connect() {
        this.conn = io();;

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
            usernameUpdate(data);
        } else if (data.type === 'watchroom-create') {
            watchroomCreate(data);
        } else if (data.type === 'watchroom-broadcast') {
            // this.updateManager(data.peers);
        } else if (data.type === 'state-update') {
            // this.updatePeer(data.clientId, data.fragment, data.state);
        } else if (data.type === 'set-video-id') {
            changeVideoId(data);
        } else if (data.type === 'get-all-rooms') {
            showAllRooms(data);
        } else if (data.type === 'join-watchroom') {
            setInitialstate(data);
        } else if (data.type === 'play-status') {
            changePlayerStatus(data);
        } else if (data.type === 'chat-message') {
			messageReceived(data);
		}
    }

    send(data) {
        const msg = JSON.stringify(data);
        console.log('Sending message', msg);
        this.conn.send(msg);
    }
}
