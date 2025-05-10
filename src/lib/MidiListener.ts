import * as easyMidi from "easymidi";

export interface NoteMessage {
    channel: number;
    note: number;
    velocity: number;
    _type: "noteon" | "noteoff";
}

export interface ControlMessage {
    channel: number;
    controller: number;
    value: number;
    _type: "cc";
}

export interface ProgramChangeMessage {
    channel: number;
    program: number;
    _type: "programchange";
}

class MidiListener {
    public input: any;

    public inputDevices: string[] = [];
    public outputDevices: string[] = [];

    public onNoteOn: ((message: NoteMessage) => void)[] = [];
    public onNoteOff: ((message: NoteMessage) => void)[] = [];
    public onControlChange: ((message: ControlMessage) => void)[] = [];
    public onProgramChange: ((message: ProgramChangeMessage) => void)[] = [];

    constructor(inputName?: string) {
        this.getDevices();
        this.setInputDevice(inputName || this.inputDevices[0] || "");
    }

    public setInputDevice(inputName: string) {
        if (this.input) {
            this.input.removeAllListeners("noteon");
            this.input.removeAllListeners("noteoff");
            this.input.removeAllListeners("cc");
            this.input.removeAllListeners("programchange");
            this.input.close();
        }
        this.input = new easyMidi.Input(inputName);
        this.input.on("noteon", (message: NoteMessage) => {
            this.onNoteOn.forEach(handler => handler(message));
        });
        this.input.on("noteoff", (message: NoteMessage) => {
            this.onNoteOff.forEach(handler => handler(message));
        });
        this.input.on("cc", (message: ControlMessage) => {
            this.onControlChange.forEach(handler => handler(message));
        });
        this.input.on("programchange", (message: ProgramChangeMessage) => {
            this.onProgramChange.forEach(handler => handler(message));
        });
    }

    public getDevices() {
        const inputs = easyMidi.getInputs();
        const outputs = easyMidi.getOutputs();

        return {
            inputs: inputs,
            outputs: outputs,
        };
    }

    public close(): void {
        this.input?.close();
    }
}

export default MidiListener;
