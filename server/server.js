const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');

const server = http.createServer(app);

//DOTENV
require('dotenv').config();

//CORS
const cors = require('cors');
app.use(cors());

//SERVER & CORS support
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomName) => {
    // Check if the room exists
    if (rooms[roomName]) {
      // Join the existing room
      socket.join(roomName);
      socket.isHost = false;
    } else {
      // Create a new room
      rooms[roomName] = true;
      socket.join(roomName);
      socket.isHost = true;
    }

    console.log("User has connected to server: " + socket.id + " in room " + roomName);

    //host specific actions
    if (socket.isHost) {
      socket.on("progressChange", (data) => {
        io.to(roomName).emit("changeProgress", data);
      });

      socket.on("pause", () => {
        io.to(roomName).emit("pause");
      });

      socket.on("play", () => {
        io.to(roomName).emit("play");
      });
    }

    //client actions
    socket.on("changeVideo", (data) => {
        io.to(roomName).emit("changeVideo", data);
    });
    socket.on("sendChatMessage", (data) => {
        io.to(roomName).emit("sendChatMessage", data);
    });
  });


  socket.on("disconnect", () => {
    // Check if it's the host leaving the room
    if (socket.isHost && socket.room) {
      // Delete the room
      delete rooms[socket.room];
      delete socket.room;
      delete socket.isHost;
    }
  });
});


server.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
})