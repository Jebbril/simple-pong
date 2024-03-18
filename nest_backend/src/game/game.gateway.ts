import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'game',  cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect{
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
	handleConnection(client: any, ...args: any[]): any {
		console.log('connected');
	}
	handleDisconnect(client: any): any {
		console.log('disconnected');
	}
}
