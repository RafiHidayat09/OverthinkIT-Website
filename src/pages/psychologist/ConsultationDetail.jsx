import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPsychologistConsultationDetail } from '../../_services/psychologistService';

const ConsultationDetail = () => {
  const { id } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultationDetail();
  }, [id]);

  const fetchConsultationDetail = async () => {
    try {
      const data = await getPsychologistConsultationDetail(id);
      setConsultation(data);
    } catch (error) {
      console.error('Failed to fetch consultation detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Menunggu';
      case 'ended': return 'Selesai';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a3c3c]/10 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Memuat detail konsultasi...</div>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-[#1a3c3c]/10 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Konsultasi tidak ditemukan</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a3c3c]/10 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#163737] mb-2">Detail Konsultasi</h1>
            <p className="text-gray-600">Informasi lengkap sesi konsultasi</p>
          </div>
          <Link
            to="/psychologist/consultations"
            className="text-[#1e4d4d] hover:text-[#163737] font-medium"
          >
            ← Kembali
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20">
              <h3 className="text-xl font-semibold text-[#163737] mb-4">Informasi Pasien</h3>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-[#1e4d4d] rounded-2xl flex items-center justify-center text-white text-2xl font-semibold">
                  {consultation.user_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h4 className="font-semibold text-[#163737] text-lg">{consultation.user_name}</h4>
                  <p className="text-gray-600">{consultation.user_email}</p>
                  <p className="text-sm text-gray-500">Bergabung {new Date(consultation.user_joined).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>

            {/* Consultation Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20">
              <h3 className="text-xl font-semibold text-[#163737] mb-4">Detail Konsultasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusText(consultation.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Biaya</p>
                  <p className="font-semibold text-[#163737]">Rp {consultation.fee?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dimulai</p>
                  <p className="font-semibold text-[#163737]">
                    {consultation.started_at ? new Date(consultation.started_at).toLocaleString('id-ID') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Berakhir</p>
                  <p className="font-semibold text-[#163737]">
                    {consultation.ended_at ? new Date(consultation.ended_at).toLocaleString('id-ID') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durasi</p>
                  <p className="font-semibold text-[#163737]">
                    {consultation.duration ? `${consultation.duration} menit` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dibuat</p>
                  <p className="font-semibold text-[#163737]">
                    {new Date(consultation.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating & Review */}
            {consultation.rating && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20">
                <h3 className="text-xl font-semibold text-[#163737] mb-4">Ulasan Pasien</h3>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex text-amber-400 text-2xl">
                    {'★'.repeat(consultation.rating)}
                    {'☆'.repeat(5 - consultation.rating)}
                  </div>
                  <span className="text-lg font-semibold text-[#163737]">{consultation.rating}.0</span>
                </div>
                {consultation.review && (
                  <p className="text-gray-700 border-t pt-3 mt-3">{consultation.review}</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20">
              <h3 className="text-lg font-semibold text-[#163737] mb-4">Aksi</h3>
              <div className="space-y-3">
                {consultation.status === 'active' && (
                  <>
                    <Link
                      to={`/chat/${consultation.id}`}
                      className="w-full bg-green-500 text-white py-3 rounded-2xl hover:bg-green-600 transition-colors font-medium text-center block"
                    >
                      Buka Chat
                    </Link>
                    <button className="w-full bg-red-500 text-white py-3 rounded-2xl hover:bg-red-600 transition-colors font-medium">
                      Akhiri Sesi
                    </button>
                  </>
                )}
                {consultation.status === 'pending' && (
                  <button className="w-full bg-[#1e4d4d] text-white py-3 rounded-2xl hover:bg-[#163737] transition-colors font-medium">
                    Mulai Konsultasi
                  </button>
                )}
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-2xl hover:bg-gray-50 transition-colors font-medium">
                  Export Laporan
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20">
              <h3 className="text-lg font-semibold text-[#163737] mb-4">Catatan</h3>
              <textarea
                placeholder="Tambahkan catatan tentang sesi ini..."
                className="w-full h-32 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e4d4d]/30 resize-none"
              />
              <button className="w-full bg-[#1e4d4d] text-white py-2 rounded-2xl hover:bg-[#163737] transition-colors font-medium mt-3">
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetail;