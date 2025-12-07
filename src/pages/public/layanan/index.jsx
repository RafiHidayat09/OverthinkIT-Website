import { useEffect, useState } from "react";
import { getAllPsikiater } from "../../../_services/psikiater";
import { Link } from "react-router-dom";
import { psikologImageStorage } from "../../../_api";

export default function LayananPsikiater() {
  const [psikiaters, setPsikiaters] = useState([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPsikiater();
      setPsikiaters(data);

      const uniqueSpecialties = [
        ...new Set(
          data
            .map((p) => p.psikolog_profile?.spesialisasi)
            .filter((s) => s && s.trim() !== "")
        ),
      ];

      setSpecialties(uniqueSpecialties);
    };

    fetchData();
  }, []);

  const filtered = psikiaters.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const spec = p.psikolog_profile?.spesialisasi?.toLowerCase() || "";
    const specialtyMatch =
      specialty === "all" ? true : spec === specialty.toLowerCase();
    return nameMatch && specialtyMatch;
  });

  return (
    <section className="bg-[#1a3c3c]/20 py-16">
      <div className="max-w-screen-xl mx-auto px-6 flex-1">

        <h1 className="text-3xl font-bold text-[#163737] mb-10 text-center">
          Daftar Psikiater
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">

          <input
            type="text"
            placeholder="Cari psikiater berdasarkan nama..."
            className="w-full sm:w-96 px-5 py-3 rounded-2xl border border-[#1e4d4d]/30 
                       focus:ring-2 focus:ring-[#1e4d4d]/40 bg-white 
                       text-gray-700 shadow-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-full sm:w-60 px-4 py-3 rounded-2xl border border-[#1e4d4d]/30 
                       bg-white text-gray-700 focus:ring-2 
                       focus:ring-[#1e4d4d]/40 shadow-sm"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            <option value="all">Semua Spesialisasi</option>
            {specialties.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* LIST */}
        <div className="space-y-6">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <Link
                to={`/layanan/show/${p.id}`}
                key={p.id}
                className="flex items-center gap-6 bg-white rounded-xl border border-[#1e4d4d]/25 
                           p-6 shadow hover:shadow-lg hover:border-[#1e4d4d]/40 
                           transition-all duration-300"
              >
                {/* Foto */}
                <img
                  src={
                    p.psikolog_profile?.foto
                      ? `${psikologImageStorage}/${p.psikolog_profile.foto}`
                      : "https://via.placeholder.com/150?text=No+Photo"
                  }
                  alt={p.name}
                  className="w-20 h-20 rounded-full object-cover border border-[#1e4d4d]/30 shadow-sm"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#163737]">
                    {p.name}
                  </h2>

                  <p className="text-sm text-gray-600 mt-1">
                    {p.psikolog_profile?.spesialisasi ||
                      "Spesialisasi tidak tersedia"}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    Klik untuk melihat detail →
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600">
              Tidak ada psikiater ditemukan.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
