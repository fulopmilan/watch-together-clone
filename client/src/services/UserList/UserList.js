import User from '../../components/User/User';
export default function UserList({userList, isHost, clientID, handleSetHost, handleKickUser}) {
    return (
        <div>
            {userList.map((user, index) => (
            <User 
                index={index}
                user = {user}
                handleSetHost={handleSetHost}
                handleKickUser={handleKickUser}
                isHost={isHost}
                clientID={clientID}
            />
            ))}
        </div>
    )
}