import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'

import './App.css';

import io from 'socket.io-client'
const socket = io.connect("http://localhost:5000")

function App() {
  let { roomName } = useParams();
  useEffect(() => {
    socket.emit("joinRoom", roomName)
  }, [roomName]);

  const [ url, setUrl] = useState("https://www.youtube.com/watch?v=UA3gCPh3PEQ&ab_channel=BoyWithUke");
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
  };
  
  const handlePlay = () => {
    setPlaying(true);
    socket.emit("play");
  };

  /*const onUrlChange = (v) => { 

  }*/

  const onUrlSubmit = (v) => {
    const newUrl = v.target.value;
    socket.emit("sendUrl", {newUrl});
  }
  

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
      console.log("+" + data.newUrl);
      setUrl(data.newUrl);
    }
  
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("changeProgress", handleChangeProgress);
    socket.on("changeVideo", handleChangeVideo);
  
    return () => {
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("changeProgress", handleChangeProgress);
      socket.off("changeVideo", handleChangeVideo);
    };
  }, [isPlaying, progress, url]);
  
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
        <input onChange={onUrlSubmit} type='text' placeholder='url to the youtube video'/>
      </div>
    </div>
  );
}

export default App;
