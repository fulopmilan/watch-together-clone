import React from 'react';
import { socket } from '../../socket.js'
import './Message.css'

//react.memo for preventing unnecessary re-renders
const Message = React.memo(({message}) => {

    //URL validation
    const isUrl = () => {
        try {
          new URL(message.split(' : ')[1]);
          return true;
        } catch (err) {
          return false;
        }
    }

    const onUrlSubmit = () => {
        const url = message.split(' : ')[1];
        socket.emit("changeVideo", { url });
    }
    
    return (
        <div style={{ maxWidth: '260px' }}>
          <p className='message'>{message}</p>
          {isUrl() ? <button onClick={onUrlSubmit}>Play</button> : <></>}
        </div>
      )      
});

export default Message;