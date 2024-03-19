import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Room } from './entities/room.entity';
import { Player } from './entities/player.entity';
import { Ball } from './entities/ball.entity';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 200;

@Injectable()
export class GameService {
    public rooms: Array<Room> = [];

    joinGame(client: Socket, data: any, server: Server) {
        let room: Room;
        if (this.rooms.length > 0 && this.rooms[this.rooms.length - 1].players.length === 1) {
			room = this.rooms[this.rooms.length - 1];
		}

        if (room) {
			client.join(room.id);
			client.emit('playerNo', 2);

			// add player to room
			room.players.push(new Player(client.id, 2, 0, CANVAS_WIDTH - 20 - PADDLE_WIDTH, CANVAS_HEIGHT/2 - 100/2));

			server.to(room.id).emit('startingGame');

			setTimeout(() => {
				server.to(room.id).emit('startedGame', room);

				startGame(room, this.rooms, server);
			}, 5000);
		} else {
            room = new Room(new Ball(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 14, 10, 10, 10), 0);
            room.players.push(new Player(client.id, 1, 0, 20, CANVAS_HEIGHT/2 - 100/2));
            this.rooms.push(room);
            client.join(room.id);
            client.emit('playerNo', 1);
		}
    }

    movePaddle(client: Socket, data:any, server: Server) {
        let room = this.rooms.find(room => room.id === data.roomID);
        
        if (room) {
            room.players[data.playerNo - 1].y = data.y;
			server.to(room.id).emit('updateGame', room);
		}
    }

    leaveGame(client: Socket, server: Server) {
        let room = this.rooms.find(room => room.players.some(player => player.socketId === client.id));
        if (room) {
            if (room.players.length === 1) {
                this.rooms = this.rooms.filter(r => r.id !== room.id);
            } else if (room.players.length === 2) {
                if (room.players[0].socketId === client.id) {
                    room.winner = 2;
                    room.players[1].score = 5;
                    server.to(room.id).emit('updateGame', room);
                    this.rooms = this.rooms.filter(r => r.id !== room.id);
                    server.to(room.id).emit('endGame', room);
                } else {
                    room.winner = 1;
                    room.players[0].score = 5;
                    server.to(room.id).emit('updateGame', room);
                    this.rooms = this.rooms.filter(r => r.id !== room.id);
                    server.to(room.id).emit('endGame', room);
                }
            }
        }
    }

}

function collision (b: Ball, p: Player) {
    let p_top = p.y;
    let p_bottom = p.y + PADDLE_HEIGHT;
    let p_left = p.x;
    let p_right = p.x + PADDLE_WIDTH;

    let b_top = b.y - b.radius;
    let b_bottom = b.y + b.radius;
    let b_left = b.x - b.radius;
    let b_right = b.x + b.radius;

    return (b_right > p_left && b_top < p_bottom && b_left < p_right && b_bottom > p_top);
}

function resetBall(room) {
    room.ball.x = CANVAS_WIDTH/2;
    room.ball.y = CANVAS_HEIGHT/2;

    room.ball.speed = 10;
    
    room.ball.velocityX = room.ball.velocityX > 0 ? -10 : 10;
    room.ball.velocityY = 10;
}

function startGame(room, rooms, server) {
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
            let collidePoint = (room.ball.y - (player.y + PADDLE_HEIGHT/2));
            
            // normalization
            collidePoint = collidePoint / (PADDLE_HEIGHT/2);

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
            server.to(room.id).emit('endGame', room);
            clearInterval(interval);
        }

        if (room.players[1].score === 5) {
            room.winner = 2;
            rooms = rooms.filter(r => r.id !== room.id);
            server.to(room.id).emit('endGame', room);
            clearInterval(interval);
        }
        server.to(room.id).emit('updateGame', room);
    }, 1000 / 60);
}
