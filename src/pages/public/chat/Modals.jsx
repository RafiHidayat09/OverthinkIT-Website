import React, { useState, useEffect } from 'react';

const Modals = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle image click to open modal
  useEffect(() => {
    const handleImageClick = (event) => {
      const imageElement = event.target.closest('.chat-image');
      if (imageElement) {
        const imageUrl = imageElement.style.backgroundImage
          .replace('url("', '')
          .replace('")', '');
        setSelectedImage(imageUrl);
        setActiveModal('image');
      }
    };

    document.addEventListener('click', handleImageClick);
    return () => document.removeEventListener('click', handleImageClick);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('app-modal') || 
          event.target.classList.contains('imageModal')) {
        setActiveModal(null);
        setSelectedImage(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveModal(null);
        setSelectedImage(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleDelete = () => {
    // Delete logic would go here
    console.log('Delete action triggered');
    setActiveModal(null);
  };

  return (
    <>
      {/* Image Modal */}
      {activeModal === 'image' && selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 imageModal">
          <div className="relative max-w-4xl max-h-full">
            <button 
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
              onClick={() => setActiveModal(null)}
            >
              &times;
            </button>
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === 'delete' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 app-modal">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-lg font-semibold text-[#163737] mb-2">
                Hapus Pesan?
              </div>
              <div className="text-gray-600 mb-6">
                Pesan yang sudah dihapus tidak dapat dikembalikan.
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {activeModal === 'alert' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 app-modal">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-lg font-semibold text-[#163737] mb-2">
                Peringatan
              </div>
              <div className="text-gray-600 mb-6">
                Terjadi kesalahan.
              </div>
              <div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-[#1e4d4d] text-white py-2 rounded-xl hover:bg-[#163737] transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;