import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import { API } from '../../../_api';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import SendForm from './SendForm';
import ContactList from './ContactList';
import PsychologistInfo from '../../psychologist/PsychologistInfo';
import Modals from './Modals';
import Navbar from '../../../components/navbar';

const ChatMain = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
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
      setCurrentContact(data.psychologist);
    } catch (error) {
      console.error('Failed to fetch consultation:', error);
    }
  }, [consultationId]);

  // 2. Fetch Contacts
  const fetchContacts = useCallback(async () => {
    try {
      const response = await API.get('/psychologists/available');
      const contactData = response.data.data || response.data;
      setContacts(Array.isArray(contactData) ? contactData : []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      setContacts([]);
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
      
      const response = await API.delete(`/messages/${messageId}`);
      
      if (response.data.success) {
        // Update local state
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        
        // Show success notification
        // alert('Pesan berhasil dihapus');
        
        // Or use a toast notification
        console.log('✅ Message deleted successfully');
      }
    } catch (error) {
      console.error('❌ Failed to delete message:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Gagal menghapus pesan';
      
      alert(`Error: ${errorMessage}`);
      
      // Jika unauthorized, refresh messages
      if (error.response?.status === 403) {
        fetchMessages();
      }
    }
  }, [fetchMessages]);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      
      try {
        await fetchContacts();

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
  }, [consultationId, fetchConsultation, fetchMessages, setupWebSocket, fetchContacts]);

  // Logic Klik Kontak
  const handleContactSelect = async (contact) => {
    setCurrentContact(contact);

    try {
      const response = await API.post('/consultation/start', {
        psychologist_id: contact.id
      });

      const data = response.data.data || response.data;

      if (data.requires_payment) {
        navigate(`/payment/${data.consultation_id}`);
      } else {
        navigate(`/chat/${data.consultation_id}`);
      }
    } catch (error) {
      console.error("Gagal memulai chat:", error);
    }
  };

  // Di ChatMain.jsx - method sendMessage (line ~127)
  const sendMessage = async (message, attachment = null) => {
    if ((!message.trim() && !attachment) || consultation?.status !== 'active') return;

    try {
      const formData = new FormData();
      formData.append('message', message);
      if (attachment) {
        formData.append('file', attachment);
      }

      // ✅ TAMBAHKAN INI - Debug URL
      const url = `/consultation/${consultationId}/message`;
      console.log('🔍 Sending to URL:', url);
      console.log('🔍 Full URL:', API.defaults.baseURL + url);
      console.log('🔍 Consultation ID:', consultationId);
      console.log('🔍 Message:', message);

      const response = await API.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('✅ Response:', response.data);
      fetchMessages();
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Request URL:', error.config?.url);
      alert(`Gagal mengirim pesan: ${error.response?.data?.message || error.message}`);
    }
  };

  const endConsultation = async () => {
    try {
      await API.post(`/consultation/${consultationId}/end`);
      setConsultation(prev => ({ ...prev, status: 'ended' }));
    } catch (error) {
      console.error('Failed to end consultation:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    const name = (contact.name || "").toLowerCase();
    return name.includes(query);
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#1a3c3c]/10">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-[#1e4d4d] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[#1e4d4d] font-medium animate-pulse">Memuat percakapan...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a3c3c]/10">

      <Navbar />

      <div className="w-full mt-8 md:max-w-7xl mx-auto bg-white md:rounded-2xl md:shadow-lg overflow-hidden md:border border-[#1e4d4d]/20">

        <div className="flex flex-col md:flex-row h-[calc(100vh-70px)] md:h-[80vh]">
          
          {/* CONTACTS SIDEBAR */}
          <div className={`
            bg-white border-r border-[#1e4d4d]/10 transition-all duration-300 flex flex-col
            w-full md:w-96 
            ${consultationId ? 'hidden md:flex' : 'flex'} 
          `}>
            <ChatHeader onSearch={handleSearch} />
            
            <ContactList
              contacts={filteredContacts}
              currentContact={currentContact}
              onContactSelect={handleContactSelect}
            />
          </div>

          {/* CHAT AREA */}
          <div className={`
            flex-1 flex flex-col bg-white
            ${!consultationId ? 'hidden md:flex' : 'flex'}
          `}>
            {currentContact ? (
              <>
                <ChatHeader 
                  contact={currentContact}
                  consultation={consultation}
                  onBack={() => {
                    navigate('/chat');
                    setCurrentContact(null);
                  }}
                  onShowInfo={() => setShowInfo(!showInfo)}
                  onEndConsultation={endConsultation}
                />

                <MessageList 
                  messages={messages}
                  typing={typing}
                  currentUser={consultation?.user}
                  onDeleteMessage={handleDeleteMessage}
                />

                {consultation?.status === 'active' && (
                  <SendForm 
                    onSendMessage={sendMessage}
                    disabled={consultation?.status !== 'active'}
                  />
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-[#1e4d4d] text-white flex items-center justify-center rounded-2xl mb-4 mx-auto">
                    <i className="fa-regular fa-comments text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-[#163737] mb-2">
                    Pilih Psikiater untuk Konsultasi
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Silakan pilih psikiater dari daftar untuk memulai sesi konsultasi Anda
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* INFO SIDEBAR (Desktop Only) */}
          {showInfo && currentContact && (
            <div className="hidden lg:block w-80 border-l border-[#1e4d4d]/10 bg-white">
              <PsychologistInfo 
                psychologist={currentContact}
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