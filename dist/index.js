"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const websocket_1 = __importDefault(require("./websocket"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const wss = (0, websocket_1.default)(httpServer);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.get("/", (req, res) => {
    res.send("Server is working");
});
app.get("/getClients", (req, res) => {
    res.send({
        clients: [...wss.clients].map((client) => {
            return {
                sessionKey: client.sessionKey,
                isHost: client.isHost
            };
        })
    });
});
httpServer.listen(8080, () => console.log("Server listening on port 8080"));
