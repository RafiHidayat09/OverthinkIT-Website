import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../_services/auth";

export default function PsychologistNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
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
      <nav className="bg-[#1e4d4d] border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <NavLink to="/psychologist" className="flex items-center group" onClick={closeMenu}>
            <div className="w-10 h-10 mr-3 bg-white rounded-2xl flex items-center justify-center">
              <i className="fas fa-user-md text-[#1e4d4d] text-lg"></i>
            </div>
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              Psikiater Panel
            </span>
          </NavLink>

          {/* Hamburger Menu Button - Mobile */}
          <button
            onClick={toggleMenu}
            className="lg:hidden inline-flex items-center p-2 ml-3 text-sm text-gray-200 rounded-lg hover:bg-white/10"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:order-1 lg:flex-1 lg:justify-center">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/psychologist/dashboard"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 rounded transition-all ${
                      isActive
                        ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                        : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/psychologist/chat"
                  end={false}
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 rounded transition-all ${
                      isActive
                        ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                        : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                    }`
                  }
                >
                  Konsultasi
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/psychologist/schedule"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 rounded transition-all ${
                      isActive
                        ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                        : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                    }`
                  }
                >
                  Jadwal
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/psychologist/earnings"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 rounded transition-all ${
                      isActive
                        ? "text-white bg-[#5ba8a0] lg:bg-transparent lg:text-[#7eb8b0]"
                        : "text-gray-200 hover:bg-white/10 lg:hover:bg-transparent lg:hover:text-[#7eb8b0]"
                    }`
                  }
                >
                  Pendapatan
                </NavLink>
              </li>
            </ul>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:order-2 lg:space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#5ba8a0] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {userInfo?.name?.charAt(0) || 'P'}
              </div>
              <span className="text-white font-medium text-sm">
                {userInfo?.name}
              </span>
            </div>
            
            <NavLink
              to="/psychologist/profile"
              className="text-gray-200 hover:text-white transition-colors"
            >
              <i className="fas fa-cog text-lg"></i>
            </NavLink>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 transition-all"
            >
              <i className="fas fa-sign-out-alt text-xs"></i>
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } lg:hidden w-full lg:order-1 lg:w-auto`}
            id="mobile-menu"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/psychologist/dashboard"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                      isActive
                        ? "text-white bg-[#5ba8a0]"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/psychologist/consultations"
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
              <li>
                <NavLink
                  to="/psychologist/schedule"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                      isActive
                        ? "text-white bg-[#5ba8a0]"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  Jadwal
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/psychologist/earnings"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-all border-b border-gray-600 ${
                      isActive
                        ? "text-white bg-[#5ba8a0]"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  Pendapatan
                </NavLink>
              </li>

              {/* User Section - Mobile */}
              <li className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex flex-col space-y-3 px-4">
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-10 h-10 bg-[#5ba8a0] rounded-full flex items-center justify-center text-white font-semibold">
                      {userInfo?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{userInfo?.name}</p>
                      <p className="text-gray-300 text-sm">Psikiater</p>
                    </div>
                  </div>
                  
                  <NavLink
                    to="/psychologist/profile"
                    onClick={closeMenu}
                    className="flex items-center justify-center space-x-2 text-white bg-gray-700 hover:bg-gray-600 font-medium rounded-lg text-sm px-4 py-3 transition-all"
                  >
                    <i className="fas fa-cog text-sm"></i>
                    <span>Settings</span>
                  </NavLink>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="flex items-center justify-center space-x-2 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-3 transition-all"
                  >
                    <i className="fas fa-sign-out-alt text-sm"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}