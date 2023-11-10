const pause = (socket, io, roomName) => {
    socket.on("pause", () => {
        if(socket.isHost)
            io.to(roomName).emit("pause");
    });
}
module.exports = pause;