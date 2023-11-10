const setHostServerSide = (socket) => {
    socket.on("setHostServerSide", () => {
        socket.isHost = true;    
    });
}
module.exports = setHostServerSide;