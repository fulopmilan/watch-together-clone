const rooms = (socket, io, rooms, roomName) => {
    //check if the room exists
    if (rooms[roomName]) {
        //join the existing room
        socket.join(roomName);
        socket.isHost = false;

    } else {
        //create a new room
        rooms[roomName] = [];
        socket.join(roomName);
            
        //set the host server side
        socket.isHost = true;
      
        //set the host client side
        io.to(roomName).emit("setHost", true);
    }
      
    //set the id for the user client side
    io.to(socket.id).emit("setOwnID", socket.id);
      
    //console.log("User has connected to server: " + socket.id + " in room " + roomName);
      
    //add the user to the userlist with an unique name and update
    rooms[roomName].push({id: socket.id, username: socket.id});
    io.to(roomName).emit("updateUserList", rooms[roomName]);
}
module.exports = rooms;