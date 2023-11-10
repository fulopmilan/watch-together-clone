const changeUsername = (socket,io,rooms,roomName) => {
    socket.on("changeUsername", (data) => {
        //change username
        rooms[roomName].find(user => user.id === socket.id).username = data.username;
        //update user list
        io.to(roomName).emit("updateUserList", rooms[roomName]);
    });
}
module.exports = changeUsername;