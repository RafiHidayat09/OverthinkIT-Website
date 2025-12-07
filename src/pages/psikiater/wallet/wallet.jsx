import { useState, useEffect } from "react";
import { API } from "../../../_api";

export default function PsikiaterWallet() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Gunakan endpoint yang benar (sesuai route api.php)
        const response = await API.get('/psychologist/wallet');
        
        // Simpan data "data" dari response JSON
        setData(response.data.data); 
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4d4d]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#163737] mb-8">Wallet & Earnings</h1>
      
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Earnings */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#1e4d4d]/20">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Earnings</h3>
          <p className="text-2xl font-bold text-[#1e4d4d]">
            {formatCurrency(data?.earnings?.total || 0)}
          </p>
        </div>
        
        {/* Monthly Earnings */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#1e4d4d]/20">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Monthly Earnings</h3>
          <p className="text-2xl font-bold text-[#1e4d4d]">
            {formatCurrency(data?.earnings?.monthly || 0)}
          </p>
        </div>
        
        {/* Wallet Balance */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#1e4d4d]/20">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Wallet Balance</h3>
          <p className="text-2xl font-bold text-[#1e4d4d]">
            {formatCurrency(data?.wallet?.balance || 0)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md border border-[#1e4d4d]/20">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#163737]">Recent Transactions</h2>
        </div>
        <div className="p-6">
          {data?.recent_transactions?.length > 0 ? (
            <div className="space-y-4">
              {data.recent_transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  {/* Logic warna: Hijau jika Topup/Credit, Merah jika Withdrawal/Payment */}
                  <div className={`text-lg font-semibold ${transaction.is_credit ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.is_credit ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}