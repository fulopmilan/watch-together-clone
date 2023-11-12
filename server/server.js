const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');

const server = http.createServer(app);
const socketManager = require('./sockets/socketManager');

//DOTENV
require('dotenv').config();

//CORS
const cors = require('cors');
app.use(cors());

const path = require("path");

app.use(express.static(path.join(__dirname, "build")));

//SERVER & CORS support
const io = new Server(server, {
    cors: {
        origin: "https://watch-together-clone-server.onrender.com/",
        methods: ["GET", "POST"]
    }
});

const rooms = {};

io.on("connection", (socket) => {
  socketManager(io, socket, rooms);
});


server.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
})