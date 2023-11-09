import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'

import './App.css';

import io from 'socket.io-client'
const socket = io.connect("http://localhost:5000")

function App() {
  let { roomName } = useParams();
  useEffect(() => {
    console.log(roomName);
    socket.emit("joinRoom", roomName)
  }, [roomName]);

  const [ isPlaying, setPlaying ] = useState(false);
  const [ progress, setProgress ] = useState(0)

  const player = useRef(null);

  ////////////////////////////////
  //sending data to server
  const handleProgressChange = (v) => {
    socket.emit("progressChange", { progress: v.playedSeconds})
    setProgress(v.playedSeconds);
  }
  const handlePause = () => {
    setPlaying(false);
    socket.emit("pause");
    console.log("false meg lett hivva")
  };
  
  const handlePlay = () => {
    setPlaying(true);
    socket.emit("play");
    console.log("true meg lett hivva")
  };
  

  ////////////////////////////////
  //receiving data from server
  useEffect(() => {
    const handlePlay = () => {
      console.log("true meg lett hivva");
      setPlaying(true);
    };
  
    const handlePause = () => {
      console.log("false meg lett hivva");
      setPlaying(false);
    };
  
    const handleChangeProgress = (data) => {
      const host_progress = data.progress;
      console.log(isPlaying);
      
      if (!(host_progress - 3 < progress && progress < host_progress + 3) && isPlaying) {
        console.log("anyad");
        player.current.seekTo(host_progress);
      }
    };
  
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("changeProgress", handleChangeProgress);
  
    return () => {
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("changeProgress", handleChangeProgress);
    };
  }, [isPlaying, progress]);
  
  return (
    <div className="App">
      <ReactPlayer url='https://www.youtube.com/watch?v=VBoRLJimVzc' 
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
    </div>
  );
}

export default App;
