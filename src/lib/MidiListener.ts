const easyMidi = require("easymidi");

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

class MidiListener {

    public input: any;

    constructor(
        inputName: string, 
        onNoteOn: (message: NoteMessage) => void,
        onNoteOff: (message: NoteMessage) => void,
        onControlChange: (message: ControlMessage) => void,
    ) {
        this.input = new easyMidi.Input(inputName);
        this.input.on("noteon", (message: NoteMessage) => {
            onNoteOn(message);
        });
        this.input.on("noteoff", (message: NoteMessage) => {
            onNoteOff(message);
        });
        this.input.on("cc", (message: ControlMessage) => {
            onControlChange(message);
        });
    }

    public static getDevices() {
        return {
            inputs: easyMidi.getInputs(),
            outputs: easyMidi.getOutputs(),
        };
    }

    public close(): void {
        this.input.close();
    }
}

export default MidiListener;