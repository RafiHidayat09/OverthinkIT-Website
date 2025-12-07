import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showPsikiater } from "../../../_services/psikiater";
import { psikologImageStorage } from "../../../_api";

export default function ShowPsikiater() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [psikiater, setPsikiater] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await showPsikiater(id);
      setPsikiater(data);
    };
    fetchData();
  }, [id]);

  if (!psikiater) {
    return <div className="text-center py-20 text-gray-500">Memuat...</div>;
  }

  const p = psikiater.psikolog_profile;

  return (
    <section className="py-12 bg-[#f4faf9]">
      <div className="max-w-3xl mx-auto px-6">

        <div className="bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
          <button
            onClick={() => navigate("/layanan")}
            className="flex items-center text-[#1e4d4d] hover:text-[#163737] mb-4 group"
          >
          <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-all"></i>
            Kembali
          </button> 
          {/* FOTO + NAMA + SPESIALISASI */}
          <div className="flex flex-col items-center text-center">

            <img
              src={
                p?.foto
                  ? `${psikologImageStorage}/${p.foto}`
                  : "https://via.placeholder.com/300?text=No+Photo"
              }
              alt="Foto Psikiater"
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
            />

            <h1 className="text-3xl font-bold text-[#163737] mt-4">
              {psikiater.name}
            </h1>

            <p className="text-gray-600 mt-1 text-lg">
              {p?.spesialisasi}
            </p>

          </div>

          {/* DETAIL */}
          <div className="mt-10 space-y-4 text-gray-700 leading-relaxed">

            <p>
              <strong className="text-[#163737]">No. STR:</strong> {p?.no_str}
            </p>

            <p>
              <strong className="text-[#163737]">Pengalaman:</strong> {p?.pengalaman}
            </p>

            <p>
              <strong className="text-[#163737]">Deskripsi:</strong>
              <br />
              {p?.deskripsi}
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}
