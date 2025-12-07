import { useEffect, useState } from "react";
import { API } from "../../../_api";

export default function UserIndex() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await API.get("admin/users");
      setData(res.data.data || []);
    } catch (err) {
      console.error("Gagal load users:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await API.delete(`admin/users/${id}`);
      loadData();
    } catch (err) {
      console.error("Gagal hapus user:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = data.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-gray-100 py-12 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6">
        
        <h1 className="text-3xl font-bold text-[#163737] mb-8">
          Manajemen User
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau email..."
          className="w-full max-w-xl px-4 py-3 mb-6 rounded-lg border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Bergabung</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">Memuat...</td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Tidak ada user ditemukan.
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
