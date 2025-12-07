import { useState } from "react";
import { API } from "../../../_api";
import { useNavigate } from "react-router-dom";

export default function CreatePsikiater() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    education: "",
    experience: "",
    fee: "",
    bio: "",
  });

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // =============================
  // HANDLER INPUT
  // =============================
  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // HANDLER FOTO
  // =============================
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB");
        return;
      }
      
      // Validasi tipe file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert("Format file harus JPG, JPEG, atau PNG");
        return;
      }

      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // =============================
  // SUBMIT CREATE
  // =============================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!window.confirm("Yakin ingin menambahkan psikiater ini?")) return;

    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });
      
      if (foto) formData.append("avatar", foto);

      await API.post("/admin/psychologists", formData); 

      alert("Psikiater berhasil ditambahkan");
      navigate("/admin/psikiater");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        alert(err.response?.data?.message || "Gagal menambahkan psikiater");
      }
      console.error("Gagal create:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white shadow-lg rounded-xl p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#163737]">Tambah Psikiater</h2>
            <p className="text-sm text-gray-500 mt-1">
              Lengkapi form di bawah untuk menambahkan psikiater baru
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            {/* Foto Preview & Upload */}
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Foto Profil
              </label>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Preview Foto */}
                <div className="flex-shrink-0">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-full border-4 border-gray-300 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-300">
                      <span className="text-gray-400 text-xs text-center">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="inline-block w-full md:w-auto px-6 py-3 bg-[#163737] text-white rounded-lg hover:bg-[#0f2a2a] transition cursor-pointer font-medium text-center"
                  >
                    Pilih Foto
                  </label>
                  
                  {foto && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✓ File dipilih: <span className="font-medium">{foto.name}</span>
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Format: JPG, PNG, JPEG. Maksimal 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={changeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163737]"
                placeholder="Dr. John Doe"
                required
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={changeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163737]"
                placeholder="john.doe@example.com"
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={changeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163737]"
                placeholder="Minimal 6 karakter"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password[0]}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Kosongkan untuk menggunakan password default: <span className="font-medium">password123</span>
              </p>
            </div>


            {/* Spesialisasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spesialisasi
              </label>
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={changeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163737]"
                placeholder="Psikolog Klinis, Psikiater, dll"
              />
              {errors.specialization && (
                <p className="text-red-600 text-sm mt-1">{errors.specialization[0]}</p>
              )}
            </div>

            {/* Pendidikan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pendidikan
              </label>
              <input
                type="text"
                name="education"
                value={form.education}
                onChange={changeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163737]"
                placeholder="S2 Psikologi Klinis, Universitas Indonesia"
              />
            </div>

            {/* Pengalaman */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pengalaman
              </label>
              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={changeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163737]"
                placeholder="10 tahun"
              />
            </div>

            {/* Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biaya Konsultasi (Rp)
              </label>
              <input
                type="number"
                name="fee"
                value={form.fee}
                onChange={changeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163737]"
                placeholder="150000"
                min="0"
              />
            </div>

            {/* Bio / Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / Deskripsi
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={changeHandler}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163737] resize-none"
                placeholder="Deskripsi singkat tentang psikiater..."
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#163737] text-white py-3 rounded-lg hover:bg-[#0f2a2a] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Menyimpan..." : "Tambah Psikiater"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/psikiater")}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}