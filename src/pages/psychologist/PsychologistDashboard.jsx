
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPsychologistDashboardStats, getRecentConsultations, updatePsychologistStatus } from '../../_services/psychologistService';

const PsychologistDashboard = () => {
  const [stats, setStats] = useState({
    totalConsultations: 0,
    activeConsultations: 0,
    totalEarnings: 0,
    averageRating: 0,
    currentStatus: 'offline'
  });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, consultationsData] = await Promise.all([
        getPsychologistDashboardStats(),
        getRecentConsultations()
      ]);
      
      setStats(statsData);
      setRecentConsultations(consultationsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await updatePsychologistStatus({ status });
      setStats(prev => ({ ...prev, currentStatus: status }));
      alert(`Status updated to ${status}`);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a3c3c]/10 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a3c3c]/10 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#163737] mb-2">Dashboard Psikiater</h1>
          <p className="text-gray-600">Kelola konsultasi dan profil Anda</p>
        </div>

        {/* Status Toggle */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#1e4d4d]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#163737]">Status Online</h3>
              <p className="text-gray-600 text-sm">Atur ketersediaan Anda untuk konsultasi</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleStatusUpdate('online')}
                className={`px-6 py-2 rounded-2xl font-medium transition-colors ${
                  stats.currentStatus === 'online'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🟢 Online
              </button>
              <button
                onClick={() => handleStatusUpdate('offline')}
                className={`px-6 py-2 rounded-2xl font-medium transition-colors ${
                  stats.currentStatus === 'offline'
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🔴 Offline
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Konsultasi"
            value={stats.totalConsultations}
            icon="users"
            color="blue"
          />
          <StatCard
            title="Konsultasi Aktif"
            value={stats.activeConsultations}
            icon="comments"
            color="green"
          />
          <StatCard
            title="Total Pendapatan"
            value={`Rp ${(stats.totalEarnings || 0).toLocaleString('id-ID')}`}
            icon="wallet"
            color="amber"
          />
          <StatCard
            title="Rating Rata-rata"
            value={stats.averageRating}
            icon="star"
            color="purple"
            showStars={true}
          />
        </div>

        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#163737]">Konsultasi Terbaru</h3>
            <Link 
              to="/psychologist/consultations" 
              className="text-[#1e4d4d] hover:text-[#163737] font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-4">
            {recentConsultations.length > 0 ? (
              recentConsultations.map(consultation => (
                <ConsultationCard 
                  key={consultation.id} 
                  consultation={consultation} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                Belum ada konsultasi
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <QuickActionCard
            to="/psychologist/schedule"
            icon="calendar"
            title="Atur Jadwal"
            description="Kelola waktu konsultasi Anda"
            color="blue"
          />
          <QuickActionCard
            to="/psychologist/profile"
            icon="user-md"
            title="Edit Profil"
            description="Perbarui informasi profesional"
            color="green"
          />
          <QuickActionCard
            to="/psychologist/earnings"
            icon="chart-line"
            title="Laporan Pendapatan"
            description="Lihat riwayat penghasilan"
            color="amber"
          />
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, icon, color, showStars = false }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-[#163737]">{value}</p>
          {showStars && typeof value === 'number' && (
            <div className="flex text-amber-400 text-sm mt-1">
              {'★'.repeat(Math.floor(value))}
              {'☆'.repeat(5 - Math.floor(value))}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-2xl flex items-center justify-center`}>
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

const ConsultationCard = ({ consultation }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-[#1e4d4d] rounded-2xl flex items-center justify-center text-white font-semibold">
        {consultation.user_name?.charAt(0) || 'U'}
      </div>
      <div>
        <h4 className="font-semibold text-[#163737]">{consultation.user_name}</h4>
        <p className="text-gray-600 text-sm">
          {new Date(consultation.created_at).toLocaleDateString('id-ID')}
        </p>
      </div>
    </div>
    
    <div className="flex items-center space-x-4">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        consultation.status === 'active' ? 'bg-green-100 text-green-800' :
        consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {consultation.status === 'active' ? 'Aktif' :
         consultation.status === 'pending' ? 'Menunggu' : 'Selesai'}
      </span>
      
      {consultation.status === 'active' && (
        <Link 
          to={`/chat/${consultation.id}`}
          className="bg-[#1e4d4d] text-white px-4 py-2 rounded-2xl hover:bg-[#163737] transition-colors text-sm font-medium"
        >
          Buka Chat
        </Link>
      )}
    </div>
  </div>
);

const QuickActionCard = ({ to, icon, title, description, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <Link 
      to={to}
      className="bg-white rounded-2xl shadow-lg p-6 border border-[#1e4d4d]/20 hover:shadow-xl transition-all text-center"
    >
      <div className={`w-16 h-16 ${colorClasses[color]} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        <i className={`fas fa-${icon} text-2xl`}></i>
      </div>
      <h4 className="font-semibold text-[#163737] mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
};

export default PsychologistDashboard;