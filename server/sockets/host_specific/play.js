const play = (socket, io, roomName) => {
    socket.on("play", () => {
        if(socket.isHost)
            io.to(roomName).emit("play");
    });
}
module.exports = play;