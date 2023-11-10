import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'

import { socket } from './socket.js'

import ChatInput from './services/ChatInput/ChatInput.js';
import ChatList from './services/ChatList/ChatList.js';
import Rename from './services/Rename/Rename.js';
import UserList from './services/UserList/UserList.js';

function App() {

  //navigation
  const navigate = useNavigate();

  //initialize
  let { roomName } = useParams();
  useEffect(() => {
    socket.emit("joinRoom", roomName)
  }, [roomName]);

  //#region variables

  //the amount of delay (in seconds) before the user gets their video progress corrected
  const maxBuffer = 3;

  /*
   * stores the client's id
   * used in UserList.js, for checking if the socket is the current user.
   * set by server side only
   */
  const [ clientID, setClientID ] = useState("");

  /*
   * stores if the client is the host
   * used for checking if this socket is the host in UserList.js
   * set by server side only
   */
  const [ isHost, setIsHost ] = useState(false);

  /*
   * stores every user in the room
   * used for listing users
   * changed by server side only
   */
  const [ userList, setUserList] = useState([]);

  /*
   * stores username from text input
   * set by client side only
   */
  const [ userName, setUserName] = useState("");

  /*
   * stores every message in the room
   * used for displaying messages in ChatList.js
   * set by server side only
   */
  const [ chatAllMessages, setChatAllMessages] = useState([]);
  
  /*
   * stores message from text input
   * set by client side only
   */
  const [ chatMessage, setChatMessage] = useState("");

  //video settings
  const [ url, setUrl] = useState("https://www.youtube.com/watch?v=UA3gCPh3PEQ&ab_channel=BoyWithUke");
  const [ isPlaying, setPlaying ] = useState(false);
  const [ progress, setProgress ] = useState(0)
  
  const player = useRef(null);

  //#endregion

  //#region client side functions
  const onChatMessageChange = (v) => { 
    setChatMessage(v.target.value);
  }

  const onUserNameChange = (v) => { 
    setUserName(v.target.value);
  }
  //#endregion

  //#region sending data to server
  const handleProgressChange = (v) => {
    socket.emit("progressChange", { progress: v.playedSeconds})
    setProgress(v.playedSeconds);
  }

  const handlePause = () => {
    setPlaying(false);
    socket.emit("pause");
  };
  
  const handlePlay = () => {
    setPlaying(true);
    socket.emit("play");
  };

  //sets the new host in both client-side and server-side
  const handleSetHost = (id) => {
    //server side
    socket.emit("setHost", id);
    //client side
    setIsHost(false);
  };

  const handleKickUser = (id) => {
    socket.emit("kickUser", id);
  };

  //submit chat message
  const onChatMessageSubmit = () => { 
    //message validation
    if(chatMessage !== "")
      socket.emit("sendChatMessage", { message: chatMessage})

    setChatMessage("");
  }

  //changing username
  const onUserNameSubmit = () => { 
    socket.emit("changeUsername", { username: userName})
  }

  //#endregion

  //#region receiving data from server
  useEffect(() => {
    const handlePlay = () => {
      setPlaying(true);
    };
  
    const handlePause = () => {
      setPlaying(false);
    };
  
    const handleChangeProgress = (data) => {
      const hostProgress = data.progress;

      //if the client's progress is ahead or before the server's progress by maxBuffer seconds, then correct the progress.
      if (!(hostProgress - maxBuffer < progress && progress < hostProgress + maxBuffer) && isPlaying) {
        player.current.seekTo(hostProgress);
      }
    };

    const handleChangeVideo = (data) => {
      setUrl(data.message);
    }

    const handleChatMessage = (data) => {
      const message = data.username + " : " +data.message;
      setChatAllMessages(oldChatAllMessages => [...oldChatAllMessages, message]);
    }

    const handleUpdateUserList = (data) => {
      setUserList(data);
    }

    const handleSetHost = (data) => {
      socket.emit('setHostServerSide');
      setIsHost(data);
    }

    const handleKickUser = () => {
      navigate('/');
    }

    const handleOwnIDSet = (data) => {
      setClientID(data);
    }
  
    //#region socket.on
      socket.on("play", handlePlay);
      socket.on("pause", handlePause);
      socket.on("changeProgress", handleChangeProgress);
      socket.on("changeVideo", handleChangeVideo);
      socket.on("sendChatMessage", handleChatMessage);
      socket.on("updateUserList", handleUpdateUserList);
      socket.on("setHost", handleSetHost);
      socket.on("kickUser", handleKickUser);
      socket.on("setOwnID", handleOwnIDSet);
    //#endregion
  
    return () => {
      //#region socket.off
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("changeProgress", handleChangeProgress);
      socket.off("changeVideo", handleChangeVideo);
      socket.off("sendChatMessage", handleChatMessage);
      socket.off("updateUserList", handleUpdateUserList);
      socket.off("setHost", handleSetHost);
      socket.off("kickUser", handleKickUser);
      socket.off("setOwnID", handleOwnIDSet);
      //#endregion
    };
  }, [isPlaying, progress, url, chatAllMessages, userList, isHost, navigate]);
  //#endregion

  return (
    <div className="App">
      {/* video player */}
      <ReactPlayer url={url} 
        //reference this player
        ref={player}

        //autostart the player
        muted 

        //enable youtube controls
        controls={true}
        
        //get data
        onProgress={handleProgressChange}
        onPause={handlePause}
        onPlay={handlePlay}

        //set data
        playing={isPlaying} 
      />

      {/* chat input */}
      <ChatInput 
        chatMessage={chatMessage} 
        onChatMessageChange={onChatMessageChange} 
        onChatMessageSubmit={onChatMessageSubmit}
      />

      {/* chatlist */}
      <ChatList
        chatAllMessages={chatAllMessages} 
      />

      {/* rename */}
      <Rename
        userName={userName} 
        onUserNameChange={onUserNameChange} 
        onUserNameSubmit={onUserNameSubmit}
      />

      {/* userlist */}
      <UserList
        userList={userList}
        isHost={isHost}
        clientID={clientID}
        handleSetHost={handleSetHost}
        handleKickUser={handleKickUser}
      />
    </div>
  );
}

export default App;
