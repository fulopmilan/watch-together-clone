import { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import './App.css';

import io from 'socket.io-client'
const socket = io.connect("http://localhost:5000")

function App() {
  const [ playing, setPlaying ] = useState(true);
  const [ progress, setProgress ] = useState(0)

  const player = useRef(null);
  
  const handleProgressChange = (v) => {
    socket.emit("progress_change", { progress: v.playedSeconds})
    setProgress(v.playedSeconds);
  }
  const handlePause = () => {
    console.log("hapause");
    socket.emit("pause")
  }
  const handlePlay = () => {
    socket.emit("play")
  }

  useEffect(() => {
    socket.on("change_progress", (data) => {
      const other_progress = data.progress;

      console.log("nem mi:" + other_progress)

      if((other_progress - 3 < progress < other_progress + 3)){
        player.current.seekTo(other_progress)
        console.log("irgum burgum")
      }
    })
    socket.on("pause", () => {
      setPlaying(false);
    })
    socket.on("play", () => {
      setPlaying(true);
    })
  }, [])

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
        playing={playing} 
      />
    </div>
  );
}

export default App;
