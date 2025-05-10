import http = require("http");
import express = require("express");
import cors from "cors";
import packageJson from "../../package.json";

class HttpServer {
    static ready = false;
    static instance: HttpServer;

    static onHttpGet: ((id: string, query: Record<string, string>, body: any) => void)[] = [];
    static onHttpPost: ((id: string, query: Record<string, string>, body: any) => void)[] = [];
    static onHttpDelete: ((id: string, query: Record<string, string>, body: any) => void)[] = [];
    static onHttpPatch: ((id: string, query: Record<string, string>, body: any) => void)[] = [];
    static onHttpPut: ((id: string, query: Record<string, string>, body: any) => void)[] = [];

    app: express.Application;
    server: http.Server;

    constructor() {
        this.app = express();
        this.app.use(cors());
        const server = http.createServer(this.app);

        const PORT = process.env.PORT || 3101;
        const serverHandle = server.listen(PORT, () => {
            console.log("#############################################");
            console.log(`##   MIDI Server running on port ${PORT}   ##`);
            console.log("#############################################");
            console.log("");
            HttpServer.ready = true;
        });
        this.server = serverHandle;
        HttpServer.instance = this;

        this.app.get("/", (_, res) => {
            res.json({ version: packageJson.version });
        });
    }

    static async waitForReady() {
        if (HttpServer.ready) return;
        return new Promise<void>(resolve => {
            const interval = setInterval(() => {
                if (HttpServer.ready) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }
}

export default HttpServer;
