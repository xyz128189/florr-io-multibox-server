import { createServer } from "http";
import express from "express";
import websocket from "./websocket";
import { CustomWebSocket } from "./interfaces";

const app = express();
const httpServer = createServer(app);
const wss = websocket(httpServer);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.get("/", (req, res) => {
    res.send("Server is working");
});
app.get("/getClients", (req, res) => {
    res.send({
        clients: [...wss.clients].map((client: CustomWebSocket) => {
            return {
                sessionKey: client.sessionKey,
                isHost: client.isHost
            }
        })
    });
});

httpServer.listen(8080, () => console.log("Server listening on port 8080"));