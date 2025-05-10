import SocketIO = require("socket.io");
import HttpServer from "../lib/HttpServer";

class WebsocketServer {
    static ready = false;
    static instance: WebsocketServer;

    static io: SocketIO.Server;
    static clients: Record<string, SocketIO.Socket> = {};

    constructor(httpServer: HttpServer) {
        WebsocketServer.io = new SocketIO.Server(httpServer.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        WebsocketServer.io.on("connection", socket => {
            //get handshake args
            const query = socket.handshake.query;
            const id =
                (query.id as string) ||
                Buffer.from(Math.random().toString()).toString("base64").substring(0, 10);

            console.log(`Websocket client ${id} connected`);
            WebsocketServer.clients[id] = socket;

            //get disconnect
            socket.on("disconnect", () => {
                console.log(`Websocket client ${id} disconnected`);
                delete WebsocketServer.clients[id];
            });
        });

        WebsocketServer.instance = this;
    }
}

export default WebsocketServer;
