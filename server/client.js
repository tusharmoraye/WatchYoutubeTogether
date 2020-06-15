class Client {
    constructor(conn) {
        this.conn = conn;
        this.watchroom = null;
        this.id = conn.id;
        this.username = '';
        this.isAdmin = false;
        this.videoId = 'LXb3EKWsInQ';
    }

    setVideoId(id) {
        this.videoId = id;
    }

    setVideoIdForAll(id) {
        [...this.watchroom.clients]
            .forEach(client => client.setVideoId(id));
    }

    setUsername(name) {
        this.username = name;
    }

    broadcast(data) {
        if (!this.watchroom) {
            // throw new Error('Can not broadcast without watchroom');
            console.log('Can not broadcast without watchroom');
            return;
        }

        [...this.watchroom.clients]
            .filter(client => client !== this)
            .forEach(client => client.send(data));
    }

    send(data) {
        const msg = JSON.stringify(data);
        this.conn.send(msg, err => err && console.log('Error sending message', msg, err));
    }
}

module.exports = Client;
