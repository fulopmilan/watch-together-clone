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
        //im having issues with setting the correct origins so ill leave it as "*".
        //will be changed later because of security reasons
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
    }
});


const rooms = {};

io.on("connection", (socket) => {
  socketManager(io, socket, rooms);
});


server.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
})