import { useEffect, useState } from "react";
import { API } from "../../../_api";
import { Link } from "react-router-dom";
import { articleImageStorage } from "../../../_api";

export default function PsikiaterArticles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // fetch articles
  const fetchArticles = async () => {
    try {
      const res = await API.get("/articles");
      setArticles(res.data.data || []);
    } catch (error) {
      console.error("Gagal memuat artikel:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // pakai fungsi async di dalam effect agar tidak memicu warning
    const load = async () => {
      await fetchArticles();
    };
    load();
  }, []);

  const filtered = articles.filter((item) =>
    (item.judul || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await API.delete(`/articles/${id}`);
      await fetchArticles();
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Gagal menghapus artikel. Cek console untuk detail.");
    }
  };

  return (
    <section className="bg-gray-100 py-12 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#163737]">Manajemen Artikel Psikologi</h1>

          <Link
            to="/psikiater/artikel/create"
            className="px-4 py-2 bg-[#163737] text-white rounded-lg hover:bg-[#0f2a2a]"
          >
            + Tambah Artikel
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari artikel berdasarkan judul..."
            className="w-full max-w-xl px-4 py-3 rounded-lg border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Gambar</th>
                <th className="px-4 py-3 text-left font-semibold">Judul</th>
                <th className="px-4 py-3 text-left font-semibold">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    Memuat...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((a) => (
                  <tr key={a.article_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <img
                        src={a.gambar ? `${articleImageStorage}/${a.gambar}` : "https://via.placeholder.com/80"}
                        alt="thumbnail"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </td>

                    <td className="px-4 py-2 font-medium">{a.judul}</td>
                    <td className="px-4 py-2">{a.kategori || "-"}</td>
                    <td className="px-4 py-2">{a.tanggal ? new Date(a.tanggal).toLocaleDateString() : "-"}</td>

                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-3">
                       

                        <Link to={`/psikiater/artikel/edit/${a.article_id}`} className="text-green-600 hover:underline">
                          Edit
                        </Link>

                        <button onClick={() => handleDelete(a.article_id)} className="text-red-600 hover:underline">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    Tidak ada artikel ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
