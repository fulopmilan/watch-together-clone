const setHost = (socket, io) => {
    socket.on("setHost", (data) => {
        socket.isHost = false;
        io.to(data).emit("setHost", true);
    })
}

module.exports = setHost;