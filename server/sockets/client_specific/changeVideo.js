const changeVideo = (socket, io, roomName) => {
    socket.on("changeVideo", (data) => {
        io.to(roomName).emit("changeVideo", data.url);
    });
}

module.exports = changeVideo;