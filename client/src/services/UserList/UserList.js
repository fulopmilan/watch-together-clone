export default function UserList({userList, isHost, clientID, handleSetHost, handleKickUser}) {
    return (
        <div>
            {userList.map((user, index) => (
            <div>
                <p key={index}>{user.username}</p>
                {(isHost && user.id !== clientID) && 
                <div>
                    <button onClick={() => {handleSetHost(user.id)}}>set host</button>
                    <button onClick={() => {handleKickUser(user.id)}}>kick</button>
                </div>
                }
            </div>
            ))}
        </div>
    )
}