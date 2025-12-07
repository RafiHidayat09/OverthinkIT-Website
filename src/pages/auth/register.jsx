import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../_services/auth";

export default function Register() {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: value.length < 8 ? "Password must be at least 8 characters" : null,
      }));
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (formData.password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      if (!response) throw new Error("Invalid response from server");

      const user = response.user;
      const token = response.token;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      // Support both role systems
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "psychologist" || user.role === "psikiater") {
        navigate("/psychologist");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);

      if (error?.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: error.response?.data?.message || "Registration failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* REGISTER FORM */}
      <section className="bg-[#1a3c3c]/20 py-16 min-h-screen flex items-center">
        <div className="max-w-screen-xl mx-auto px-6 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-md border border-[#1e4d4d]/20 p-8 w-full sm:max-w-md">

            {/* BACK BUTTON */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-[#1e4d4d] hover:text-[#163737] mb-4 group"
            >
              <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-all"></i>
              Kembali ke Beranda
            </button>

            <h1 className="text-3xl font-bold text-[#163737] mb-6 text-center">
              Create an Account
            </h1>

            {errors.submit && (
              <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-lg text-sm mb-4 text-center">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#163737] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-3 border border-[#1e4d4d]/30 rounded-lg focus:ring-2 focus:ring-[#1e4d4d] focus:border-[#1e4d4d] text-[#163737] bg-white transition-all"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#163737] mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full p-3 border border-[#1e4d4d]/30 rounded-lg focus:ring-2 focus:ring-[#1e4d4d] focus:border-[#1e4d4d] text-[#163737] bg-white transition-all"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#163737] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full p-3 border border-[#1e4d4d]/30 rounded-lg focus:ring-2 focus:ring-[#1e4d4d] focus:border-[#1e4d4d] text-[#163737] bg-white transition-all"
                  required
                  minLength={8}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 border border-[#1e4d4d]/50 rounded focus:ring-[#1e4d4d] text-[#1e4d4d] bg-white"
                  />
                </div>
                <label className="ml-2 text-[#163737] text-sm">
                  I agree to the{" "}
                  <span
                    className="underline cursor-pointer text-[#1e4d4d] hover:text-[#163737] font-medium"
                    onClick={() => setShowTerms(true)}
                  >
                    Terms & Conditions
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e4d4d] hover:bg-[#163737] text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#1e4d4d] font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* POPUP TERMS & CONDITIONS */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-[#1e4d4d]/20 max-h-[80vh] overflow-y-auto">
            
            <h2 className="text-xl font-bold text-[#163737] mb-4">
              Terms & Conditions
            </h2>

            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                Dengan menggunakan layanan OverthinkIT, Anda menyetujui bahwa data pribadi Anda 
                akan diproses secara aman dan bertanggung jawab sesuai dengan kebijakan privasi kami.
              </p>
              
              <p>
                Data yang dikumpulkan hanya akan digunakan untuk keperluan peningkatan layanan, 
                personalisasi pengalaman pengguna, dan komunikasi terkait layanan.
              </p>

              <p>
                Kami tidak akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa 
                persetujuan Anda, kecuali jika diwajibkan oleh hukum.
              </p>

              <p>
                Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda. 
                Segala aktivitas yang terjadi under akun Anda menjadi tanggung jawab Anda.
              </p>

              <p>
                Layanan ini ditujukan untuk memberikan dukungan kesehatan mental awal dan 
                tidak menggantikan konsultasi dengan profesional kesehatan mental yang qualified.
              </p>
            </div>

            <button
              onClick={() => setShowTerms(false)}
              className="w-full py-3 mt-6 bg-[#1e4d4d] text-white rounded-lg hover:bg-[#163737] transition-all font-medium"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}