import React, { useState, useRef } from 'react';

const SendForm = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!message.trim() && !attachment) || disabled) return;

    onSendMessage(message, attachment);
    setMessage('');
    setAttachment(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 10MB.');
      return;
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Tipe file tidak diizinkan.');
      return;
    }

    setAttachment(file);
  };

  return (
    <div className="border-t border-[#1e4d4d]/10 bg-white p-6">
      {/* Attachment Preview */}
      {attachment && (
        <div className="mb-4 flex items-center justify-between bg-[#1e4d4d]/5 rounded-xl p-3">
          <div className="flex items-center space-x-3">
            <i className="fa-regular fa-file text-[#1e4d4d]"></i>
            <span className="text-sm font-medium text-[#163737]">
              {attachment.name}
            </span>
          </div>
          <button 
            onClick={() => setAttachment(null)}
            className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-2 bg-white">
  
        {/* 1. ATTACHMENT BUTTON */}
        <label className={`flex-none w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
          disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'text-[#1e4d4d] hover:bg-[#1e4d4d]/10'
        }`}>
          <i className="fa-solid fa-paperclip text-xl"></i>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
            disabled={disabled}
          />
        </label>

        {/* 2. MESSAGE INPUT */}
        <div className="flex-1 bg-gray-100 rounded-3xl flex items-center px-4 py-2 focus-within:ring-1 focus-within:ring-[#1e4d4d] focus-within:bg-white transition-colors border border-transparent focus-within:border-[#1e4d4d]/30">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={disabled ? "Sesi berakhir" : "Ketik pesan..."}
            disabled={disabled}
            rows="1"
            className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm text-gray-800 placeholder-gray-500 py-1 max-h-32"
            style={{ minHeight: '24px' }}
          />
        </div>

        {/* 3. SEND BUTTON */}
        <button 
          type="submit"
          disabled={(!message.trim() && !attachment) || disabled}
          className={`flex-none w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            (!message.trim() && !attachment) || disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#1e4d4d] text-white hover:bg-[#163737] hover:scale-105'
          }`}
        >
          <i className="fa-solid fa-paper-plane text-sm ml-0.5"></i>
        </button>
      </form>
    </div>
  );
};

export default SendForm;