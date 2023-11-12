import './ChatInput.css'
export default function ChatInput({chatMessage, onChatMessageChange, onChatMessageSubmit}) {
    return (
        <>
            <input id="chat-input-text" value={chatMessage} onChange={onChatMessageChange} type='text' placeholder='send message to the chat here'/>
            <button id="chat-input-submit" onClick={onChatMessageSubmit}>Submit</button>
        </>
    )
}