import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import Message from './Message/Message.js'

import './App.css';
import { socket } from '../../socket.js'

function App() {
  //Initialize
  let { roomName } = useParams();
  useEffect(() => {
    socket.emit("joinRoom", roomName)
  }, [roomName]);

  ////////////////////////////////
  //storing every user in the room
  const [ userList, setUserList] = useState([]);
  //storing client side username that isn't sent yet
  const [ userName, setUserName] = useState("");

  //storing every message in the room
  const [ chatAllMessages, setChatAllMessages] = useState([]);
  //storing client side message that aren't sent yet
  const [ chatMessage, setChatMessage] = useState("");

  //video settings
  const [ url, setUrl] = useState("https://www.youtube.com/watch?v=UA3gCPh3PEQ&ab_channel=BoyWithUke");
  const [ isPlaying, setPlaying ] = useState(false);
  const [ progress, setProgress ] = useState(0)
  const player = useRef(null);
  ////////////////////////////////

  ////////////////////////////////
  //client side functions
  const onChatMessageChange = (v) => { 
    setChatMessage(v.target.value);
  }

  const onUserNameChange = (v) => { 
    setUserName(v.target.value);
  }
  ////////////////////////////////

  ////////////////////////////////
  //sending data to server
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

  //submit chat message
  const onChatMessageSubmit = () => { 
    if(chatMessage !== "")
      socket.emit("sendChatMessage", { message: chatMessage})
    setChatMessage("");
  }

  const onUserNameSubmit = () => { 
    console.log(userName);
    socket.emit("sendUsername", { username: userName})
  }

  ////////////////////////////////

  ////////////////////////////////
  //receiving data from server
  useEffect(() => {
    const handlePlay = () => {
      setPlaying(true);
    };
  
    const handlePause = () => {
      setPlaying(false);
    };
  
    const handleChangeProgress = (data) => {
      const host_progress = data.progress;
      
      if (!(host_progress - 3 < progress && progress < host_progress + 3) && isPlaying) {
        player.current.seekTo(host_progress);
      }
    };

    const handleChangeVideo = (data) => {
      setUrl(data.message);
    }

    const handleChatMessage = (data) => {
      console.log(data);
      const message = data.username + " : " +data.message;
      setChatAllMessages(oldChatAllMessages => [...oldChatAllMessages, message]);
    }

    const handleUpdateUserList = (data) => {
      setUserList(data);
    }
  
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("changeProgress", handleChangeProgress);
    socket.on("changeVideo", handleChangeVideo);
    socket.on("sendChatMessage", handleChatMessage);
    socket.on("updateUserList", handleUpdateUserList);
  
    return () => {
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("changeProgress", handleChangeProgress);
      socket.off("changeVideo", handleChangeVideo);
      socket.off("sendChatMessage", handleChatMessage);
      socket.off("updateUserList", handleUpdateUserList);
    };
  }, [isPlaying, progress, url, chatAllMessages, userList]);
  ////////////////////////////////

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
      <div>
        <input value={chatMessage} onChange={onChatMessageChange} type='text' placeholder='send message to the chat here'/>
        <button onClick={onChatMessageSubmit}>Submit</button>
      </div>

      {/* chatlist */}
      <div>
        {chatAllMessages.map((chatMessage, index) => (
          <Message key={index} message={chatMessage} />
        ))}
      </div>

      {/* rename */}
      <div>
        <input value={userName} onChange={onUserNameChange} type='text' placeholder='set username'></input>
        <button onClick={onUserNameSubmit}>Submit</button>
      </div>

      {/* userlist */}
      <div>
        {userList.map((user, index) => (
          <p key={index}>{user.username}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
