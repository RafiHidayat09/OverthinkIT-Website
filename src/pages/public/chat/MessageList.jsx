import React, { useEffect, useRef } from 'react';
import MessageCard from './MessageCard';

const MessageList = ({ messages, typing, currentUser, onDeleteMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 && !typing ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#1e4d4d]/10 text-[#1e4d4d] rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <i className="fa-regular fa-comment-dots text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-[#163737] mb-2">
              Mulai Percakapan
            </h3>
            <p className="text-gray-600">
              Kirim pesan pertama untuk memulai konsultasi Anda
            </p>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <MessageCard
                key={message.id}
                message={message}
                isSender={message.sender_id === currentUser?.id}
                onDelete={onDeleteMessage}
              />
            ))}
            
            {typing && (
              <div className="flex items-center space-x-2 bg-white rounded-2xl p-4 shadow-sm border border-[#1e4d4d]/10 w-fit">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#1e4d4d] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#1e4d4d] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#1e4d4d] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Mengetik...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;