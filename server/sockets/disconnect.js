const disconnect = (socket, io, rooms, roomName) => {
    socket.on("disconnect", () => {
        //delete user from the userlist and update
        rooms[roomName] = rooms[roomName].filter(user => user.id !== socket.id);
        io.to(roomName).emit("updateUserList", rooms[roomName]);

        //check if it's the host leaving the room
        if (socket.isHost) {
          //delete the room
          delete socket.room;
          delete socket.isHost;

          //set a new host if there are any remaining users, otherwise delete the room
          if(rooms[roomName].length > 0)
            io.to(rooms[roomName][0].id).emit("setHostOnDisconnect", rooms[roomName][0].id);
          else 
            delete rooms[roomName];
        }
      });
}
module.exports = disconnect;