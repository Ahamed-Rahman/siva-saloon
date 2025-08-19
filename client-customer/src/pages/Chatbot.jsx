// src/components/Chatbot.jsx
import React, { useState } from 'react';

import '../pages/chatbot.css';

import axios from 'axios';
import chatbotResponses from '../pages/chatbotData';  // ← your manual list
import '../styles/chatbot.css';

 const Chatbot = () => {
   const [chat, setChat] = useState([
     { sender: 'bot', text: 'Hi! How can I help you today?' }
   ]);
   const [userInput, setUserInput] = useState('');
   const [isOpen, setIsOpen] = useState(false);

  // when API is down or out of quota, fall back here
  const lookupManual = (text) => {
    const lower = text.toLowerCase();
    const match = chatbotResponses.find(entry =>
      entry.keywords.some(k => lower.includes(k))
    );
    return match
      ? match.response
      : "Sorry, I didn't understand that. Try asking about pricing or bookings.";
  };

   const handleSend = async () => {
     const text = userInput.trim();
     if (!text) return;
     const userMsg = { sender: 'user', text };
     setChat(c => [...c, userMsg]);
     setUserInput('');

     // build the messages array for the API
     const messages = chat
       .filter(m => m.sender === 'user' || m.sender === 'bot')
       .map(m => ({
         role: m.sender === 'bot' ? 'assistant' : 'user',
         content: m.text
       }))
       .concat({ role: 'user', content: text });

     try {
       const { data } = await axios.post('http://localhost:5000/api/chat', { messages });
      
      const botMsg = { sender: 'bot', text: data.reply.content };
       setChat(c => [...c, botMsg]);
     } catch (err) {
       console.warn('OpenAI failed:', err.message);
     setChat(c => [...c, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
      // fall back to manual keyword lookup
      const fallback = lookupManual(text);
      setChat(c => [...c, { sender: 'bot', text: fallback }]);
     }
   };

   return (
     <div className="chatbot-container">
       <button className="chatbot-icon" onClick={() => setIsOpen(o => !o)}>
         💬
       </button>
       {isOpen && (
         <div className="chatbot-window">
           <div className="chat-messages">
             {chat.map((m,i) => (
               <div key={i} className={`msg ${m.sender}`}>
                 {m.text}
               </div>
             ))}
           </div>
           <div className="chatbot-input">
             <input
               type="text"
               placeholder="Type here..."
               value={userInput}
               onChange={e => setUserInput(e.target.value)}
               onKeyDown={e => e.key==='Enter' && handleSend()}
             />
             <button onClick={handleSend}>Send</button>
           </div>
         </div>
       )}
     </div>
   );
 };

 export default Chatbot;
