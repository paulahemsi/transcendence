import { io } from "socket.io-client";

export const chatSocket = io('/chat');
