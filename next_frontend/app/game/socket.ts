import { io } from "socket.io-client";

const gameSocket = io("http://localhost:3001/game");

export default gameSocket;