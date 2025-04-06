const express = require('express');
const { WebSocketServer } = require('ws');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/transfer/:roomId', (req, res) => {
  res.sendFile(__dirname + '/public/transfer.html');
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });
const rooms = {};

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    const { type, roomId, payload } = data;

    if (type === 'join') {
      if (!rooms[roomId]) {
        rooms[roomId] = { clients: [], password: null, expiry: null };
      }
      rooms[roomId].clients.push(ws);
      ws.roomId = roomId;

      if (rooms[roomId].clients.length === 2) {
        rooms[roomId].clients[0].send(JSON.stringify({ type: 'start' }));
      }
    }

    if (type === 'init') {
      if (!rooms[roomId]) {
        rooms[roomId] = { clients: [], password: null, expiry: null };
      }
      rooms[roomId].password = payload.password;
      rooms[roomId].expiry = Date.now() + payload.expiry * 1000;
    }

    if (type === 'verify') {
      const room = rooms[roomId];
      if (!room) {
        ws.send(JSON.stringify({ type: 'error', payload: 'Room does not exist' }));
        return;
      }

      if (Date.now() > room.expiry) {
        ws.send(JSON.stringify({ type: 'error', payload: 'Link expired' }));
        return;
      }

      if (payload.password !== room.password) {
        ws.send(JSON.stringify({ type: 'error', payload: 'Incorrect password' }));
        return;
      }

      ws.send(JSON.stringify({ type: 'verified' }));
    }

    if (type === 'file-info') {
      const peer = rooms[roomId]?.clients.find((client) => client !== ws);
      if (peer) peer.send(JSON.stringify({ type: 'file-info', payload }));
    }

    if (type === 'file-chunk') {
      const peer = rooms[roomId]?.clients.find((client) => client !== ws);
      if (peer) peer.send(JSON.stringify({ type: 'file-chunk', payload }));
    }

    if (type === 'done') {
      const peer = rooms[roomId]?.clients.find((client) => client !== ws);
      if (peer) peer.send(JSON.stringify({ type: 'done' }));
    }
  });

  ws.on('close', () => {
    const { roomId } = ws;
    if (roomId && rooms[roomId]) {
      rooms[roomId].clients = rooms[roomId].clients.filter((client) => client !== ws);
      if (rooms[roomId].clients.length === 0) delete rooms[roomId];
    }
  });
});
