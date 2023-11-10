const changeVideo = (socket, io, roomName) => {
    socket.on("changeVideo", (data) => {
        io.to(roomName).emit("changeVideo", data);
    });
}
module.exports = changeVideo;