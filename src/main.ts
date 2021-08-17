import http = require("http");
import express = require("express");
import { Server } from "socket.io";
import MidiListener from "./lib/MidiListener";

require("dotenv").config();

console.log("Creating express app");
const app = express();
console.log("Creating webserver");
const server = http.createServer(app);

app.get("/", (req, res) => {
    res.json({foo: "bar"});
});

console.log("Creating websocket server");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const devices = MidiListener.getDevices();
const midiListener = new MidiListener(
    devices.inputs[0],
    message => io.emit("noteOn", message),
    message => io.emit("noteOff", message),
    message => io.emit("cc", message),
);

io.on("connection", socket => {
    console.log("Client connected");
    socket.emit("greeting", "Hello Friend");

    io.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});