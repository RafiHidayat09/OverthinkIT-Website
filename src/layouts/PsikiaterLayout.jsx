import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../_services/auth";
import { useState, useEffect } from "react";
import { API } from "../_api";

export default function PsikiaterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  // UBAH STATE: Dari earnings jadi balance
  const [balance, setBalance] = useState(0); 
  const [loadingBalance, setLoadingBalance] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // API call untuk mengambil Wallet Balance
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoadingBalance(true);
        // 1. Gunakan endpoint '/psychologist/wallet'
        const response = await API.get('/psychologist/wallet');
        
        // 2. AMBIL DATA WALLET BALANCE (Bukan Earnings lagi)
        // Path JSON: response.data.data.wallet.balance
        const currentBalance = response.data.data?.wallet?.balance || 0;
        
        setBalance(currentBalance);
      } catch (error) {
        console.error("Error fetching wallet:", error);
        setBalance(0);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchWallet();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleWalletNavigation = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const role = userInfo.role;
    
    if (role === "psikiater" || role === "psychologist") {
      navigate("/psychologist/wallet");
    } else {
      navigate("/wallet");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e4d4d] text-white p-6 flex flex-col justify-between shadow-lg">
        
        <div>
          <h2 className="text-2xl font-bold mb-8 tracking-wide">Psikiater Panel</h2>

          <nav className="flex flex-col gap-4 text-lg">

            <Link
              to="/psikiater/dashboard"
              className={`hover:underline ${
                location.pathname.includes("dashboard") ? "font-bold text-yellow-300" : ""
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/psikiater/profile"
              className={`hover:underline ${
                location.pathname.includes("profile") ? "font-bold text-yellow-300" : ""
              }`}
            >
              Profil Saya
            </Link>

            <Link
              to="/psikiater/artikel"
              className={`hover:underline ${
                location.pathname.includes("artikel") ? "font-bold text-yellow-300" : ""
              }`}
            >
              Buat Artikel
            </Link>

            {/* Button Konsultasi */}
            <button
              onClick={() => navigate("/psychologist/chat")}
              className={`w-full py-2 bg-[#5ba8a0] hover:bg-[#4a9990] rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 transition-colors ${
                location.pathname.includes("chat") ? "bg-[#4a9990] font-bold" : ""
              }`}
            >
              <i className="fas fa-comments text-sm"></i>
              Konsultasi
            </button>

          </nav>

          {/* Wallet Section (UPDATED) */}
          <div className="mt-8 p-4 bg-[#2a5d5d] rounded-lg border border-[#3a7d7d]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-yellow-300 flex items-center gap-2">
                <i className="fas fa-wallet text-sm"></i>
                {/* UBAH JUDUL */}
                My Wallet
              </h3>
              <button 
                onClick={handleWalletNavigation}
                className="text-xs bg-[#1e4d4d] hover:bg-[#163737] px-2 py-1 rounded transition-colors"
              >
                Details
              </button>
            </div>
            
            {loadingBalance ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-300"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-white">
                  {/* TAMPILKAN BALANCE */}
                  {formatCurrency(balance)}
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  {/* UBAH DESKRIPSI */}
                  Saldo aktif
                </div>
              </>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2"
        >
          <i className="fas fa-sign-out-alt text-sm"></i>
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}