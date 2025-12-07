import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processLogin = () => {
      const urlParams = new URLSearchParams(location.search);
      
      // 1. Ambil TOKEN dan USER yang dikirim oleh Laravel
      const token = urlParams.get('token');
      const userBase64 = urlParams.get('user');
      const error = urlParams.get('error');

      // 2. Jika ada error dari backend
      if (error) {
        console.error("Login Error:", error);
        navigate("/login", { state: { error } });
        return;
      }

      // 3. Jika Token ditemukan
      if (token && userBase64) {
        try {
          // Decode data user
          const user = JSON.parse(atob(userBase64));

          // Simpan ke LocalStorage
          localStorage.setItem('accessToken', token);
          localStorage.setItem('userInfo', JSON.stringify(user)); 

          console.log("✅ Login Berhasil!", user);
          
          if (user.role === 'admin') {
            window.location.href = "/admin";
          } else if (user.role === 'psikiater') {
            window.location.href = "/psikiater";
          } else {
            // Role user biasa atau role lain
            window.location.href = "/";
          }

        } catch (err) {
          console.error("Gagal memproses data:", err);
          navigate("/login");
        }
      } else {
        // Jika halaman dibuka tanpa parameter token (misal manual)
        navigate("/login");
      }
    };

    processLogin();
  }, [navigate, location]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Sedang memproses login...</p>
      </div>
    </div>
  );
}