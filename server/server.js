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
    //check if the room exists
    if (rooms[roomName]) {
      //join the existing room
      socket.join(roomName);
      socket.isHost = false;
    } else {
      //create a new room
      rooms[roomName] = [];
      socket.join(roomName);
      
      //set the host server side
      socket.isHost = true;

      //set the host client side
      io.to(roomName).emit("setHost", true);
    }

    //set the id for the user client side
    io.to(socket.id).emit("setOwnID", socket.id);

    //console.log("User has connected to server: " + socket.id + " in room " + roomName);

    //add the user to the userlist with an unique name and update
    rooms[roomName].push({id: socket.id, username: socket.id});
    io.to(roomName).emit("updateUserList", rooms[roomName]);
    
    //host specific actions
    socket.on("setHost", (data) => {
        io.to(data).emit("setHost", true);
    })
    socket.on("kickUser", (data) => {
        io.to(data).emit("kickUser");

        //delete from room
        rooms[roomName] = rooms[roomName].filter(user => user.id !== data);
        //update userlist
        io.to(roomName).emit("updateUserList", rooms[roomName]);
    })

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

    //client specific actions
    socket.on("changeVideo", (data) => {
        io.to(roomName).emit("changeVideo", data);
    });
    socket.on("sendChatMessage", (data) => {
        const message = data.message;
        const username = rooms[roomName].find(user => user.id === socket.id).username;
        io.to(roomName).emit("sendChatMessage", {message, username});
    });
    socket.on("sendUsername", (data) => {
        //change username
        rooms[roomName].find(user => user.id === socket.id).username = data.username;
        //update user list
        io.to(roomName).emit("updateUserList", rooms[roomName]);
    });


    socket.on("disconnect", () => {
        //check if it's the host leaving the room
        if (socket.isHost && socket.room) {
          //delete the room
          delete rooms[socket.room];
          delete socket.room;
          delete socket.isHost;
        }
        //delete user from the userlist and update
        rooms[roomName] = rooms[roomName].filter(user => user.id !== socket.id);
        io.to(roomName).emit("updateUserList", rooms[roomName]);
      });
  });
});


server.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
})