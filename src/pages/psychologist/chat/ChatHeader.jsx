import React from 'react';

const ChatHeader = ({ 
  contact, 
  consultation, 
  onBack, 
  onShowInfo, 
  onEndConsultation,
  onSearch 
}) => {
  // Header untuk list konsultasi (ketika belum ada contact yang dipilih)
  if (!contact) {
    return (
      <div className="p-4 border-b border-[#1e4d4d]/10 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#163737]">Konsultasi</h2>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a3c3c]/5 transition-colors">
            <i className="fa-solid fa-bell text-gray-700"></i>
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="fa-solid fa-search text-gray-400 text-sm"></i>
          </div>
          <input
            type="text"
            placeholder="Cari pasien..."
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg border-none text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d4d]/20 transition-all"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Header untuk chat aktif dengan pasien
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

          {/* Patient avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-[#1e4d4d] text-white flex items-center justify-center font-semibold text-sm">
              {contact.avatar ? (
                <img 
                  src={contact.avatar} 
                  alt={contact.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                (contact.name || "User").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              )}
            </div>
            {contact.status === 'online' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          {/* Patient info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#163737] text-sm truncate">
              {contact.name}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600 truncate">
                {contact.email || 'Pasien'}
              </p>
              {contact.status === 'online' && (
                <span className="text-xs text-green-600">• Online</span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Consultation status badge */}
          {consultation?.status && (
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium hidden sm:inline-block
              ${consultation.status === 'active' ? 'bg-green-100 text-green-700' : ''}
              ${consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${consultation.status === 'ended' ? 'bg-gray-100 text-gray-700' : ''}
            `}>
              {consultation.status === 'active' && 'Aktif'}
              {consultation.status === 'pending' && 'Menunggu'}
              {consultation.status === 'ended' && 'Selesai'}
            </span>
          )}

          {/* Info button */}
          <button
            onClick={onShowInfo}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a3c3c]/5 transition-colors"
            title="Info Pasien"
          >
            <i className="fa-solid fa-circle-info text-gray-700"></i>
          </button>

          {/* End consultation button */}
          {consultation?.status === 'active' && onEndConsultation && (
            <button
              onClick={onEndConsultation}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              title="Akhiri Konsultasi"
            >
              <span className="hidden sm:inline">Akhiri</span>
              <i className="fa-solid fa-stop sm:hidden"></i>
            </button>
          )}
        </div>
      </div>

      {/* Consultation timer/duration (optional) */}
      {consultation?.status === 'active' && consultation?.started_at && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <i className="fa-solid fa-clock"></i>
            <span>
              Sesi dimulai {new Date(consultation.started_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;