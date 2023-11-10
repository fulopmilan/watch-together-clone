const progressChange = (socket, io, roomName) => {
    socket.on("progressChange", (data) => {
        if(socket.isHost)
            io.to(roomName).emit("changeProgress", data);
    });
}
module.exports = progressChange;