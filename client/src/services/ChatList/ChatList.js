import Message from '../../components/Message/Message';
export default function ChatList({chatAllMessages}) {
    return (
        <div>
            {chatAllMessages.map((chatMessage, index) => (
                <Message key={index} message={chatMessage} />
            ))}
        </div>
    )
}