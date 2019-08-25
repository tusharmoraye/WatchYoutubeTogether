class Client {
    constructor(conn) {
        this.conn = conn;
        this.watchroom = null;
        this.id = conn.id;
        this.username = '';
        this.isAdmin = false;

        this.state = {
            videoId: 'ATf05n5LBHQ',
            videoState: {
                paused: true,
                position: 0,
            },
        };
    }

    setVideoId(id) {
        this.state.videoId = id;
        console.log(this.state.videoId);
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
        console.log(`Sending message ${msg}`);
        this.conn.send(msg, function ack(err) {
            if (err) {
                console.log('Error sending message', msg, err);
            }
        });
    }
}

module.exports = Client;
