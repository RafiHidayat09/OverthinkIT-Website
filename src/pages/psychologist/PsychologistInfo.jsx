import React, { useState } from 'react';

const PsychologistInfo = ({ psychologist, consultation, onClose, onEndConsultation }) => {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmitRating = async () => {
    try {
      // Kirim rating ke backend
      await fetch(`/api/consultation/${consultation.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          review: review
        })
      });
      
      setShowRating(false);
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const formatDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '0 menit';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.floor((end - start) / (1000 * 60)); // dalam menit
    
    if (duration < 60) return `${duration} menit`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} jam ${minutes} menit`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-[#1e4d4d]/10 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#163737]">Detail Psikiater</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1e4d4d]/10 text-[#1e4d4d] flex items-center justify-center hover:bg-[#1e4d4d]/20 transition-colors"
          >
            <i className="fa-solid fa-times text-sm"></i>
          </button>
        </div>
      </div>

      {/* Psychologist Info */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div 
            className="w-24 h-24 rounded-2xl bg-cover bg-center mx-auto mb-4 shadow-lg"
            style={{ backgroundImage: `url(${psychologist.avatar})` }}
          >
            {!psychologist.avatar && (
              <div className="w-full h-full bg-[#1e4d4d] rounded-2xl flex items-center justify-center text-white font-semibold text-2xl">
                {psychologist.name.charAt(0)}
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-[#163737] mb-2">
            {psychologist.name}
          </h2>
          
          <p className="text-[#1e4d4d] font-medium mb-1">
            {psychologist.specialization || 'Psikiater'}
          </p>
          
          <div className="flex items-center justify-center space-x-1 mb-4">
            <div className="flex text-amber-400">
              {'★'.repeat(Math.floor(psychologist.rating || 0))}
              {'☆'.repeat(5 - Math.floor(psychologist.rating || 0))}
            </div>
            <span className="text-sm text-gray-600">
              ({psychologist.rating || '0'})
            </span>
          </div>

          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            psychologist.status === 'online' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              psychologist.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`}></div>
            {psychologist.status === 'online' ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Consultation Info */}
        {consultation && (
          <div className="bg-[#f8fafc] rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-[#163737] mb-3">Info Konsultasi</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  consultation.status === 'active' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {consultation.status === 'active' ? 'Berlangsung' : 'Selesai'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Dimulai:</span>
                <span className="text-gray-800">
                  {new Date(consultation.started_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              {consultation.ended_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Durasi:</span>
                  <span className="text-gray-800">
                    {formatDuration(consultation.started_at, consultation.ended_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specializations */}
        {psychologist.specializations && (
          <div className="mb-6">
            <h4 className="font-semibold text-[#163737] mb-3">Spesialisasi</h4>
            <div className="flex flex-wrap gap-2">
              {psychologist.specializations.map((spec, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-[#1e4d4d]/10 text-[#1e4d4d] rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {psychologist.bio && (
          <div className="mb-6">
            <h4 className="font-semibold text-[#163737] mb-3">Tentang</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {psychologist.bio}
            </p>
          </div>
        )}

        {/* Education */}
        {psychologist.education && (
          <div className="mb-6">
            <h4 className="font-semibold text-[#163737] mb-3">Pendidikan</h4>
            <p className="text-gray-600 text-sm">
              {psychologist.education}
            </p>
          </div>
        )}

        {/* Experience */}
        {psychologist.experience && (
          <div className="mb-6">
            <h4 className="font-semibold text-[#163737] mb-3">Pengalaman</h4>
            <p className="text-gray-600 text-sm">
              {psychologist.experience}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-[#1e4d4d]/10 p-6 space-y-3">
        {consultation?.status === 'active' && (
          <button 
            onClick={onEndConsultation}
            className="w-full bg-red-500 text-white py-3 rounded-2xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <i className="fa-solid fa-phone-slash"></i>
            <span>Akhiri Konsultasi</span>
          </button>
        )}

        {consultation?.status === 'ended' && !consultation.rated && (
          <button 
            onClick={() => setShowRating(true)}
            className="w-full bg-[#1e4d4d] text-white py-3 rounded-2xl hover:bg-[#163737] transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <i className="fa-regular fa-star"></i>
            <span>Beri Rating</span>
          </button>
        )}

        <button className="w-full border border-[#1e4d4d] text-[#1e4d4d] py-3 rounded-2xl hover:bg-[#1e4d4d] hover:text-white transition-colors font-medium">
          Lihat Profil Lengkap
        </button>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#163737] mb-4">
              Beri Rating untuk {psychologist.name}
            </h3>
            
            {/* Stars Rating */}
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= rating ? '⭐' : '★'}
                </button>
              ))}
            </div>
            
            {/* Review Textarea */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Bagaimana pengalaman konsultasi Anda? (opsional)"
              className="w-full h-24 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1e4d4d]/30 focus:border-[#1e4d4d]/30"
            />
            
            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRating(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={rating === 0}
                className="flex-1 bg-[#1e4d4d] text-white py-2 rounded-xl hover:bg-[#163737] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kirim Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologistInfo;