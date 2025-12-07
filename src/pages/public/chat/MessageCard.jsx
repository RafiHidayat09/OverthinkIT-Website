import React, { useState, useMemo } from 'react';

const MessageCard = ({ message, isSender, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const attachment = useMemo(() => {
    const raw = message.attachment;
    if (!raw) return null;

    // Base URL penyimpanan file (sesuaikan dengan config backend Anda)
    const BASE_STORAGE_URL = "http://localhost:8000/storage/";

    // Helper untuk cek apakah string adalah URL lengkap
    const isFullUrl = (str) => str && (str.startsWith('http://') || str.startsWith('https://'));

    // Ambil path relatif atau URL dari berbagai kemungkinan field
    // Prioritas: url -> full (dari debug Anda) -> path -> file_url -> string raw
    let path = raw.url || raw.full || raw.path || raw.file_url || (typeof raw === 'string' ? raw : null);

    // Jika tidak ada path sama sekali, return null
    if (!path) return null;

    // Konstruksi Final URL
    const finalUrl = isFullUrl(path) ? path : `${BASE_STORAGE_URL}${path}`;

    // Tentukan Nama File
    const filename = raw.title || raw.name || raw.filename || (typeof path === 'string' ? path.split('/').pop() : 'file');

    // Tentukan Tipe File (Jika undefined, coba tebak dari ekstensi)
    let type = raw.type;
    if (!type || type === 'undefined') {
      const ext = filename.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) type = 'image';
      else if (['pdf'].includes(ext)) type = 'pdf';
      else if (['doc', 'docx'].includes(ext)) type = 'document';
      else type = 'file';
    }

    // Return objek attachment yang sudah "matang"
    return {
      ... (typeof raw === 'object' ? raw : {}), // Copy properti lain jika ada
      url: finalUrl,
      title: filename,
      type: type,
      original_path: path
    };
  }, [message.attachment]);
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (!type) return 'fa-file';
    
    switch(type.toLowerCase()) {
      case 'pdf': return 'fa-file-pdf';
      case 'image': return 'fa-file-image';
      case 'video': return 'fa-file-video';
      case 'audio': return 'fa-file-audio';
      case 'document': return 'fa-file-word';
      case 'spreadsheet': return 'fa-file-excel';
      case 'presentation': return 'fa-file-powerpoint';
      case 'archive': return 'fa-file-zipper';
      case 'text': return 'fa-file-alt';
      default: return 'fa-file';
    }
  };

  const getFileIconColor = (type) => {
    if (!type) return isSender ? 'text-white/80' : 'text-[#1e4d4d]';
    
    switch(type.toLowerCase()) {
      case 'pdf': return 'text-red-500';
      case 'image': return 'text-green-500';
      case 'video': return 'text-purple-600';
      case 'audio': return 'text-blue-600';
      case 'document': return 'text-blue-700';
      case 'spreadsheet': return 'text-green-600';
      case 'presentation': return 'text-orange-600';
      case 'archive': return 'text-yellow-600';
      default: return isSender ? 'text-white/80' : 'text-[#1e4d4d]';
    }
  };

  const formatFileType = (type) => {
    if (!type) return 'File';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // ✅ FIX: Gunakan objek attachment yang sudah dinormalisasi
  const handleDownload = async (att) => {
    if (!att || !att.url) {
      showToast('Tidak dapat mendownload file: URL tidak valid', 'error');
      return;
    }
    
    const downloadUrl = att.url;
    console.log('📥 Downloading from:', downloadUrl);
    
    setDownloading(true);
    
    try {
      const response = await fetch(downloadUrl);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = att.title;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        setDownloading(false);
      }, 100);
      
      showToast('File berhasil didownload', 'success');
      
    } catch (error) {
      console.error('❌ Download failed:', error);
      
      // Fallback: Open in new tab
      window.open(downloadUrl, '_blank');
      setDownloading(false);
      showToast('Membuka file di tab baru...', 'info');
    }
  };

  const showToast = (message, type = 'info') => {
    const toastContainer = document.getElementById('toast-container') || (() => {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(container);
      return container;
    })();
    
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 
                    type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                    'bg-blue-50 border-blue-500 text-blue-800';
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' :
                 'fa-info-circle';
    
    toast.className = `${bgColor} border-l-4 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300`;
    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0"><i class="fa-solid ${icon}"></i></div>
        <div class="ml-3 flex-1"><p class="text-sm font-medium">${message}</p></div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 flex-shrink-0">
          <i class="fa-solid fa-times text-sm opacity-50 hover:opacity-100"></i>
        </button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const handleImageClick = (att) => {
    if (att && att.url) window.open(att.url, '_blank');
  };

  const handleDelete = () => {
    if (onDelete && message.id) {
      onDelete(message.id);
      setShowDeleteConfirm(false);
      setShowActions(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div 
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => !showDeleteConfirm && setShowActions(true)}
      onMouseLeave={() => !showDeleteConfirm && setShowActions(false)}
    >
      <div className={`relative max-w-xs lg:max-w-md ${isSender ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div className={`
          rounded-2xl p-4 shadow-sm transition-all duration-200
          ${isSender 
            ? 'bg-[#1e4d4d] text-white rounded-br-md' 
            : 'bg-white text-gray-800 rounded-bl-md border border-[#1e4d4d]/10'
          }
          ${showActions ? 'transform scale-105' : ''}
        `}>
          {/* Message Text */}
          {message.body && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.body}
            </p>
          )}
          
          {/* Attachment */}
          {attachment && (
            <div className="mt-2">
              {attachment.type === 'image' ? (
                <div className="relative group">
                  <img 
                    src={attachment.url} 
                    alt={attachment.title}
                    className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(attachment)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=Image+Error';
                    }}
                  />
                  <button
                    onClick={() => handleDownload(attachment)}
                    disabled={downloading}
                    className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                    title="Download gambar"
                  >
                    <i className={`fa-solid ${downloading ? 'fa-spinner animate-spin' : 'fa-download'} text-xs`}></i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleDownload(attachment)}
                  disabled={downloading}
                  className="w-full inline-flex items-center justify-between space-x-2 bg-black/5 hover:bg-black/10 rounded-lg px-4 py-3 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <i className={`fa-regular ${getFileIcon(attachment.type)} ${getFileIconColor(attachment.type)} text-lg`}></i>
                      {downloading && (
                        <div className="absolute -top-1 -right-1">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e4d4d]"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium truncate block ${isSender ? 'text-white/90' : 'text-gray-900'}`}>
                        {attachment.title}
                      </span>
                      <span className={`text-xs ${isSender ? 'text-white/70' : 'text-gray-500'}`}>
                        {formatFileType(attachment.type)}
                        {attachment.size && ` • ${formatFileSize(attachment.size)}`}
                      </span>
                    </div>
                  </div>
                  <div className={`transition-transform ${downloading ? 'animate-pulse' : 'group-hover:scale-110'}`}>
                    <i className={`fa-solid ${downloading ? 'fa-spinner animate-spin' : 'fa-download'} ${isSender ? 'text-white/80' : 'text-[#1e4d4d]'}`}></i>
                  </div>
                </button>
              )}
            </div>
          )}
          
          {/* Time and Status */}
          <div className={`flex items-center justify-end space-x-2 mt-2 text-xs ${
            isSender ? 'text-white/80' : 'text-gray-500'
          }`}>
            <span>{formatTime(message.created_at)}</span>
            {isSender && (
              <i className={`fa-solid fa-${message.seen ? 'check-double' : 'check'}`}></i>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="absolute -left-48 top-1/2 transform -translate-y-1/2 z-10">
            <div className="bg-white rounded-xl shadow-xl p-4 w-64">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-exclamation text-red-600"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Hapus Pesan</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={handleCancelDelete}
                      className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Action Button */}
        {showActions && isSender && !showDeleteConfirm && (
          <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 z-5">
            <button 
              onClick={handleDeleteClick}
              className="w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors hover:scale-110 active:scale-95"
              title="Hapus pesan"
            >
              <i className="fa-regular fa-trash-can text-sm"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;