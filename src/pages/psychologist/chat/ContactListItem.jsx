import React from 'react';

const ContactListItem = ({ user, isActive, unseenCount }) => {
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return '';
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Baru saja';
    if (diffMinutes < 60) return `${diffMinutes} mnt`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} jam`;
    return `${Math.floor(diffMinutes / 1440)} hr`;
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-2xl bg-cover bg-center shadow-sm bg-gray-100"
          style={{ backgroundImage: user.avatar ? `url(${user.avatar})` : 'none' }}
        >
          {!user.avatar && (
            <div className="w-full h-full bg-[#1e4d4d] rounded-2xl flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        {isActive && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-[#163737] truncate">
            {user.name}
          </h4>
          {user.last_message_time && (
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatLastSeen(user.last_message_time)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate flex-1">
             {/* Prioritaskan pesan terakhir, jika tidak ada tampilkan email/label */}
             {user.last_message 
                ? (user.last_message.length > 35 ? user.last_message.substring(0, 35) + '...' : user.last_message)
                : 'Pasien'}
          </p>
          
          {unseenCount > 0 && (
            <span className="bg-[#1e4d4d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] ml-2">
              {unseenCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactListItem;