import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

class Player {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.score = 0;
	}
}

class Ball {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}
}

const socket = io("http://localhost:3000", {
	transports: ['websocket']
});

let startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', startGame)


setTimeout(() => {
	console.log(socket.connected);
}, 3000);

// select canvas

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const net = {
	x: canvas.width/2 - 2,
	y: 0,
	width: 4,
	height: 20,
	color: "white",
}

const message = document.getElementById('message');

function startGame() {
	startBtn.style.display = 'none';

	if (socket.connected) {
		socket.emit('join');
		message.innerText = "Waiting for other player ...";
	}
}

let player1;
let player2;
let ball;

let isGamestarted = false;
let playerNo = 0;
let roomID;


socket.on("playerNo", (newPlayerNo) =>{
	console.log(newPlayerNo);
	playerNo = newPlayerNo;
});

socket.on("startingGame", () => {
	isGamestarted = true;
	message.innerText = "Game is about to start ...";
});

socket.on("startedGame", (room) => {
	console.log(room);

	roomID = room.id;
	message.innerText = "Game Started";

	player1 = new Player(room.players[0].x, room.players[0].y, 20, 200, "white");
	player2 = new Player(room.players[1].x, room.players[1].y, 20, 200, "white");

	player1.score = room.players[0].score;
	player2.score = room.players[1].score;

	ball = new Ball(room.ball.x, room.ball.y, 14, 'white');

	// window.addEventListener("keydown", (e) => {
	// 	if (isGamestarted) {
	// 		if (e.keyCode === 38) {
	// 			socket.emit("move", {
	// 				roomID: roomID,
	// 				playerNo: playerNo,
	// 				direction: 'up',
	// 			});
	// 		} else if (e.keyCode === 40) {
	// 			socket.emit("move", {
	// 				roomID: roomID,
	// 				playerNo: playerNo,
	// 				direction: 'down',
	// 			});
	// 		}
	// 	}
	// });

	canvas.addEventListener("mousemove", movePaddle);

	
	
	
	render();
});
function movePaddle(evt) {
	let rect = canvas.getBoundingClientRect();

	if (socket.connected) {
		let ply = evt.clientY - rect.top - 200/2;
		socket.emit("move", {
			roomID: roomID,
			playerNo: playerNo,
			y: ply,
		});
	}
}

socket.on("updateGame", (room) => {
	player1.y = room.players[0].y;
	player2.y = room.players[1].y;

	player1.score = room.players[0].score;
	player2.score = room.players[1].score;

	ball.x = room.ball.x;
	ball.y = room.ball.y;

	render();
});

socket.on("endGame", (room) => {
	isGamestarted = false;
	message.innerText = `${room.winner === playerNo ? "You win !" : "You lose !"}`;
	canvas.removeEventListener("mousemove", movePaddle);

	socket.emit("leave", roomID);

	setTimeout(() => {
		drawRect(0, 0, canvas.width, canvas.height, "black");
		startBtn.style.display = 'block';
	}, 2000);
});

// draw net

function drawNet() {
	for(let i = 0; i <= canvas.height; i += 30) {
		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	}
}

// draw rect function

function drawRect(x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

drawRect(0, 0, canvas.width, canvas.height, "black");

// draw circle

function drawCircle(x, y, r, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, false);
	ctx.closePath();
	ctx.fill();
}

// draw text

function drawText(text, x, y, color) {
	ctx.fillStyle = color;
	ctx.font = "90px fantasy";
	ctx.fillText(text, x, y);
}

// render the game
function render() {
	// clear the canvas
	drawRect(0, 0, canvas.width, canvas.height, "black");

	// draw the net
	drawNet();

	// draw score
	drawText(player1.score, canvas.width/4, canvas.height/5, "white");
	drawText(player2.score, 3*canvas.width/4, canvas.height/5, "white");

	// draw the paddles
	drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
	drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);

	// draw ball
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}