const sendChatMessage = (socket,io, rooms, roomName,) => {
    socket.on("sendChatMessage", (data) => {
        const message = data.message;
        const username = rooms[roomName].find(user => user.id === socket.id).username;
        io.to(roomName).emit("sendChatMessage", {message, username});
    });
}
module.exports = sendChatMessage;