import { useEffect, useState } from "react";
import { API } from "../../../_api";
import { Link } from "react-router-dom";
import { psikologImageStorage } from "../../../_api";

export default function PsikiaterIndex() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all psychologists (admin)
  const loadData = async () => {
    try {
      const res = await API.get("/admin/psychologists"); // ✅ Ubah ke /admin/psychologists
      console.log("Data dari API:", res.data.data);
      setData(res.data.data || []);
    } catch (err) {
      console.error("Gagal load psikiater:", err);
      alert("Gagal memuat data psikiater");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete psychologist
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus psikiater ini?")) return;
    
    try {
      await API.delete(`/admin/psychologists/${id}`);
      alert("Psikiater berhasil dihapus");
      loadData();
    } catch (err) {
      console.error("Gagal menghapus psikiater:", err);
      alert("Gagal menghapus psikiater");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = data.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-gray-100 py-12 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#163737]">
            Manajemen Psikiater
          </h1>

          <Link
            to="/admin/psikiater/create"
            className="px-4 py-2 bg-[#163737] text-white rounded-lg hover:bg-[#0f2a2a] transition"
          >
            + Tambah Psikiater
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari psikiater berdasarkan nama..."
            className="w-full max-w-xl px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#163737]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">Foto</th>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">STR</th>
                <th className="px-4 py-3 text-left font-semibold">Spesialisasi</th>
                <th className="px-4 py-3 text-left font-semibold">Pengalaman</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#163737]"></div>
                      <span className="ml-3">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-center">
                      {p.user?.avatar ? (
                        <img
                          src={`${psikologImageStorage}/${p.user.avatar}`}
                          alt={`Foto ${p.name}`}
                          className="w-14 h-14 object-cover rounded-full border-2 border-gray-300 mx-auto"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-gray-400 text-xs">No Photo</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {p.name || "Tanpa Nama"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {p.no_str || "-"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {p.specialization || "-"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {p.experience || "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-4">
                        <Link
                          to={`/admin/psikiater/edit/${p.id}`}
                          className="text-green-600 hover:text-green-800 hover:underline font-medium transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800 hover:underline font-medium transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    {search ? (
                      <>Tidak ada psikiater ditemukan dengan nama "{search}"</>
                    ) : (
                      <>Belum ada data psikiater.</>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Total */}
        {!loading && filtered.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filtered.length} dari {data.length} psikiater
          </div>
        )}
      </div>
    </section>
  );
}