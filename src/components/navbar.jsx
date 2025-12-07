import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../_services/auth";
import logo from "./logo.png"; 

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("accessToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = async () => {
    if (token) {
      await logout({ token });
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
    }
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <nav className="bg-[#1e4d4d] border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-[#0f2828]">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center group" onClick={closeMenu}>
            <div className="w-12 h-12 mr-3 transition-transform group-hover:scale-110">
              <img
                src={logo}
                alt="Logo OverthinkIT"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              OverthinkIT
            </span>
          </NavLink>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={toggleMenu}
            className="lg:hidden inline-flex items-center p-2 ml-3 text-sm text-gray-200 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Tampilan Desktop */}
          <div className="hidden lg:flex lg:items-center lg:order-1 lg:flex-1 lg:justify-center">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 rounded transition-all ${
                      isActive
                        ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                        : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 transition-all ${
                      isActive
                        ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                        : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                    }`
                  }
                >
                  About Us
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/artikel"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 transition-all ${
                      isActive
                        ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                        : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                    }`
                  }
                >
                  Artikel
                </NavLink>
              </li>

              {/* Menu Konsultasi dari kode Anda */}
              <li>
                <NavLink
                  to="/konsultasi"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 transition-all ${
                      isActive
                        ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                        : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                    }`
                  }
                >
                  Konsultasi
                </NavLink>
              </li>

              {/* Menu Chat - hanya tampil jika user sudah login */}
              {token && userInfo && (
                <li>
                  <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 transition-all ${
                        isActive
                          ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                          : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                      }`
                    }
                  >
                    Chat
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          {/* User Menu & Wallet - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:order-2 lg:space-x-4">
            {/* Wallet Button - hanya tampil jika user sudah login */}
            {token && userInfo && (
              <NavLink
                to="/wallet"
                className={({ isActive }) =>
                  `flex items-center space-x-2 py-2 px-4 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <i className="fa-regular fa-solid fa-wallet text-sm"></i>
                <span className="text-sm font-medium">Wallet</span>
              </NavLink>
            )}

            {token && userInfo ? (
              <div className="flex items-center space-x-4">
                {/* User Info dengan Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#5ba8a0] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {userInfo.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-white font-medium text-sm">
                    {userInfo.name}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none transition-all"
                >
                  <i className="fa-solid fa-right-from-bracket text-xs"></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center justify-center space-x-2 border text-white font-medium rounded-lg text-sm px-4 py-2 transition-all ${
                      isActive
                        ? "bg-white/20 border-white"
                        : "border-white/30 hover:bg-white/10 hover:border-white focus:ring-4 focus:ring-[#5ba8a0]/50"
                    }`
                  }
                >
                  <i className="fa-regular fa-user text-sm"></i> 
                  <span>Log In</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `flex items-center justify-center space-x-2 text-white font-medium rounded-lg text-sm px-4 py-2 transition-all border ${
                      isActive
                        ? "bg-[#4a9990] border-[#4a9990]"
                        : "bg-[#5ba8a0] border-[#5ba8a0] hover:bg-[#4a9990] hover:border-[#4a9990] focus:ring-4 focus:ring-[#5ba8a0]/50" 
                    }`
                  }
                >
                  <i className="fa-solid fa-user-plus text-sm"></i>
                  <span>Register</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Menu Mobile */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } lg:hidden w-full lg:order-1 lg:w-auto`}
            id="mobile-menu"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                      isActive
                        ? "text-white bg-[#5ba8a0]"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>

              {/* Menu dari kode Anda */}
              <li>
                <NavLink
                  to="/forums"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                      isActive
                        ? "text-white bg-[#5ba8a0]"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  Forum
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                      isActive
                        ? "text-white bg-[#5ba8a0]"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  About Us
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/artikel"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                      isActive
                        ? "text-white bg-[#5ba8a0]"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  Artikel
                </NavLink>
              </li>

              {/* Menu Konsultasi - Mobile */}
              <li>
                <NavLink
                  to="/konsultasi"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                      isActive
                        ? "text-white bg-[#5ba8a0]"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  Konsultasi
                </NavLink>
              </li>

              {/* Menu Chat - Mobile (hanya untuk logged in users) */}
              {token && userInfo && (
                <li>
                  <NavLink
                    to="/chat"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                        isActive
                          ? "text-white bg-[#5ba8a0]"
                          : "text-gray-200 hover:bg-white/10"
                      }`
                    }
                  >
                    Chat
                  </NavLink>
                </li>
              )}

              {/* Wallet - Mobile (hanya untuk logged in users) */}
              {token && userInfo && (
                <li>
                  <NavLink
                    to="/wallet"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 py-3 px-4 rounded transition-all border-b border-gray-600 ${
                        isActive
                          ? "text-white bg-[#5ba8a0]"
                          : "text-gray-200 hover:bg-white/10"
                      }`
                    }
                  >
                    <i className="fa-regular fa-solid fa-wallet text-sm"></i>
                    <span>Wallet</span>
                  </NavLink>
                </li>
              )}

              {/* User Section - Mobile */}
              <li className="mt-4 pt-4 border-t border-gray-600">
                {token && userInfo ? (
                  <div className="flex flex-col space-y-3 px-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 py-2">
                      <div className="w-10 h-10 bg-[#5ba8a0] rounded-full flex items-center justify-center text-white font-semibold">
                        {userInfo.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{userInfo.name}</p>
                        <p className="text-gray-300 text-sm">{userInfo.email}</p>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="flex items-center justify-center space-x-2 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-3 transition-all"
                    >
                      <i className="fa-solid fa-right-from-bracket text-xs"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 px-4">
                    <NavLink
                      to="/login"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-center space-x-2 text-white font-medium rounded-lg text-sm px-4 py-3 transition-all ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`
                      }
                    >
                      <i className="fa-regular fa-sign-in text-sm"></i>
                      <span>Log In</span>
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-center space-x-2 text-white font-medium rounded-lg text-sm px-4 py-3 transition-all ${
                          isActive
                            ? "bg-[#4a9990]"
                            : "bg-[#5ba8a0] hover:bg-[#4a9990]"
                        }`
                      }
                    >
                      <i className="fa-regular fa-user-plus text-sm"></i>
                      <span>Register</span>
                    </NavLink>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}