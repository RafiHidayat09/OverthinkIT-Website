import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout, useDecodeToken } from "../_services/auth";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const decodedData = useDecodeToken(token);

  useEffect(() => {
    if (!token || !decodedData || !decodedData.success) {
      navigate("/login");
    }

    const role = userInfo.role;
    if (role !== "admin" || !role) {
      navigate("/");
    }
  }, [token, decodedData, navigate]);

  const handleLogout = async () => {
    await logout({ token });
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* =================== SIDEBAR =================== */}
      <aside className="w-64 bg-[#1e4d4d] text-white flex flex-col justify-between p-6 shadow-xl fixed h-full">

        {/* TOP - LOGO + MENU */}
        <div>
          <h2 className="text-2xl font-bold mb-8 tracking-wide">Admin Panel</h2>

          <nav className="flex flex-col gap-4 text-lg">

            
    
            <Link
              to="/admin"
              className="hover:bg-[#255e5e] py-2 px-3 rounded transition"
            >
              Dashboard
            </Link>

           
          </nav>


          <nav className="flex flex-col gap-4 text-lg">

            

            <Link
              to="/admin/psikiater"
              className="hover:bg-[#255e5e] py-2 px-3 rounded transition"
            >
              Tambah Psikiater
            </Link>

           
          </nav>
           <nav className="flex flex-col gap-4 text-lg">

            

            <Link
              to="/admin/user"
              className="hover:bg-[#255e5e] py-2 px-3 rounded transition"
            >
              List User
            </Link>

           
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full py-2 mt-8 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
        >
          Logout
        </button>
      </aside>

      {/* =================== MAIN CONTENT =================== */}
      <main className="flex-1 ml-64 p-6">

        {/* NAV TOP */}
        <nav className="w-full bg-[#1e4d4d] text-white px-6 py-3 rounded shadow-lg mb-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">Welcome, {userInfo?.name}</h1>

          <img
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
            className="w-10 h-10 rounded-full border-2 border-yellow-300"
            alt="profile"
          />
        </nav>

        {/* KONTEN DI SINI */}
        <div className="bg-white shadow-md rounded-lg p-6 min-h-[500px]">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
