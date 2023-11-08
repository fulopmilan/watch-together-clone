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

var host = "";
//CODE
io.on("connection", (socket) => {
    console.log("User has connected to server: " + socket.id)
    if(host === "")
        host = socket.id;
    
    if(socket.id === host) {
        socket.on("progress_change", (data) => {
            socket.broadcast.emit("change_progress", data);
        })
        socket.on("pause", () => {
            socket.broadcast.emit("pause");
        })
        socket.on("play", () => {
            socket.broadcast.emit("play");
        })
    }

    socket.on("disconnect", () => {
        if(socket.id === host) {
            host = "";
        }
    })
})

server.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
})