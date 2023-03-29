import { WebSocketServer, WebSocket } from "ws";
import { CustomWebSocket } from "./interfaces";

export function sendAll(wss: WebSocketServer, payload: any, filterFn?: Function) {
    let clients = wss.clients;

    // @ts-ignore
    clients.forEach((client: CustomWebSocket) => {
        if (client.readyState !== WebSocket.OPEN) return;
        if (filterFn) {
            if (!filterFn(client)) return;
        }

        client.send(payload);
    });
}
export function generateString(length: number, allowedChars?: string) {
    let result = '';
    let characters = allowedChars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}