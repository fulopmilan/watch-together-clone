import React from 'react';
import './User.css'
//react.memo for preventing unnecessary re-renders
const User = React.memo(({index, user, handleSetHost, handleKickUser, isHost, clientID}) => {
    return (
        <div className='user'>
            <p key={index}>{user.username}</p>
            {(isHost && user.id !== clientID) && 
            <div className='user-buttons'>
                <button onClick={() => {handleSetHost(user.id)}}>set host</button>
                <button onClick={() => {handleKickUser(user.id)}}>kick</button>
            </div>
            }
        </div>
    )
});

export default User;