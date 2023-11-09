import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import Message from '../Index/Message/Message.js'

import './App.css';
import { socket } from '../../socket.js'

function App() {
  //Initialize
  let { roomName } = useParams();
  useEffect(() => {
    socket.emit("joinRoom", roomName)
  }, [roomName]);

  ////////////////////////////////
  //storing every message
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

  //listen for changes in the client side input field
  const onChatMessageChange = (v) => { 
    setChatMessage(v.target.value);
  }

  //listen for the submission of the chat message
  const onChatMessageSubmit = () => { 
    socket.emit("sendChatMessage", { message: chatMessage})
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
      console.log(isPlaying);
      
      if (!(host_progress - 3 < progress && progress < host_progress + 3) && isPlaying) {
        player.current.seekTo(host_progress);
      }
    };

    const handleChangeVideo = (data) => {
      setUrl(data.message);
    }

    const handleChatMessage = (data) => {
      setChatAllMessages(oldChatAllMessages => [...oldChatAllMessages, data.message]);
    }
  
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("changeProgress", handleChangeProgress);
    socket.on("changeVideo", handleChangeVideo);
    socket.on("sendChatMessage", handleChatMessage);
  
    return () => {
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("changeProgress", handleChangeProgress);
      socket.off("changeVideo", handleChangeVideo);
      socket.off("sendChatMessage", handleChatMessage);
    };
  }, [isPlaying, progress, url, chatAllMessages]);
  ////////////////////////////////

  return (
    <div className="App">
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
      <div>
        <input onChange={onChatMessageChange} type='text' placeholder='send message to the chat here'/>
        <button onClick={onChatMessageSubmit}>Submit</button>
      </div>
      <div>
        {chatAllMessages.map((chatMessage, index) => (
          <Message key={index} message={chatMessage} />
        ))}
      </div>
    </div>
  );
}

export default App;
