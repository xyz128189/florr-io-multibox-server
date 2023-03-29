import {Server} from "http";
import {WebSocketServer} from "ws";
import {CustomWebSocket, Opcodes} from "./interfaces";
// @ts-ignore
import config from "../config.json";
import {generateString, sendAll} from "./utils";

export default function(httpServer: Server) {
    const wss = new WebSocketServer({
        path: "/ws",
        server: httpServer,
    });

    wss.on("connection", (ws: CustomWebSocket) => {
        ws.on("message", (message: Buffer) => {
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message.toString());
            } catch (e) {
                ws.close(4000, "Failed to parse message");
            }

            if (typeof parsedMessage.op !== "number") return ws.emit("error", "Invalid data provided");
            if (parsedMessage.op !== Opcodes.Auth && !ws.florrKey) return ws.close(4001, "Not authorized");

            let data = parsedMessage.d;
            let payload: any;
            switch (parsedMessage.op) {
                case Opcodes.Auth: {
                    if (!data || !data.florrKey) {
                        ws.close(4003, "Failed to authorize: Invalid data provided");
                        break;
                    }
                    if (config.allowedFlorrKeys.length !== 0 && !config.allowedFlorrKeys.some((key) => data.florrKey === key) && config.hostFlorrKey !== data.florrKey) {
                        ws.close(4002, "Your key is not in whitelist");
                        break;
                    }

                    ws.florrKey = data.florrKey;
                    ws.sessionKey = generateString(8);
                    if (![...wss.clients].some((client: CustomWebSocket) => client.isHost)) {
                        ws.isHost = ws.florrKey === config.hostFlorrKey;
                    } else {
                        ws.isHost = false;
                    }

                    let payload = {
                        op: Opcodes.Auth,
                        d: {
                            success: true,
                            isHost: ws.isHost,
                            sessionKey: ws.sessionKey
                        }
                    }
                    ws.send(JSON.stringify(payload));
                    break;
                }
                case Opcodes.Move: {
                    // NOT USED, IF YOU SEND THIS PACKET TO CLIENT NOTHING HAPPENS
                    if (!data || !data.dir && !data.angle) break;
                    payload = {
                        op: Opcodes.Move,
                        d: data
                    }
                    /*
                    d: {
                        dir: 1 (up) | 2 (down) | 3 (left) | 4 (right)
                        | angle: number (radians)
                    }
                     */
                    break;
                }
                case Opcodes.Attack: {
                    payload = {
                        op: Opcodes.Attack,
                        d: data
                    }
                    /*
                    d: {
                        cancel?: boolean
                    } | null
                     */
                    break;
                }
                case Opcodes.Defend: {
                    payload = {
                        op: Opcodes.Defend,
                        d: data
                    }
                    /*
                    d: {
                        cancel?: boolean
                    } | null
                     */
                    break;
                }
                case Opcodes.Keyboard: {
                    if (!data || !data.keyCode || !data.key || !data.code) break;
                    payload = {
                        op: Opcodes.Keyboard,
                        d: data
                    }
                    /*
                    d: {
                        keyCode: number
                        key: string
                        code: string
                        charCode?: number
                        which?: number
                        cancel?: boolean
                    }
                     */
                    break;
                }
                case Opcodes.TransferHost: {
                    if (!data || !data.receiverSessionKey || !ws.isHost) break;
                    let receiver: CustomWebSocket | undefined = [...wss.clients].find((client: CustomWebSocket) => client.sessionKey === data.receiverSessionKey);

                    if (receiver && receiver.sessionKey !== ws.sessionKey) {
                        ws.isHost = false;
                        receiver.isHost = true;

                        let payload: any = {
                            op: Opcodes.TransferHost,
                            d: {
                                success: true
                            }
                        }
                        ws.send(JSON.stringify(payload));

                        payload = {
                            op: Opcodes.Info,
                            d: {
                                message: "You're host now.",
                                color: "green"
                            }
                        }
                        receiver.send(JSON.stringify(payload));
                    } else {
                        let payload = {
                            op: Opcodes.TransferHost,
                            d: {
                                success: false
                            }
                        }

                        ws.send(JSON.stringify(payload));
                    }
                    break;
                }
            }

            if (payload) {
                if (!ws.isHost) return;
                sendAll(wss, JSON.stringify(payload), (ws: CustomWebSocket) => ws.florrKey && !ws.isHost);
            }
        });
    });

    return wss;
}