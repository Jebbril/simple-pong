


// select canvas

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const message = document.getElementById('message');

//create user paddle

const user = {
	x: 20,
	y: canvas.height/2 - 200/2,
	width: 20,
	height: 200,
	color: "white",
	score: 0,
}

// create com paddle

const com = {
	x: canvas.width - 20 - 20,
	y: canvas.height/2 - 100/2,
	width: 20,
	height: 200,
	color: "white",
	score: 0,
}

// create ball

const ball = {
	x: canvas.width/2,
	y: canvas.height/2,
	radius: 14,
	speed: 10,
	velocityX: 10,
	velocityY: 10,
	color: "white",
}

// create the net

const net = {
	x: canvas.width/2 - 2,
	y: 0,
	width: 4,
	height: 20,
	color: "white",
}

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
	drawText(user.score, canvas.width/4, canvas.height/5, "white");
	drawText(com.score, 3*canvas.width/4, canvas.height/5, "white");

	// draw the paddles
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawRect(com.x, com.y, com.width, com.height, com.color);

	// draw ball
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// control user paddle

// const keyPressed = [];

// window.addEventListener("keydown", (e) => {
// 	keyPressed[e.keyCode] = true;
// });

// window.addEventListener("keyup", (e) => {
// 	keyPressed[e.keyCode] = false;
// });

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
	let rect = canvas.getBoundingClientRect();

	user.y = evt.clientY - rect.top - user.height/2;
}

// collision detection

function collision (b, p) {
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;

	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;

	return (b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top);
}

// reset ball
function resetBall() {
	ball.x = canvas.width/2;
	ball.y = canvas.height/2;

	ball.speed = 10;
	
	ball.velocityX = ball.velocityX > 0 ? -10 : 10;
	ball.velocityY = 10;
}

// update : game logic

function update() {

	// if (keyPressed[87])
	// 	if (user.y > 0)
	// 		user.y -= 5;
	// if (keyPressed[83])
	// 	if (user.y < canvas.height - user.height)
	// 		user.y += 5;

	// if (keyPressed[38])
	// 	if (com.y > 0)
	// 		com.y -= 5;
	// if (keyPressed[40])
	// 	if (com.y < canvas.height - com.height)
	// 		com.y += 5;

	// update the score
	if (ball.x - ball.radius < 0) {
		com.score++;
		resetBall();
	} else if (ball.x + ball.radius > canvas.width) {
		user.score++;
		resetBall();
	} 

	// simple AI to controle com paddle
	// let computerLevel = 0.1;
	// com.y += (ball.y - (com.y + com.height/2)) * computerLevel;
	
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;
	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
		// console.log("ball hit boundary");
		// console.log(ball.velocityY);
		ball.velocityY = -ball.velocityY;
	}

	let player = (ball.x < canvas.width/2) ? user : com;
	if (collision(ball, player)) {
		// where the ball hit the player
		let collidePoint = (ball.y - (player.y + player.height/2));
		
		// normalization
		collidePoint = collidePoint / (player.height/2);

		// calculate angle in radian
		let angleRad = (Math.PI/4) * collidePoint;

		// X direction of the ball when it's hit
		let direction = (ball.x < canvas.width/2) ? 1 : -1;

		//changle vel X and Y
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);

		// everytime the ball hits a paddle, we increase its speed
		ball.speed += 0.5;

		
	}
}

// game init

function game() {
	update();
	render();
}

// game loop

const framesPerSecond = 60;
setInterval(game, 1000/framesPerSecond);