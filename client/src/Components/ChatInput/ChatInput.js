import React from 'react';
import '../ChatInput/ChatInput.css';

function ChatInput({message, setMessage}) {
    return(
    <form className="formInput">
        <input
            className="chatInput" 
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)} 
        />
        <button type="submit" className="sendButton">Send</button>
    </form>
    )
    
}

export default ChatInput;