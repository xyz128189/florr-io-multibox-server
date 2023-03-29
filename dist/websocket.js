"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const interfaces_1 = require("./interfaces");
// @ts-ignore
const config_json_1 = __importDefault(require("../config.json"));
const utils_1 = require("./utils");
function default_1(httpServer) {
    const wss = new ws_1.WebSocketServer({
        path: "/ws",
        server: httpServer,
    });
    wss.on("connection", (ws) => {
        ws.on("message", (message) => {
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message.toString());
            }
            catch (e) {
                ws.close(4000, "Failed to parse message");
            }
            if (typeof parsedMessage.op !== "number")
                return ws.emit("error", "Invalid data provided");
            if (parsedMessage.op !== interfaces_1.Opcodes.Auth && !ws.florrKey)
                return ws.close(4001, "Not authorized");
            let data = parsedMessage.d;
            let payload;
            switch (parsedMessage.op) {
                case interfaces_1.Opcodes.Auth: {
                    if (!data || !data.florrKey) {
                        ws.close(4003, "Failed to authorize: Invalid data provided");
                        break;
                    }
                    if (config_json_1.default.allowedFlorrKeys.length !== 0 && !config_json_1.default.allowedFlorrKeys.some((key) => data.florrKey === key) && config_json_1.default.hostFlorrKey !== data.florrKey) {
                        ws.close(4002, "Your key is not in whitelist");
                        break;
                    }
                    ws.florrKey = data.florrKey;
                    ws.sessionKey = (0, utils_1.generateString)(8);
                    if (![...wss.clients].some((client) => client.isHost)) {
                        ws.isHost = ws.florrKey === config_json_1.default.hostFlorrKey;
                    }
                    else {
                        ws.isHost = false;
                    }
                    let payload = {
                        op: interfaces_1.Opcodes.Auth,
                        d: {
                            success: true,
                            isHost: ws.isHost,
                            sessionKey: ws.sessionKey
                        }
                    };
                    ws.send(JSON.stringify(payload));
                    break;
                }
                case interfaces_1.Opcodes.Move: {
                    // NOT USED, IF YOU SEND THIS PACKET TO CLIENT NOTHING HAPPENS
                    if (!data || !data.dir && !data.angle)
                        break;
                    payload = {
                        op: interfaces_1.Opcodes.Move,
                        d: data
                    };
                    /*
                    d: {
                        dir: 1 (up) | 2 (down) | 3 (left) | 4 (right)
                        | angle: number (radians)
                    }
                     */
                    break;
                }
                case interfaces_1.Opcodes.Attack: {
                    payload = {
                        op: interfaces_1.Opcodes.Attack,
                        d: data
                    };
                    /*
                    d: {
                        cancel?: boolean
                    } | null
                     */
                    break;
                }
                case interfaces_1.Opcodes.Defend: {
                    payload = {
                        op: interfaces_1.Opcodes.Defend,
                        d: data
                    };
                    /*
                    d: {
                        cancel?: boolean
                    } | null
                     */
                    break;
                }
                case interfaces_1.Opcodes.Keyboard: {
                    if (!data || !data.keyCode || !data.key || !data.code)
                        break;
                    payload = {
                        op: interfaces_1.Opcodes.Keyboard,
                        d: data
                    };
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
                case interfaces_1.Opcodes.TransferHost: {
                    if (!data || !data.receiverSessionKey || !ws.isHost)
                        break;
                    let receiver = [...wss.clients].find((client) => client.sessionKey === data.receiverSessionKey);
                    if (receiver && receiver.sessionKey !== ws.sessionKey) {
                        ws.isHost = false;
                        receiver.isHost = true;
                        let payload = {
                            op: interfaces_1.Opcodes.TransferHost,
                            d: {
                                success: true
                            }
                        };
                        ws.send(JSON.stringify(payload));
                        payload = {
                            op: interfaces_1.Opcodes.Info,
                            d: {
                                message: "You're host now.",
                                color: "green"
                            }
                        };
                        receiver.send(JSON.stringify(payload));
                    }
                    else {
                        let payload = {
                            op: interfaces_1.Opcodes.TransferHost,
                            d: {
                                success: false
                            }
                        };
                        ws.send(JSON.stringify(payload));
                    }
                    break;
                }
            }
            if (payload) {
                if (!ws.isHost)
                    return;
                (0, utils_1.sendAll)(wss, JSON.stringify(payload), (ws) => ws.florrKey && !ws.isHost);
            }
        });
    });
    return wss;
}
exports.default = default_1;
