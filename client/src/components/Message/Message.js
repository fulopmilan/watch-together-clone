import { socket } from '../../socket.js'
export default function Chat({message}) {

    //URL validation
    const isUrl = () => {
        try {
          new URL(message);
          return true;
        } catch (err) {
          return false;
        }
    }

    const onUrlSubmit = () => {
        socket.emit("changeVideo", {message});
    }
    
    return (
        <div>
            <p>{message}</p>
            {isUrl() ? <button onClick={onUrlSubmit}>Play</button> : <></>}
        </div>
    )
}