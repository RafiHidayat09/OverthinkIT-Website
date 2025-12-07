import React from 'react';

const ChatHeader = ({ 
  contact, 
  consultation, 
  onBack, 
  onShowInfo, 
  onEndConsultation,
  onSearch 
}) => {
  if (!contact) {
    return (
      <div className="p-4 border-b border-[#1e4d4d]/10 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#163737]">Pesan</h2>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a3c3c]/5 transition-colors">
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="fa-solid fa-search text-gray-400 text-sm"></i>
          </div>
          <input
            type="text"
            placeholder="Cari psikiater..."
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg border-none text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d4d]/20 transition-all"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-[#1e4d4d]/10 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Back button for mobile */}
          <button
            onClick={onBack}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a3c3c]/5 transition-colors flex-shrink-0"
          >
            <i className="fa-solid fa-arrow-left text-gray-700"></i>
          </button>

          {/* Contact avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-[#1e4d4d] text-white flex items-center justify-center font-semibold text-sm">
              {contact.avatar ? (
                <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                (contact.name || "User").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              )}
            </div>
            {contact.status === 'online' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          {/* Contact info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#163737] text-sm truncate">
              {contact.name}
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {contact.specialization}
              {contact.status === 'online' && (
                <span className="ml-2 text-green-600">• Online</span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Info button */}
          <button
            onClick={onShowInfo}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a3c3c]/5 transition-colors"
          >
            <i className="fa-solid fa-circle-info text-gray-700"></i>
          </button>

          {/* End consultation */}
          {consultation?.status === 'active' && onEndConsultation && (
            <button
              onClick={onEndConsultation}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              Akhiri
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;