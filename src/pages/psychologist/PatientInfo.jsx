import React, { useState } from 'react';

const PatientInfo = ({ patient, consultation, onClose, onEndConsultation }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(consultation?.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      // Simulasi save notes
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Notes saved:', notes);
      alert('Catatan berhasil disimpan');
    } catch (error) {
      console.error('Failed to save notes:', error);
      alert('Gagal menyimpan catatan');
    } finally {
      setSavingNotes(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aktif' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Menunggu' },
      ended: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Selesai' }
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusBadge = getStatusBadge(consultation?.status);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-[#163737]">Info Pasien</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <i className="fa-solid fa-xmark text-gray-600"></i>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Patient Avatar & Name */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="w-24 h-24 bg-[#1e4d4d] text-white rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-3">
            {patient?.avatar ? (
              <img 
                src={patient.avatar} 
                alt={patient.name} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              (patient?.name || "User").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            )}
          </div>
          <h2 className="text-xl font-bold text-[#163737] mb-1">{patient?.name || 'Pasien'}</h2>
          <p className="text-sm text-gray-600 mb-3">{patient?.email}</p>
          
          {/* Status Badge */}
          {consultation?.status && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
              {statusBadge.label}
            </span>
          )}
        </div>

        {/* Patient Details */}
        <div className="p-4 space-y-4">
          {/* Contact Info Section */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Informasi Kontak
            </h4>
            <div className="space-y-3">
              <InfoItem 
                icon="fa-envelope"
                label="Email"
                value={patient?.email || '-'}
              />
              <InfoItem 
                icon="fa-phone"
                label="Telepon"
                value={patient?.phone || '-'}
              />
              <InfoItem 
                icon="fa-cake-candles"
                label="Tanggal Lahir"
                value={patient?.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : '-'}
              />
              <InfoItem 
                icon="fa-venus-mars"
                label="Jenis Kelamin"
                value={patient?.gender === 'male' ? 'Laki-laki' : patient?.gender === 'female' ? 'Perempuan' : '-'}
              />
            </div>
          </div>

          {/* Consultation Info Section */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Info Konsultasi
            </h4>
            <div className="space-y-3">
              <InfoItem 
                icon="fa-calendar-check"
                label="Dimulai"
                value={formatDate(consultation?.created_at)}
              />
              {consultation?.started_at && (
                <InfoItem 
                  icon="fa-clock"
                  label="Sesi Dimulai"
                  value={formatDate(consultation?.started_at)}
                />
              )}
              {consultation?.ended_at && (
                <InfoItem 
                  icon="fa-flag-checkered"
                  label="Sesi Berakhir"
                  value={formatDate(consultation?.ended_at)}
                />
              )}
              <InfoItem 
                icon="fa-money-bill-wave"
                label="Biaya Konsultasi"
                value={`Rp ${(consultation?.fee || 0).toLocaleString('id-ID')}`}
              />
            </div>
          </div>

          {/* Rating & Review (if consultation ended) */}
          {consultation?.status === 'ended' && consultation?.rating && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Ulasan Pasien
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-400 text-lg">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className={`fa-${i < consultation.rating ? 'solid' : 'regular'} fa-star`}></i>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {consultation.rating}.0
                  </span>
                </div>
                {consultation.review && (
                  <p className="text-sm text-gray-600 italic">"{consultation.review}"</p>
                )}
              </div>
            </div>
          )}

          {/* Clinical Notes Section */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Catatan Klinis
              </h4>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs text-[#1e4d4d] hover:text-[#163737] font-medium"
              >
                {showNotes ? 'Tutup' : 'Buka'}
              </button>
            </div>
            
            {showNotes && (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk pasien ini..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4d4d]/20 focus:border-[#1e4d4d] resize-none"
                  rows="4"
                  disabled={consultation?.status === 'ended'}
                />
                {consultation?.status !== 'ended' && (
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="w-full px-4 py-2 bg-[#1e4d4d] text-white rounded-lg text-sm font-medium hover:bg-[#163737] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingNotes ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Menyimpan...
                      </span>
                    ) : (
                      'Simpan Catatan'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Previous Consultations */}
          {patient?.consultation_count > 1 && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Riwayat
              </h4>
              <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Konsultasi Sebelumnya
                  </p>
                  <p className="text-xs text-blue-700">
                    {patient.consultation_count - 1} sesi terdahulu
                  </p>
                </div>
                <i className="fa-solid fa-clock-rotate-left text-blue-600 text-xl"></i>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {consultation?.status === 'active' && onEndConsultation && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onEndConsultation}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-stop"></i>
            Akhiri Konsultasi
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Pastikan sesi telah selesai sebelum mengakhiri
          </p>
        </div>
      )}
    </div>
  );
};

// Helper Component for Info Items
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 bg-[#1e4d4d]/10 rounded-lg flex items-center justify-center flex-shrink-0">
      <i className={`fa-solid ${icon} text-[#1e4d4d] text-sm`}></i>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900 font-medium break-words">{value}</p>
    </div>
  </div>
);

export default PatientInfo;