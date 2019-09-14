var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 4000;

var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);
const WatchRoom = require("./server/watchRoom");
const Client = require("./server/client");
const rooms = new Map();

// Serves resources from dist folder
app.use("/", express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function createClient(conn) {
  	return new Client(conn);
}

function createWatchroom(id, client) {
	if (rooms.has(id)) {
		// throw new Error(`Watchroom ${id} already exists`);
		console.log(`Watchroom ${id} already exists`);
		return;
	}

	const watchroom = new WatchRoom(id, client);
	console.log("Creating watchroom", watchroom);

	rooms.set(id, watchroom);
}

function getWatchroom(id) {
  	return rooms.get(id);
}

function broadcastWatchroom(watchroom) {
	if (!watchroom) return null;
	const clients = [...watchroom.clients];
	clients.forEach(client => {
		client.send({
			type: "watchroom-broadcast",
			peers: {
				you: client.id,
				clients: clients.map(client => {
					return {
						id: client.id,
						username: client.username,
						state: client.state
					};
				})
			}
		});
	});
}

function isClientPresentInWatchroom(watchroom, user) {
	if(watchroom && user) {
		for(let client of watchroom.clients) {
			if(client.username === user) {
				return true;
			}
		}
	}
	return false;
}

io.on("connection", conn => {
	console.log("Connection established");
	const client = createClient(conn);

	conn.on("message", msg => {
		console.log("Message received", msg);
		const data = JSON.parse(msg);

		if (data.type === "set-username") {
			client.setUsername(data.username);
			client.send({
				type: "username-update",
				msg: "success"
			});
		} else if (data.type === "create-watchroom") {
			if (getWatchroom(data.id)) {
				client.send({
					type: "watchroom-create",
					err: "Watchroom already exists. Please choose another name."
				});
			} else {
				client.setUsername(data.username);
				createWatchroom(data.id, client);
				client.send({
					type: "watchroom-create",
					msg: "success",
					videoId: client.state.videoId
				});
			}
		} else if (data.type === "set-video-id") {
			client.setVideoId(data.videoId);
			console.log("client ", client, client.watchroom);
			const broadcastData = {
				...data,
				username: client.username
			};
			client.broadcast(broadcastData);
		} else if (data.type === "get-all-rooms") {
			let roomNames = [...rooms.keys()];
			roomNames.sort();
			roomNames = roomNames.filter(room => room.includes(data.searchName));
			console.log("roomNames ", roomNames);
			client.send({ ...data, roomNames });
		} else if (data.type === "join-watchroom") {
			const watchroom = getWatchroom(data.room);
			if (watchroom) {
				if(isClientPresentInWatchroom(watchroom, data.username)) {
					client.send({
						type: "join-watchroom",
						err: "username already exists"
					});
				} else {
					client.setUsername(data.username);
					watchroom.join(client);
					client.state = Object.assign({}, watchroom.admin.state);
					client.send({
						type: "join-watchroom",
						state: client.state
					});
				}
			}
		} else if (data.type === "state-update") {
			const [key, value] = data.state;
			client.state[data.fragment][key] = value;
			client.broadcast(data);
		} else if (data.type === "play-status") {
			client.broadcast(data);
		} else if (data.type === "chat-message") {
			console.log("client >>> ", client);
			client.broadcast({ ...data, username: client.username });
		}
	});

	conn.on("disconnect", () => {
		console.log("Connection closed");
		const watchroom = client.watchroom;
		if (watchroom) {
			watchroom.leave(client);
			if (watchroom.clients.size === 0) {
				rooms.delete(watchroom.id);
			}
		}
		console.log(rooms);
	});
});

server.listen(port, () =>
  	console.log(`Example app listening on port ${port}!`)
);
