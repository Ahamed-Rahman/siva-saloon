import React, { useState } from 'react';
import chatbotResponses from './chatbotData';
import './chatbot.css';

const Chatbot = () => {
  const [chat, setChat] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (!userInput.trim()) return;

    const userMsg = { sender: 'user', text: userInput };
    const lower = userInput.toLowerCase();

    const match = chatbotResponses.find(entry =>
      entry.keywords.some(k => lower.includes(k))
    );

    const botMsg = {
      sender: 'bot',
      text: match ? match.response : "Sorry, I didn't understand that. Try asking about booking or prices."
    };

    setChat([...chat, userMsg, botMsg]);
    setUserInput('');
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-icon" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen && (
         <div className="chatbot-window">
          <div className="chat-messages">
            {chat.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
           <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
