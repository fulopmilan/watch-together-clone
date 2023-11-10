const kickUser = (socket, io, rooms, roomName) => {
    socket.on("kickUser", (data) => {
        io.to(data).emit("kickUser");

        //delete from room
        rooms[roomName] = rooms[roomName].filter(user => user.id !== data);
        //update userlist
        io.to(roomName).emit("updateUserList", rooms[roomName]);
    })
}

module.exports = kickUser;