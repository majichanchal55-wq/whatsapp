const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  // When someone joins with a name
  socket.on('join', (username) => {
    socket.username = username;
    socket.broadcast.emit('message', {
      user: 'System',
      text: `${username} joined the chat`
    });
  });

  // When someone sends a message
  socket.on('chat message', (msg) => {
    io.emit('message', {
      user: socket.username || 'Anonymous',
      text: msg
    });
  });

  // When someone leaves
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('message', {
        user: 'System',
        text: `${socket.username} left the chat`
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});