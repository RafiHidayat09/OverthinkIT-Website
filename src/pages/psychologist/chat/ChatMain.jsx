import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../../_api';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import SendForm from './SendForm';
import ContactList from './ContactList';
import PatientInfo from '../../psychologist/PatientInfo';
import Modals from './Modals';
import PsychologistNavbar from '../../../components/psychologist/psychologistNavbar';

const ChatMain = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [consultations, setConsultations] = useState([]); // Beda: consultations bukan contacts
  const [currentPatient, setCurrentPatient] = useState(null); // Beda: patient bukan contact
  const [consultation, setConsultation] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const echoRef = useRef(null);

  // 1. Fetch Consultation Detail
  const fetchConsultation = useCallback(async () => {
    try {
      const response = await API.get(`/consultation/${consultationId}`);
      const data = response.data.data || response.data;
      
      setConsultation(data);
      // Psychologist melihat info patient/user
      setCurrentPatient(data.user);
    } catch (error) {
      console.error('Failed to fetch consultation:', error);
    }
  }, [consultationId]);

  // 2. Fetch Consultations (bukan contacts)
  // Psychologist melihat daftar konsultasi yang sudah di-booking ke mereka
  const fetchConsultations = useCallback(async () => {
    try {
      const response = await API.get('/psychologist/consultations', {
        params: { status: 'active,pending' } // Hanya yang aktif/pending
      });
      const consultationData = response.data.data || response.data;
      setConsultations(Array.isArray(consultationData) ? consultationData : []);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
      setConsultations([]);
    }
  }, []);

  // 3. Fetch Messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await API.get(`/consultation/${consultationId}/messages`);
      const messageData = response.data.data || response.data;
      setMessages(Array.isArray(messageData) ? messageData : []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [consultationId]);

  // 4. WebSocket
  const setupWebSocket = useCallback(() => {
    if (window.Echo) {
      const echo = window.Echo.private(`consultation.${consultationId}`);
      echo.listen('MessageSent', (e) => {
        setMessages(prev => [...prev, e.message]);
      });
      echo.listen('UserTyping', (e) => {
        setTyping(e.typing);
      });
      echoRef.current = echo;
    }
  }, [consultationId]);

  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      console.log('🗑️ Deleting message:', messageId);
      
      // Endpoint yang sama untuk user dan psychologist
      const response = await API.delete(`/messages/${messageId}`);
      
      if (response.data.success) {
        // Update local state - hapus message dari list
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        
        console.log('✅ Message deleted successfully');
        
        // Optional: Tampilkan toast notification (jika ada library toast)
        // toast.success('Pesan berhasil dihapus');
      }
    } catch (error) {
      console.error('❌ Failed to delete message:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Gagal menghapus pesan. Silakan coba lagi.';
      
      // Log saja untuk debugging
      console.error('Delete error:', errorMessage, 'Status:', error.response?.status);
      
      // Optional: Tampilkan error toast
      // toast.error(errorMessage);
      
      // Refresh messages jika perlu
      if (error.response?.status === 403 || error.response?.status === 404) {
        fetchMessages();
      }
      
      // Optional: Jika 401, redirect ke login
      if (error.response?.status === 401) {
        // window.location.href = '/login';
      }
    }
  }, [fetchMessages]);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      
      try {
        // Fetch daftar konsultasi psychologist
        await fetchConsultations();

        if (consultationId) {
          await Promise.all([
            fetchConsultation(),
            fetchMessages()
          ]);
          setupWebSocket();
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();

    return () => {
      if (echoRef.current) {
        echoRef.current.stopListening('MessageSent');
        echoRef.current.stopListening('UserTyping');
      }
    };
  }, [consultationId, fetchConsultation, fetchMessages, setupWebSocket, fetchConsultations]);

  // Logic Klik Konsultasi dari Sidebar
  // Psychologist tinggal navigate ke chat yang sudah ada
  const handleConsultationSelect = (selectedConsultation) => {
    navigate(`/psychologist/chat/${selectedConsultation.id}`);
  };

  // Send Message
  const sendMessage = async (message, attachment = null) => {
    if ((!message.trim() && !attachment) || consultation?.status !== 'active') return;

    try {
      const formData = new FormData();
      formData.append('message', message);
      if (attachment) {
        formData.append('file', attachment);
      }

      const url = `/consultation/${consultationId}/message`;
      console.log('🔍 Sending to URL:', url);

      const response = await API.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('✅ Response:', response.data);
      fetchMessages();
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      alert(`Gagal mengirim pesan: ${error.response?.data?.message || error.message}`);
    }
  };

  // End Consultation
  const endConsultation = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengakhiri sesi konsultasi ini?')) return;

    try {
      await API.post(`/consultation/${consultationId}/end`);
      setConsultation(prev => ({ ...prev, status: 'ended' }));
      alert('Sesi konsultasi telah diakhiri');
      navigate('/psychologist/consultations');
    } catch (error) {
      console.error('Failed to end consultation:', error);
      alert('Gagal mengakhiri konsultasi');
    }
  };

  // Search Handler
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter consultations by search query
  const filteredConsultations = consultations.filter((consult) => {
    const query = searchQuery.toLowerCase();
    const userName = (consult.user_name || consult.user?.name || "").toLowerCase();
    return userName.includes(query);
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#1a3c3c]/10">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-[#1e4d4d] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[#1e4d4d] font-medium animate-pulse">Memuat konsultasi...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a3c3c]/10">

      <div className="w-full mt-8 md:max-w-7xl mx-auto bg-white md:rounded-2xl md:shadow-lg overflow-hidden md:border border-[#1e4d4d]/20">
        <div className="flex flex-col md:flex-row h-[calc(100vh-70px)] md:h-[80vh]">
          
          {/* CONSULTATIONS SIDEBAR */}
          <div className={`
            bg-white border-r border-[#1e4d4d]/10 transition-all duration-300 flex flex-col
            w-full md:w-96 
            ${consultationId ? 'hidden md:flex' : 'flex'} 
          `}>
            <ChatHeader onSearch={handleSearch} />
            
            <ContactList
              contacts={filteredConsultations.map(c => ({
                id: c.id,
                name: c.name || c.user_name,
                avatar: c.avatar,
                status: 'online', // Ini bisa diambil dari data c.status (user status)
                last_message: c.last_message,
                last_message_time: c.last_message_time,
                unseen_count: c.unseen_count || 0,
                is_favorite: false
              }))}
              currentContact={currentPatient} // Highlight yang sedang aktif
              onContactSelect={handleConsultationSelect}
            />
          </div>

          {/* CHAT AREA */}
          <div className={`
            flex-1 flex flex-col bg-white
            ${!consultationId ? 'hidden md:flex' : 'flex'}
          `}>
            {currentPatient ? (
              <>
                <ChatHeader 
                  contact={currentPatient}
                  consultation={consultation}
                  onBack={() => {
                    navigate('/psychologist/chat');
                    setCurrentPatient(null);
                  }}
                  onShowInfo={() => setShowInfo(!showInfo)}
                  onEndConsultation={endConsultation}
                />

                <MessageList 
                  messages={messages}
                  typing={typing}
                  currentUser={consultation?.psychologist}
                  onDeleteMessage={handleDeleteMessage}
                />

                {consultation?.status === 'active' && (
                  <SendForm 
                    onSendMessage={sendMessage}
                    disabled={consultation?.status !== 'active'}
                  />
                )}

                {consultation?.status === 'pending' && (
                  <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                    <p className="text-center text-yellow-800 text-sm">
                      Konsultasi belum dimulai. Menunggu pembayaran dari pasien.
                    </p>
                  </div>
                )}

                {consultation?.status === 'ended' && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-center text-gray-600 text-sm">
                      Sesi konsultasi telah berakhir
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-[#1e4d4d] text-white flex items-center justify-center rounded-2xl mb-4 mx-auto">
                    <i className="fa-regular fa-comments text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-[#163737] mb-2">
                    Pilih Konsultasi
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Silakan pilih konsultasi dari daftar untuk memulai chat dengan pasien
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PATIENT INFO SIDEBAR (Desktop Only) */}
          {showInfo && currentPatient && (
            <div className="hidden lg:block w-80 border-l border-[#1e4d4d]/10 bg-white">
              <PatientInfo 
                patient={currentPatient}
                consultation={consultation}
                onClose={() => setShowInfo(false)}
                onEndConsultation={endConsultation}
              />
            </div>
          )}
        </div>
      </div>

      <Modals />
    </div>
  );
};

export default ChatMain;