import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPsychologistConsultations, startConsultation, endConsultation } from '../../_services/psychologistService';

const PsychologistConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, [filter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getPsychologistConsultations(filter);
      setConsultations(data);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (consultationId) => {
    try {
      await startConsultation(consultationId);
      fetchConsultations(); // Refresh list
    } catch (error) {
      console.error('Failed to start consultation:', error);
    }
  };

  const handleEndConsultation = async (consultationId) => {
    try {
      await endConsultation(consultationId);
      fetchConsultations(); // Refresh list
    } catch (error) {
      console.error('Failed to end consultation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a3c3c]/10 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#163737] mb-2">Konsultasi Saya</h1>
          <p className="text-gray-600">Kelola semua sesi konsultasi dengan pasien</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#1e4d4d]/20">
          <div className="flex space-x-4">
            {[
              { key: 'all', label: 'Semua' },
              { key: 'pending', label: 'Menunggu' },
              { key: 'active', label: 'Aktif' },
              { key: 'ended', label: 'Selesai' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-2 rounded-2xl font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-[#1e4d4d] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Memuat konsultasi...</div>
          ) : consultations.length > 0 ? (
            consultations.map(consultation => (
              <ConsultationDetailCard 
                key={consultation.id}
                consultation={consultation}
                onStart={handleStartConsultation}
                onEnd={handleEndConsultation}
              />
            ))
          ) : (
            <EmptyState filter={filter} />
          )}
        </div>
      </div>
    </div>
  );
};

const ConsultationDetailCard = ({ consultation, onStart, onEnd }) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#1e4d4d] rounded-2xl flex items-center justify-center text-white font-semibold text-lg">
            {consultation.user_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-[#163737] text-lg">{consultation.user_name}</h3>
            <p className="text-gray-600">{consultation.user_email}</p>
            <p className="text-sm text-gray-500">
              Dimulai: {new Date(consultation.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
            {getStatusText(consultation.status)}
          </span>
          <p className="text-lg font-bold text-[#1e4d4d] mt-2">
            Rp {consultation.fee?.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          {consultation.status === 'pending' && (
            <button
              onClick={() => onStart(consultation.id)}
              className="bg-[#1e4d4d] text-white px-4 py-2 rounded-2xl hover:bg-[#163737] transition-colors font-medium"
            >
              Mulai Konsultasi
            </button>
          )}
          
          {consultation.status === 'active' && (
            <>
              <Link
                to={`/chat/${consultation.id}`}
                className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600 transition-colors font-medium"
              >
                Buka Chat
              </Link>
              <button
                onClick={() => onEnd(consultation.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-colors font-medium"
              >
                Akhiri Sesi
              </button>
            </>
          )}
          
          {consultation.status === 'ended' && consultation.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex text-amber-400">
                {'★'.repeat(consultation.rating)}
                {'☆'.repeat(5 - consultation.rating)}
              </div>
              <span className="text-gray-600 text-sm">({consultation.review})</span>
            </div>
          )}
        </div>

        <Link
          to={`/psychologist/consultation/${consultation.id}`}
          className="text-[#1e4d4d] hover:text-[#163737] font-medium"
        >
          Detail →
        </Link>
      </div>
    </div>
  );
};

const EmptyState = ({ filter }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-[#1e4d4d]/20">
    <div className="w-20 h-20 bg-[#1e4d4d]/10 text-[#1e4d4d] rounded-2xl flex items-center justify-center mb-4 mx-auto">
      <i className="fas fa-comments text-2xl"></i>
    </div>
    <h3 className="text-xl font-semibold text-[#163737] mb-2">
      Tidak ada konsultasi
    </h3>
    <p className="text-gray-600">
      {filter === 'all' 
        ? 'Belum ada konsultasi yang dimulai' 
        : `Tidak ada konsultasi dengan status ${filter}`
      }
    </p>
  </div>
);

export default PsychologistConsultations;