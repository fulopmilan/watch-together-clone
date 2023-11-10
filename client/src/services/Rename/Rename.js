export default function Rename({userName, onUserNameChange, onUserNameSubmit}) {
    return (
        <div>
            <input value={userName} onChange={onUserNameChange} type='text' placeholder='set username'></input>
            <button onClick={onUserNameSubmit}>Submit</button>
        </div>
    )
}