import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ namespace: 'game',  cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect{
	constructor(private GameService: GameService) {}
	@WebSocketServer()
	server: Server;
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

	@SubscribeMessage('join')
	handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
		console.log('join ' + client.id);
		this.GameService.joinGame(client, data, this.server);
	}

	@SubscribeMessage('move')
	handleMove(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
		this.GameService.movePaddle(client, data, this.server);
	}

	handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): any {
		console.log(client.id + ' connected');
	}

	handleDisconnect(@ConnectedSocket() client: Socket): any {
		this.GameService.leaveGame(client, this.server);
		console.log(client.id + ' disconnected');
	}
}
