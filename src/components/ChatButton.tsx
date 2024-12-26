import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, SendHorizontal} from 'lucide-react';
import axios from 'axios';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; isLoading?: boolean }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePresetMessage = (preset: string) => {
    setMessage(preset);
    handleSubmit(preset);
  };

  const handleSubmit = async (text: string | React.FormEvent) => {
    if (typeof text !== 'string') {
      text.preventDefault();
      text = message;
    }
    
    if (!text.trim()) return;

    setMessage('');
    setMessages(prev => [...prev, { text: text as string, isUser: true }]);
    
    // Add loading message
    setMessages(prev => [...prev, { text: '', isUser: false, isLoading: true }]);
    //'https://flaskragbot-1e1040a057f8.herokuapp.com/api/query' 
    try {
      const response = await axios.post('https://flaskragbot-1e1040a057f8.herokuapp.com/api/query', { 
        query: text 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Remove loading message and add response
      setMessages(prev => [
        ...prev.filter(m => !m.isLoading), 
        { text: response.data.answer || "I'll get back to you soon!", isUser: false }
      ]);
    } catch (error) {
      console.error('API Error:', error);
      // Remove loading message and add error response
      setMessages(prev => [
        ...prev.filter(m => !m.isLoading), 
        { text: "I apologize, but I'm having trouble connecting right now. Please try again later.", isUser: false }
      ]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
  };

  const presetMessages = [
    "Tell me about your experience",
    "What are your key skills?",
    "How can we collaborate?",
    "Tell me about yourself"
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-8 right-8 px-6 py-3 rounded-full
            text-white shadow-xl transition-all duration-500 
            hover:scale-105 z-[100] flex items-center space-x-2 font-medium
            overflow-hidden animate-float"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.4))',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15), 0 4px 12px rgba(168, 85, 247, 0.2)',
          }}
        >
          <div className="absolute inset-0 opacity-50">
            <div
              className="absolute inset-0 animate-nebula"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
                filter: 'blur(20px)',
              }}
            />
          </div>
          
          <div className="relative flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 animate-bounce" style={{ animationDuration: '2s' }} />
            <span className="relative">
              Let's Chat
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 w-80 bg-gray-900/90 rounded-3xl shadow-2xl z-[100]
          border border-gray-700/90 overflow-hidden backdrop-blur-sm"
          style={{
            boxShadow: '0 0 30px rgba(0,0,0,0.3), 0 0 20px rgba(168,85,247,0.3)',
          }}>
        

          
          {/*<div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://static.thenounproject.com/png/6953280-512.png"
                alt="Bot"
                className="w-8 h-8 rounded-lg"
              />
              <h2 className="text-white font-bold">Ask Sanju !</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>*/}

          <div className="p-2 bg-gradient-to-r from-purple-500/70 to-blue-500/70 flex items-center justify-between rounded-t-3xl">
            <div className="flex items-center space-x-2">
              <img
                src="https://static.thenounproject.com/png/6953280-512.png"
                alt="Bot"
                className="w-6 h-6 rounded-lg"
              />
              <h2 className="text-black font-bold text-xl">Ask Sanju !</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-black/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-br-md rounded-bl-md rounded-tl-md rounded-tr-2xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/*<div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">Hello! How can I help you today?</p>
                <div className="grid grid-cols-1 gap-2">
                  {presetMessages.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetMessage(preset)}
                      className="flex items-center justify-between px-4 py-2 text-left text-sm text-gray-300
                        bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors duration-200
                        border border-gray-700/50 group"
                    >
                      <span>{preset}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}*/}

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">Hello! How can I help you today?</p>
                <div className="grid grid-cols-2 gap-2">
                  {presetMessages.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetMessage(preset)}
                      
                      className="relative flex items-center justify-between px-3 py-2 text-left text-xs text-gray-300
                        bg-gray-800/50 rounded-2xl hover:bg-gray-700/50 transition-colors duration-200
                        border border-gray-700/50 group overflow-hidden"
                    >{/*added overflow-hidden and relative to this class to contain the mirroe effect */}
                      <span>{preset}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {/* Mirror Effect */}
                      <div className="absolute inset-0 flex justify-center overflow-hidden rounded-2xl pointer-events-none">
                      <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                      transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}


            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isUser && !msg.isLoading && (
                  <img
                    src="/favicon.png"
                    alt="Sanju"
                    className="w-8 h-8 rounded-lg mr-2 self-end"
                  />
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.isUser
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-none'
                      : msg.isLoading
                      ? 'bg-gray-800/90 text-gray-200 rounded-bl-none'
                      : 'bg-gray-800/90 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-2 border-t-2 bg-gray-800/50 border-gray-800">
            <div className="flex space-x-1.5">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Sanju ..."
                className="flex-1 bg-gray-800/50 text-gray-200 rounded-tr-md rounded-br-md rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700/50"
                //className="flex-1 bg-gray-800/90 text-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700/50"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-tl-md rounded-bl-md rounded-2xl bg-gradient-to-r from-purple-500/70 to-blue-500/70 text-white
                  hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              
                //className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white
                  //hover:shadow-lg transition-all duration-300"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatButton;