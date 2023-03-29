"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateString = exports.sendAll = void 0;
const ws_1 = require("ws");
function sendAll(wss, payload, filterFn) {
    let clients = wss.clients;
    // @ts-ignore
    clients.forEach((client) => {
        if (client.readyState !== ws_1.WebSocket.OPEN)
            return;
        if (filterFn) {
            if (!filterFn(client))
                return;
        }
        client.send(payload);
    });
}
exports.sendAll = sendAll;
function generateString(length, allowedChars) {
    let result = '';
    let characters = allowedChars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateString = generateString;
