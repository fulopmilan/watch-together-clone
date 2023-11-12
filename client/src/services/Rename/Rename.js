import './Rename.css'
export default function Rename({userName, onUserNameChange, onUserNameSubmit}) {
    return (
        <>
            <input id='rename-input-text' value={userName} onChange={onUserNameChange} type='text' placeholder='set username'></input>
            <button id='rename-input-submit' onClick={onUserNameSubmit}>Submit</button>
        </>
    )
}