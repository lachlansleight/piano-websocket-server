# Piano Websocket Server

Just a basic websocket server that listens for MIDI messages on a specific device and broadcasts them to all connected clients on a socket.io server.

## Message Types

The server broadcasts the following MIDI message types:

### 1. Note On
Event: `noteOn`
```typescript
{
    channel: number;    // MIDI channel number
    note: number;       // MIDI note number
    velocity: number;   // Note velocity (0-127)
    _type: "noteon"    // Message type identifier
}
```

### 2. Note Off
Event: `noteOff`
```typescript
{
    channel: number;    // MIDI channel number
    note: number;       // MIDI note number
    velocity: number;   // Note release velocity (0-127)
    _type: "noteoff"   // Message type identifier
}
```

### 3. Control Change
Event: `controlChange`
```typescript
{
    channel: number;     // MIDI channel number
    controller: number;  // Controller number
    value: number;      // Controller value (0-127)
    _type: "cc"        // Message type identifier
}
```

### 4. Program Change
Event: `programChange`
```typescript
{
    channel: number;    // MIDI channel number
    program: number;    // Program number
    _type: "programchange" // Message type identifier
}
```

## Usage

The server will automatically connect to the first available MIDI device, or you can specify a device name using the `MIDI_DEVICE` environment variable. All MIDI messages from the connected device will be broadcast to all connected websocket clients.

Each message type is emitted as a separate event that clients can listen for using the socket.io client library.

Note that for now, this server should be run with the command `npm run nodemon`
