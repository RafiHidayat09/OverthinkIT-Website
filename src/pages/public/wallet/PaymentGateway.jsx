import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../../_api';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentGateway = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    fetchConsultationDetails();
    fetchWalletBalance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultationId]);

  const fetchConsultationDetails = async () => {
    try {
      const response = await API.get(`/consultation/${consultationId}`);
      setConsultation(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch consultation:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await API.get('/wallet/balance');
      const balance = response.data?.data?.balance ?? 0;
      setWalletBalance(balance);
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await API.post(`/consultation/${consultationId}/pay`, {
        payment_method: 'wallet'
      });
      
      // Tampilkan popup sukses
      setPopupMessage('Pembayaran berhasil!');
      setShowSuccessPopup(true);
      
      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate(`/chat/${consultationId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);

      const errorMessage = error.response?.data?.message || 'Pembayaran gagal. Saldo tidak cukup.';
      
      // Tampilkan popup error
      setPopupMessage(errorMessage);
      setShowErrorPopup(true);
      
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
  };

  if (!consultation) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#1a3c3c]/10 flex items-center justify-center"
      >
        Memuat data...
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#1a3c3c]/10 py-8 relative"
    >
      <div className="max-w-2xl mx-auto px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-[#1e4d4d]/20"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-[#1e4d4d] text-white rounded-2xl flex items-center justify-center mb-4 mx-auto"
            >
              <i className="fa-regular fa-credit-card text-2xl"></i>
            </motion.div>
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-[#163737] mb-2"
            >
              Pembayaran Konsultasi
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Lanjutkan pembayaran untuk memulai konsultasi
            </motion.p>
          </div>

          <div className="space-y-4 mb-8">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <span className="text-gray-600">Psikiater:</span>
              <span className="font-semibold text-[#163737]">{consultation?.psychologist?.name || 'Dokter'}</span>
            </motion.div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <span className="text-gray-600">Biaya Konsultasi:</span>
              <span className="font-bold text-[#1e4d4d] text-lg">
                Rp {consultation?.fee?.toLocaleString() || 0}
              </span>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <span className="text-gray-600">Saldo Wallet:</span>
              <span className={`font-semibold ${
                walletBalance >= (consultation?.fee || 0) ? 'text-green-600' : 'text-red-600'
              }`}>
                Rp {walletBalance.toLocaleString()}
              </span>
            </motion.div>
          </div>

          {walletBalance < (consultation?.fee || 0) ? (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center space-y-4"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-medium">
                  Saldo tidak cukup. Silakan top up terlebih dahulu.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/wallet')}
                className="w-full bg-[#1e4d4d] text-white py-3 rounded-2xl hover:bg-[#163737] transition-colors font-medium"
              >
                Top Up Wallet
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                onClick={handlePayment}
                disabled={loading}
                className={`w-full bg-[#1e4d4d] text-white py-3 rounded-2xl hover:bg-[#163737] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  loading ? 'relative' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    ></motion.div>
                    Memproses...
                  </div>
                ) : (
                  'Bayar dengan Wallet'
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/wallet')}
                className="w-full border border-[#1e4d4d] text-[#1e4d4d] py-3 rounded-2xl hover:bg-[#1e4d4d] hover:text-white transition-colors font-medium"
              >
                Top Up Wallet
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.1
                }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3,
                    ease: "easeInOut"
                  }}
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                Berhasil!
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-6"
              >
                {popupMessage}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center"
              >
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Popup */}
      <AnimatePresence>
        {showErrorPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Error Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.1
                }}
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.3
                  }}
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </motion.svg>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                Gagal!
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-6"
              >
                {popupMessage}
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={closePopup}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tutup
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentGateway;