const disconnect = (socket, io, rooms, roomName) => {
    socket.on("disconnect", () => {
        //check if it's the host leaving the room
        if (socket.isHost && socket.room) {
          //delete the room
          delete rooms[socket.room];
          delete socket.room;
          delete socket.isHost;
        }
        //delete user from the userlist and update
        rooms[roomName] = rooms[roomName].filter(user => user.id !== socket.id);
        io.to(roomName).emit("updateUserList", rooms[roomName]);
      });
}
module.exports = disconnect;