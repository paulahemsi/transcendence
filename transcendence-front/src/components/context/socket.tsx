import { io } from "socket.io-client";

const backUrl = process.env.REACT_APP_BACK_HOST
export const chatSocket = io(`${backUrl}/chat`, { withCredentials: true });
export const sessionSocket = io(`${backUrl}/session`, { withCredentials: true });
export const gameSocket = io(`${backUrl}/game`, { withCredentials: true });

