const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const cors = require('cors');

app.use(cors({
	origin: '*',
}));

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;
const PLAYER_HEIGHT = 200;
const PLAYER_WIDTH = 20;



app.get('/', (req, res) => {
  res.send('<h1>Pong Game Server</h1>');
});

let rooms = [];

io.on('connection', (socket) => {
  console.log('a user connected ' + socket.id);

	socket.on("join", () => {
		// console.log(rooms);

		// get room
		let room;
		if (rooms.length > 0 && rooms[rooms.length - 1].players.length === 1) {
			room = rooms[rooms.length - 1];
		}

		if (room) {
			socket.join(room.id);
			socket.emit('playerNo', 2);

			// add player to room
			room.players.push({
				socketId: socket.id,
				playerNo: 2,
				score: 0,
				x: CANVAS_WIDTH - 20 - 20,
				y: CANVAS_HEIGHT/2 - 100/2,
			});

			io.to(room.id).emit('startingGame');

			setTimeout(() => {
				io.to(room.id).emit('startedGame', room);

				startGame(room);
			}, 3000);
		} else {
			room = {
				id: rooms.length + 1,
				players: [{
					socketId: socket.id,
					playerNo: 1,
					score: 0,
					x: 20,
					y: CANVAS_HEIGHT/2 - 100/2,
				}],
				ball: {
					x: CANVAS_WIDTH/2,
					y: CANVAS_HEIGHT/2,
					radius: 14,
					speed: 10,
					velocityX: 10,
					velocityY: 10,

				},
				winner: 0,
			}
			rooms.push(room);
			socket.join(room.id);
			socket.emit('playerNo', 1);
		}
	});

	socket.on("move", (data) => {
		let room = rooms.find(room => room.id === data.roomID);

		// if (room) {
		// 	if (data.direction === 'up') {
		// 		if (room.players[data.playerNo - 1].y > 0)
		// 			room.players[data.playerNo - 1].y -= 35;
		// 	}
		// 	else if (data.direction === 'down') {
		// 		if (room.players[data.playerNo - 1].y < CANVAS_HEIGHT - PLAYER_HEIGHT)
		// 		room.players[data.playerNo - 1].y += 35;
		// 	}
		// }
		if (room) {
			console.log(data.y);
			room.players[data.playerNo - 1].y = data.y;
			io.to(room.id).emit('updateGame', room);
		}
	});
	
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

function collision (b, p) {
	p.top = p.y;
	p.bottom = p.y + PLAYER_HEIGHT;
	p.left = p.x;
	p.right = p.x + PLAYER_WIDTH;

	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;

	return (b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top);
}

function resetBall(room) {
	room.ball.x = CANVAS_WIDTH/2;
	room.ball.y = CANVAS_HEIGHT/2;

	room.ball.speed = 10;
	
	room.ball.velocityX = room.ball.velocityX > 0 ? -10 : 10;
	room.ball.velocityY = 10;
}

function startGame(room) {
	let interval = setInterval(() => {

		if (room.ball.x - room.ball.radius < 0) {
			room.players[1].score += 1;
			resetBall(room);
		} else if (room.ball.x + room.ball.radius > CANVAS_WIDTH) {
			room.players[0].score += 1;
			resetBall(room);
		}

		room.ball.x += room.ball.velocityX;
		room.ball.y += room.ball.velocityY;
		if (room.ball.y + room.ball.radius > CANVAS_HEIGHT || room.ball.y - room.ball.radius < 0) {
			room.ball.velocityY = -room.ball.velocityY;
		}

		let player = (room.ball.x < CANVAS_WIDTH/2) ? room.players[0] : room.players[1];
		if (collision(room.ball, player)) {
			// where the ball hit the player
			let collidePoint = (room.ball.y - (player.y + PLAYER_HEIGHT/2));
			
			// normalization
			collidePoint = collidePoint / (PLAYER_HEIGHT/2);

			// calculate angle in radian
			let angleRad = (Math.PI/4) * collidePoint;

			// X direction of the ball when it's hit
			let direction = (room.ball.x < CANVAS_WIDTH/2) ? 1 : -1;

			//changle vel X and Y
			room.ball.velocityX = direction * room.ball.speed * Math.cos(angleRad);
			room.ball.velocityY = room.ball.speed * Math.sin(angleRad);

			// everytime the ball hits a paddle, we increase its speed
			room.ball.speed += 0.5;
		}

		if (room.players[0].score === 5) {
			room.winner = 1;
			rooms = rooms.filter(r => r.id !== room.id);
			io.to(room.id).emit('endGame', room);
			clearInterval(interval);
		}

		if (room.players[1].score === 5) {
			room.winner = 2;
			rooms = rooms.filter(r => r.id !== room.id);
			io.to(room.id).emit('endGame', room);
			clearInterval(interval);
		}
		io.to(room.id).emit('updateGame', room);
	}, 1000 / 60);
}

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});