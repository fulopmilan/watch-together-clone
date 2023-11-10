import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
import Message from './Message/Message.js'

import './App.css';
import { socket } from '../../socket.js'

function App() {

  //navigation
  const navigate = useNavigate();

  //Initialize
  let { roomName } = useParams();
  useEffect(() => {
    socket.emit("joinRoom", roomName)
  }, [roomName]);

  ////////////////////////////////
  //store if the client is the host
  const [ isHost, setIsHost ] = useState(false);
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

  //host only data sending
  const handleSetHost = (id) => {
    socket.emit("setHost", id);
    setIsHost(false);
  };

  const handleKickUser = (id) => {
    socket.emit("kickUser", id);
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

    const handleSetHost = (data) => {
      setIsHost(data);
    }

    const handleKickUser = () => {
      navigate('/');
    }
  
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("changeProgress", handleChangeProgress);
    socket.on("changeVideo", handleChangeVideo);
    socket.on("sendChatMessage", handleChatMessage);
    socket.on("updateUserList", handleUpdateUserList);
    socket.on("setHost", handleSetHost);
    socket.on("kickUser", handleKickUser);
  
    return () => {
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("changeProgress", handleChangeProgress);
      socket.off("changeVideo", handleChangeVideo);
      socket.off("sendChatMessage", handleChatMessage);
      socket.off("updateUserList", handleUpdateUserList);
      socket.off("setHost", handleSetHost);
      socket.off("kickUser", handleKickUser);
    };
  }, [isPlaying, progress, url, chatAllMessages, userList, isHost]);
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
          <div>
            <p key={index}>{user.username}</p>
            {isHost && 
              <div>
                <button onClick={() => {handleSetHost(user.id)}}>set host</button>
                <button onClick={() => {handleKickUser(user.id)}}>kick</button>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
