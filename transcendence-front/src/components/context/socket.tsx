import { io } from "socket.io-client";

const backUrl = 'http://localhost:4444'
export const chatSocket = io(`${backUrl}/chat`);
export const sessionSocket = io(`${backUrl}/session`);
export const gameSocket = io(`${backUrl}/game`);

