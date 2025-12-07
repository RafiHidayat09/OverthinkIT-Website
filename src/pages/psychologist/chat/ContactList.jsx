import React from 'react';

const ContactList = ({ contacts, currentContact, onContactSelect }) => {
  // Filter favorit (misal pasien yang dipin) atau tampilkan semua
  const favorites = contacts.filter(c => c.is_favorite);
  const allContacts = contacts;

  const getInitials = (name) => {
    return (name || "") 
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = (contact) => (
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-[#1e4d4d] text-white flex items-center justify-center font-semibold text-sm">
        {contact.avatar ? (
          <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(contact.name)
        )}
      </div>
      {contact.status === 'online' && (
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
      )}
      {contact.unseen_count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-semibold">
          {contact.unseen_count}
        </span>
      )}
    </div>
  );

  const renderFavoriteCard = (contact) => (
    <div
      key={contact.id}
      className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => onContactSelect(contact)}
    >
      {renderAvatar(contact)}
      <span className="text-xs text-gray-700 mt-2 text-center truncate w-full px-1">
        {contact.name.split(' ')[0]}
      </span>
    </div>
  );

  const renderContactItem = (contact) => (
    <div
      key={contact.id}
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#1a3c3c]/5 transition-colors rounded-lg ${
        currentContact?.id === contact.id ? 'bg-[#1a3c3c]/10' : ''
      }`}
      onClick={() => onContactSelect(contact)}
    >
      {renderAvatar(contact)}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-[#163737] text-sm truncate">
            {contact.name}
          </h4>
          {contact.is_favorite && (
            <i className="fa-solid fa-star text-yellow-500 text-xs ml-2 flex-shrink-0"></i>
          )}
        </div>
        
        {/* Perubahan: Menghapus Specialization & Rating */}
        <p className="text-xs text-gray-600 truncate">
          {/* Tampilkan pesan terakhir atau email pasien */}
          {contact.last_message 
            ? (contact.last_message.length > 30 ? contact.last_message.substring(0, 30) + '...' : contact.last_message)
            : (contact.email || 'Pasien')}
        </p>
        
        {/* Timestamp pesan terakhir (jika ada) */}
        {contact.last_message_time && (
           <span className="text-[10px] text-gray-400 mt-1 block">
             {new Date(contact.last_message_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
           </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Favorites Section (Pasien Prioritas) */}
      {favorites.length > 0 && (
        <div className="px-4 py-4 border-b border-[#1e4d4d]/10">
          <h3 className="text-sm font-semibold text-[#163737] mb-3">Prioritas</h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {favorites.map(renderFavoriteCard)}
          </div>
        </div>
      )}

      {/* All Contacts Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-[#163737] mb-2">
            Daftar Pasien ({allContacts.length})
          </h3>
        </div>
        
        <div className="px-2 space-y-1">
          {allContacts.map(renderContactItem)}
        </div>
      </div>
    </div>
  );
};

export default ContactList;