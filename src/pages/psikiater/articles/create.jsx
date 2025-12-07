import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../_api";

export default function CreateArticles() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    judul: "",
    konten: "",
    kategori: "",
    gambar: null,
  });

  const [penulisId, setPenulisId] = useState(null);
  const [errors, setErrors] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get("/psychologist/psikolog-profile")
      .then((res) => {
        //console.log("HASIL API:", res);

        const id = res.data?.data?.user?.id;
       if (id) setPenulisId(id);
      })
      .catch((err) => {
      console.warn("ERROR API:", err);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar") {
      setFormData({ ...formData, gambar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!penulisId) {
      alert("Profil tidak ditemukan.");
      return;
    }

    const fd = new FormData();
    fd.append("judul", formData.judul);
    fd.append("konten", formData.konten);
    fd.append("kategori", formData.kategori ?? "");
    fd.append("penulis_id", penulisId);
    if (formData.gambar) fd.append("gambar", formData.gambar);
    // Debug: cek isi FormData sebelum submit
  for (let pair of fd.entries()) {
    console.log(pair[0], pair[1]);
  }

    setSubmitting(true);
    try {
      await API.post("/articles", fd); // jangan pakai Content-Type
      navigate("/psikiater/artikel");
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }

    console.log(formData.gambar);

  };

  return (
    <section className="p-6 bg-[#f4faf9] min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-xl">
        <h1 className="text-2xl font-bold mb-6 text-[#163737]">
          📝 Buat Artikel Baru
        </h1>

        {errors && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {JSON.stringify(errors)}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Judul</label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Kategori</label>
            <input
              type="text"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Konten</label>
            <textarea
              name="konten"
              value={formData.konten}
              onChange={handleChange}
              rows={8}
              required
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Gambar</label>
            <input
              type="file"
              name="gambar"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-[#163737] text-white rounded-xl"
          >
            {submitting ? "Menyimpan..." : "Simpan Artikel"}
          </button>
        </form>
      </div>
    </section>
  );
}
