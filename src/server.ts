import * as http from "http";
import * as express from "express";
import { Server } from "socket.io";
import MidiListener from "./lib/MidiListener";
import * as dotenv from "dotenv";

dotenv.config();

console.log("Creating express app");
const app = express();
console.log("Creating webserver");
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.json({ foo: "bar" });
});

console.log("Creating websocket server");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const devices = MidiListener.getDevices();
console.log(devices);
const midiListener = new MidiListener(
  process.env.DEVICENAME || devices.inputs[0],
  (message) => {
    io.emit("noteOn", message);
    console.log("noteOn", message);
  },
  (message) => {
    io.emit("noteOff", message);
    console.log("noteOff", message);
  },
  (message) => {
    io.emit("cc", message);
    console.log("cc", message);
  }
);

io.on("connection", (socket) => {
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
