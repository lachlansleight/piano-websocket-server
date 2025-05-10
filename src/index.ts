#!/usr/bin/env node

import * as dotenv from "dotenv";
import HttpServer from "./lib/HttpServer";
import WebsocketServer from "./lib/WebsocketServer";
import MidiListener from "./lib/MidiListener";

const main = async () => {
    const httpServer = new HttpServer();
    await HttpServer.waitForReady();
    new WebsocketServer(httpServer);
    const midiListener = new MidiListener(process.env.MIDI_DEVICE);
    midiListener.onNoteOn.push(message => {
        console.log(`[${message.channel}] noteOn: ${message.note} (${message.velocity})`);
        WebsocketServer.io.emit("noteOn", message);
    });
    midiListener.onNoteOff.push(message => {
        console.log(`[${message.channel}] noteOff: ${message.note} (${message.velocity})`);
        WebsocketServer.io.emit("noteOff", message);
    });
    midiListener.onControlChange.push(message => {
        console.log(`[${message.channel}] controlChange: ${message.controller} (${message.value})`);
        WebsocketServer.io.emit("controlChange", message);
    });
    midiListener.onProgramChange.push(message => {
        console.log(`[${message.channel}] programChange: ${message.program}`);
        WebsocketServer.io.emit("programChange", message);
    });
};

dotenv.config();
main();
