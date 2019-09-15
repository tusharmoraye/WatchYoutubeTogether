class WatchRoom {
    constructor(id, client) {
        this.id = id;
        this.clients = new Set;
        this.admin = client;
        this.join(client, true);
    }

    join(client, isAdmin = false) {
        if (client.watchroom) {
            // throw new Error('Client already in watchroom');
            console.log('Client already in watchroom');
            return;
        }
        this.clients.add(client);
        client.watchroom = this;
        client.isAdmin = isAdmin;
    }

    leave(client) {
        if (client.watchroom !== this) {
            // throw new Error('Client not in watchroom');
            console.log('Client not in watchroom');
            return;
        }
        this.clients.delete(client);
        client.watchroom = null;
	}
}

module.exports = WatchRoom;
