import { useState } from "react"
import { useNavigate } from "react-router-dom";
import './JoinRoom.css'
export default function CreateRoom() {
    const navigate = useNavigate();

    const [ url, setUrl ] = useState();
    
    const onUrlChange = (v) => {
        setUrl(v.target.value);
    }
    const findUrl = () => {
        navigate(url);
    }
    
    return (
        <div id="join-room" style={{backgroundImage: "url(/images/background.png)"}}>
            <div id="content">
                <h1 id="index-title">Join a room</h1>
                <input id="join-room-textfield" onChange={onUrlChange} type="text" placeholder="Room ID here"/> 

                <br/>

                <button id="join-room-button" onClick={findUrl}>Find</button>
            </div>
            <div id="background-gradient"></div>
        </div>
    )
}