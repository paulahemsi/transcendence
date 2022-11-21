import { io } from "socket.io-client";

export const chatSocket = io('/chat');
export const sessionSocket = io('/session');
export const gameSocket = io('/game');

