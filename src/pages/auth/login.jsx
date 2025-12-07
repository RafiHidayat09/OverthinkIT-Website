import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, useDecodeToken, redirectToGoogleAuth, handleGoogleCallback } from "../../_services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingGoogle, setProcessingGoogle] = useState(false);

  const token = localStorage.getItem("accessToken");
  const decodedData = useDecodeToken(token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await login(formData);
      localStorage.setItem("accessToken", response.token);
      localStorage.setItem("userInfo", JSON.stringify(response.user));

      // Support both role systems
      if (response.user.role === "admin") {
        navigate("/admin");
      } else if (response.user.role === "psychologist" || response.user.role === "psikiater") {
        navigate("/psychologist");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    setError(null);
    redirectToGoogleAuth();
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    if (token && decodedData?.success) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const role = userInfo.role;

      console.log("Already logged in, redirecting...", role);

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "psychologist" || role === "psikiater") {
        navigate("/psychologist", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [token, decodedData, navigate]);

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasGoogleCallback = urlParams.get('token') || urlParams.get('success');
    
    if (hasGoogleCallback) {
      setProcessingGoogle(true);
      setError(null);
      
      console.log("Processing Google OAuth callback...");
      
      const result = handleGoogleCallback();
      
      if (result.success && result.user) {
        console.log("Google login successful:", result.user);
        
        // Redirect based on role setelah delay singkat
        setTimeout(() => {
          const userRole = result.user.role;
          
          if (userRole === "admin") {
            navigate("/admin", { replace: true });
          } else if (userRole === "psychologist" || userRole === "psikiater") {
            navigate("/psychologist", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 500);
      } else {
        console.error("Google login failed:", result.error);
        setError(result.error || "Google authentication failed");
        setProcessingGoogle(false);
        
        // Clear URL parameters setelah error
        navigate("/login", { replace: true });
      }
    }
  }, [navigate]);

  if (processingGoogle) {
    return (
      <section className="bg-[#1a3c3c]/20 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-[#1e4d4d]/20 shadow-lg rounded-3xl p-10 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4d4d] mx-auto mb-4"></div>
          <p className="text-[#163737]">
            Processing Google login...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#1a3c3c]/20 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border border-[#1e4d4d]/20 shadow-lg rounded-3xl p-10 w-full max-w-md">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-[#1e4d4d] hover:text-[#163737] mb-4 group"
        >
          <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-all"></i>
          Kembali ke Beranda
        </button>

        <h1 className="text-3xl font-bold text-[#163737] text-center mb-6">
          Login to OverthinkIT
        </h1>

        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl text-sm px-5 py-3 text-center mb-6 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <div className="px-3 text-gray-500 text-sm">or</div>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#163737] mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full p-3 rounded-xl border border-[#1e4d4d]/30 focus:ring-2 
                         focus:ring-[#1e4d4d] focus:outline-none text-[#163737] bg-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#163737] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-[#1e4d4d]/30 focus:ring-2 
                         focus:ring-[#1e4d4d] focus:outline-none text-[#163737] bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1e4d4d] text-white p-3 rounded-xl font-semibold 
                       hover:bg-[#163737] transition-all shadow-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#1e4d4d] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}