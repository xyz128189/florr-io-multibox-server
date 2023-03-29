import { WebSocket } from "ws";

export const enum Opcodes {
    Auth,
    Move,
    Attack,
    Defend,
    Keyboard,
    TransferHost,
    Info
}
export type CustomWebSocket = WebSocket & Record<string, any>;