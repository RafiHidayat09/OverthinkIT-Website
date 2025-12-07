import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../../_api";
import { articleImageStorage } from "../../../_api";

export default function EditArticles() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    judul: "",
    konten: "",
    kategori: "",
  });
  const [currentGambar, setCurrentGambar] = useState(null);
  const [newGambar, setNewGambar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [penulisId, setPenulisId] = useState(null);

  useEffect(() => {
    // load detail article + profil penulis
    const load = async () => {
      try {
        const [articleRes] = await Promise.all([
          API.get(`/articles/${id}`),
          API.get("/psychologist/psikolog-profile").catch(() => null),
        ]);

        const art = articleRes.data.data;
        setForm({
          judul: art.judul || "",
          konten: art.konten || "",
          kategori: art.kategori || "",
        });
        setCurrentGambar(art.gambar || null);

        //Ambil penulis_id dari artikel yang sudah ada
        setPenulisId(art.penulis_id);

      } catch (err) {
        console.error("Gagal memuat data:", err);
        alert("Gagal memuat data artikel. Cek console untuk detail.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setNewGambar(files[0]);
    } else if (name) {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!penulisId) {
      alert("Profil tidak ditemukan. Pastikan Anda sudah login.");
      return;
    }

    const fd = new FormData();
    fd.append("judul", form.judul);
    fd.append("konten", form.konten);
    fd.append("kategori", form.kategori || "");
    fd.append("penulis_id", penulisId);
    if (newGambar) fd.append("gambar", newGambar);
    fd.append("_method", "PUT");

    try {
      await API.post(`/articles/${id}`, fd);
      navigate("/psikiater/artikel");
    } catch (err) {
      console.error("Gagal memperbarui artikel:", err);
      if (err.response?.status === 422) {
        setErrors(err.response.data.message || err.response.data.errors || "Validasi gagal");
      } else {
        alert("Terjadi kesalahan saat memperbarui. Cek console.");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Memuat data...</div>;
  }

  return (
    <section className="p-6 bg-[#f4faf9] min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-xl">
        <h1 className="text-2xl font-bold mb-6 text-[#163737]">✏️ Edit Artikel</h1>

        {errors && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(errors, null, 2)}</pre>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Judul Artikel</label>
            <input
              name="judul"
              value={form.judul}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Kategori</label>
            <input name="kategori" value={form.kategori} onChange={handleChange} className="w-full border p-3 rounded-xl" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Konten</label>
            <textarea name="konten" value={form.konten} onChange={handleChange} rows={8} className="w-full border p-3 rounded-xl" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Gambar Saat Ini</label>

            {currentGambar ? (
              <img src={`${articleImageStorage}/${currentGambar}`} className="w-32 h-32 object-cover rounded-lg shadow mb-3" alt="current" />
            ) : (
              <p className="text-gray-500">Tidak ada gambar</p>
            )}

            <input type="file" name="gambar" accept="image/*" onChange={handleChange} className="mt-2" />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="px-6 py-3 bg-[#163737] text-white rounded-xl hover:bg-[#0f2a2a]">
              Simpan Perubahan
            </button>

            <button type="button" onClick={() => navigate("/psikiater/artikel")} className="px-4 py-2 border rounded">
              Batal
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
