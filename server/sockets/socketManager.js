//server-side specific
const kickUser = require('./host_specific/kickUser');
const setHost = require('./host_specific/setHost');
const setHostServerSide = require('./host_specific/setHostServerSide');
const pause = require('./host_specific/pause');
const play = require('./host_specific/play');
const progressChange = require('./host_specific/progressChange');

//client-side specific
const changeVideo = require('./client_specific/changeVideo');
const sendChatMessage = require('./client_specific/sendChatMessage');
const changeUsername = require('./client_specific/changeUsername');

//for handling room specific events
const roomsManager = require('./roomsManager');

//other
const disconnect = require('./disconnect');

const joinRoom = (io, socket, rooms) => {
    socket.on("joinRoom", (roomName) => {
        roomsManager(socket, io, rooms, roomName)

        ////////////////////////////////
        //host specific actions
        setHost(socket, io)
        setHostServerSide(socket, io);
        kickUser(socket, io, rooms,roomName);

        progressChange(socket, io, roomName);
        pause(socket, io, roomName);
        play(socket, io, roomName);
        ////////////////////////////////

        ////////////////////////////////
        //client specific actions
        changeVideo(socket, io, roomName)
        changeUsername(socket, io, rooms, roomName);
        sendChatMessage(socket, io, rooms, roomName)
        ////////////////////////////////

        disconnect(socket, io, rooms, roomName);
      });
}

module.exports = joinRoom;