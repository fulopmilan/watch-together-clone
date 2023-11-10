export default function ChatInput({chatMessage, onChatMessageChange, onChatMessageSubmit}) {
    return (
        <div>
            <input value={chatMessage} onChange={onChatMessageChange} type='text' placeholder='send message to the chat here'/>
            <button onClick={onChatMessageSubmit}>Submit</button>
        </div>
    )
}