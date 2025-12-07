import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../_api';

const PsychologistList = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPsychologists();
  }, [filter]);

  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/psychologists?status=${filter}`);
      const data = response.data.data || response.data;
      
      if (Array.isArray(data)) {
        setPsychologists(data);
      } else {
        setPsychologists([]);
      }
    } catch (error) {
      console.error('Failed to fetch psychologists:', error);
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = async (psychologistId) => {
    try {
      const response = await API.post('/consultation/start', {
        psychologist_id: psychologistId
      });
      
      if (response.data.requires_payment) {
        navigate(`/payment/${response.data.consultation_id}`);
      } else {
        navigate(`/chat/${response.data.consultation_id}`);
      }
    } catch (error) {
      console.error('Failed to start consultation:', error);
      alert(error.response?.data?.message || 'Gagal memulai konsultasi');
    }
  };

  const filteredPsychologists = psychologists.filter((psy) => {
    const query = searchQuery.toLowerCase();
    return (
      psy.name.toLowerCase().includes(query) || 
      psy.specialization.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        {/* Icon Spinner */}
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[#1e4d4d] mb-4"></i>
        
        {/* Teks Loading (Opsional) */}
        <span className="text-[#1e4d4d] font-medium text-lg animate-pulse">
          Memuat data...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#163737] mb-4">
            Konsultasi Psikologi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan psikiater profesional yang tepat untuk mendengarkan dan membantu masalah Anda.
          </p>
        </div>

        {/* CONTROLS: SEARCH & FILTER */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* SEARCH BAR */}
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Cari nama dokter atau spesialisasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-[#1e4d4d] focus:border-[#1e4d4d]"
              />
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex space-x-2 w-full md:w-auto justify-center md:justify-end">
              {['all', 'online', 'offline'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                    filter === status 
                      ? 'bg-[#1e4d4d] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Semua' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LIST PSIKIATER */}
        <div className="flex flex-col gap-4">
          {filteredPsychologists.map(psy => (
            <div 
              key={psy.id} 
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              {/* BAGIAN KIRI: FOTO */}
              <div className="relative flex-shrink-0 mx-auto md:mx-0">
                <div className="w-24 h-24 rounded-2xl bg-gray-200 overflow-hidden">
                  {psy?.avatar ? (
                    <img 
                      src={psy.avatar}
                      alt={psy.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1e4d4d] rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                      {psy.name?.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Status Indicator */}
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border-2 border-white ${
                  psy.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {psy.status}
                </div>
              </div>
              
              {/* BAGIAN TENGAH: INFO */}
              <div className="flex-1 text-center md:text-left w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1 justify-center md:justify-start">
                  <h3 className="font-bold text-[#163737] text-lg">{psy.name}</h3>
                  <div className="flex items-center justify-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100 w-fit mx-auto md:mx-0">
                    <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                    <span className="text-xs font-medium text-yellow-700">{psy.rating || '0.0'}</span>
                    <span className="text-[10px] text-gray-400">({psy.review_count})</span>
                  </div>
                </div>
                
                <p className="text-[#1e4d4d] font-medium text-sm mb-2">{psy.specialization}</p>
                
                <p className="text-gray-500 text-sm line-clamp-2 mb-3 md:mb-0">
                  {psy.bio || 'Spesialis dalam memberikan konsultasi kesehatan mental profesional.'}
                </p>
              </div>

              {/* BAGIAN KANAN: HARGA & TOMBOL */}
              <div className="flex flex-col items-center md:items-end gap-3 min-w-[160px] w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                <div className="text-right">
                  <span className="text-xs text-gray-400 block md:inline mr-1">Biaya Sesi</span>
                  <span className="text-lg font-bold text-[#1e4d4d]">
                    Rp. {psy.fee?.toLocaleString()}
                  </span>
                </div>

                <button 
                  onClick={() => startConsultation(psy.id)}
                  disabled={psy.status === 'offline'}
                  className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm ${
                    psy.status === 'online'
                      ? 'bg-[#1e4d4d] text-white hover:bg-[#163737]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {psy.status === 'online' ? 'Chat Sekarang' : 'Offline'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE (Jika hasil search/filter kosong) */}
        {filteredPsychologists.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 mt-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-user-doctor text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Tidak ditemukan</h3>
            <p className="text-gray-500 text-sm">
              Coba ubah kata kunci pencarian atau filter status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PsychologistList;