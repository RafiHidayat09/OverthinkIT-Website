import React, { useState, useEffect } from 'react';
import { API } from '../../../_api';
import { motion, AnimatePresence } from 'framer-motion';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      const [balanceRes, transactionsRes] = await Promise.all([
        API.get('/wallet/balance'),
        API.get('/wallet/transactions')
      ]);

      console.log('Balance Data:', balanceRes.data);
      // Simpan Balance 
      setBalance(balanceRes.data.data.balance || 0);

      // Simpan Transaksi 
      const transactionsList = transactionsRes.data.data;
      
      if (Array.isArray(transactionsList)) {
        setTransactions(transactionsList);
      } else {
        setTransactions([]);
      }

    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      setBalance(0);
      setTransactions([]);
      
      if (error.response && error.response.status === 401) {
          console.log("Token expired, silakan login ulang");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || topUpAmount < 10000) {
      setPopupMessage('Minimum top up Rp 10.000');
      setShowErrorPopup(true);
      return;
    }

    try {
      await API.post('/wallet/top-up', { 
        amount: parseInt(topUpAmount) 
      });

      fetchWalletData(); 
      setPopupMessage('Top up berhasil!');
      setShowSuccessPopup(true);
      setTopUpAmount('');

    } catch (error) {
      console.error('Top-up failed:', error);
      const errorMessage = error.response?.data?.message || 'Gagal melakukan top up';
      setPopupMessage(errorMessage);
      setShowErrorPopup(true);
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center"
      >
        {/* Icon Spinner */}
        <motion.i 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="fa-solid fa-circle-notch text-4xl text-[#1e4d4d] mb-4"
        ></motion.i>
        
        {/* Teks Loading (Opsional) */}
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#1e4d4d] font-medium text-lg"
        >
          Memuat data...
        </motion.span>
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
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-[#1e4d4d]/20 mb-8"
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-[#163737] mb-4"
            >
              Wallet Saya
            </motion.h1>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1e4d4d] text-white rounded-2xl p-6 max-w-md mx-auto"
            >
              <p className="text-sm opacity-90">Saldo Tersedia</p>
              <p className="text-3xl font-bold mt-2">
                Rp {(balance || 0).toLocaleString()}
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto"
          >
            <h3 className="font-semibold text-[#163737] mb-4">Top Up Wallet</h3>
            <div className="flex space-x-3">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Masukkan jumlah"
                className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e4d4d]/30 focus:border-[#1e4d4d]/30"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTopUp}
                className="bg-[#1e4d4d] text-white px-6 py-3 rounded-2xl hover:bg-[#163737] transition-colors font-medium"
              >
                Top Up
              </motion.button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Minimum top up Rp 10.000</p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-[#1e4d4d]/20"
        >
          <h3 className="font-semibold text-[#163737] mb-6">Riwayat Transaksi</h3>
          <div className="space-y-4">
            {Array.isArray(transactions) && transactions.map((transaction, index) => (
              <motion.div 
                key={transaction.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-2xl"
              >
                <div>
                  <p className="font-medium text-[#163737]">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'topup' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'topup' ? '+' : '-'} Rp {transaction.amount.toLocaleString()}
                </span>
              </motion.div>
            ))}
            
            {(transactions.length === 0 || !Array.isArray(transactions)) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center py-8 text-gray-600"
              >
                Belum ada transaksi
              </motion.div>
            )}
          </div>
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

export default Wallet;