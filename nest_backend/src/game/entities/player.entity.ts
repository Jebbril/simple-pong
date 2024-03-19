export class Player {
    socketId: string;
    playerNo: number;
    score: number;
    x: number;
    y: number;

    constructor(socketId: string, playerNo: number, score: number, x: number, y: number) {
        this.socketId = socketId;
        this.playerNo = playerNo;
        this.score = score;
        this.x = x;
        this.y = y;
    }
}