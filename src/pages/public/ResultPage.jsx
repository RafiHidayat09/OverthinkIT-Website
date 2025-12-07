import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMentalHealthTips } from "../../_services/geminiService";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const scores = location.state?.scores;

  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Untuk animasi progress-bar
  const [animatedWidths, setAnimatedWidths] = useState({});

  // ICON SETUP - Menggabungkan semua kategori dari kedua versi
  const getCategoryIconClass = (category) => {
    switch (category.toLowerCase()) {
      case "stress":
        return "fas fa-brain";
      case "kecemasan":
        return "fas fa-face-frown";
      case "depresi":
        return "fas fa-heart-pulse";
      case "burnout":
        return "fas fa-fire";
      case "kualitas tidur":
        return "fas fa-moon";
      default:
        return "fas fa-leaf";
    }
  };

  // WARNA ICON + PROGRESS - Warna berbeda untuk setiap kategori
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "stress":
        return "#e63946";
      case "kecemasan":
        return "#ff9f1c";
      case "depresi":
        return "#457b9d";
      case "burnout":
        return "#d00000";
      case "kualitas tidur":
        return "#7209b7";
      default:
        return "#1e4d4d";
    }
  };

  // --- LOAD AI TIPS ---
  useEffect(() => {
    if (!scores) return;

    async function loadAI() {
      try {
        const result = await getMentalHealthTips(scores);
        setTips(result.tips || []);
      } catch (err) {
        console.error("Gagal mengambil tips AI:", err);
      }
      setLoading(false);
    }

    loadAI();
  }, [scores]);

  // --- ANIMASI PROGRESS BAR ---
  useEffect(() => {
    if (!scores) return;

    // Hitung target width (mendukung skala 0-5 atau 0-3)
    const targetWidths = {};
    Object.entries(scores).forEach(([cat, value]) => {
      // Normalisasi ke persentase (asumsi skor maksimal 5)
      const maxScore = 5;
      targetWidths[cat] = (value / maxScore) * 100;
    });

    // Gunakan requestAnimationFrame agar tidak dianggap synchronous update
    requestAnimationFrame(() => {
      // Set awal 0%
      setAnimatedWidths(
        Object.fromEntries(Object.keys(targetWidths).map((cat) => [cat, 0]))
      );

      // Delay sedikit agar transisi terlihat
      setTimeout(() => {
        requestAnimationFrame(() => {
          setAnimatedWidths(targetWidths);
        });
      }, 150);
    });
  }, [scores]);

  // Jika tidak ada skor (langsung akses halaman)
  if (!scores) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a3c3c]/20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <p className="text-[#163737] font-medium mb-4">
            Belum ada data asesmen.<br />Silakan mulai quiz terlebih dahulu.
          </p>

          <button
            onClick={() => navigate("/quiz")}
            className="px-6 py-2 bg-[#1e4d4d] text-white rounded-full shadow-md hover:bg-[#163f3f] transition-all flex items-center gap-2"
          >
            <i className="fas fa-redo"></i>
            Mulai Quiz
          </button>
        </div>
      </div>
    );
  }

  // Konversi ke array supaya mudah dirender
  const scoreArray = Object.entries(scores).map(([category, value]) => ({
    category,
    value,
  }));

  return (
    <div className="min-h-screen bg-[#1a3c3c]/20 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10 border border-[#1e4d4d]/20">
        <h1 className="text-3xl font-bold text-[#163737] text-center mb-6">
          Hasil Asesmen Kesehatan Mental
        </h1>

        <p className="text-center text-gray-600 max-w-xl mx-auto mb-10">
          Berikut adalah rekap penilaian berdasarkan jawabanmu.
        </p>

        {/* SCORE CARDS DENGAN ANIMASI */}
        <div className="space-y-5">
          {scoreArray.map((item, index) => {
            const color = getCategoryColor(item.category);

            return (
              <div
                key={index}
                className="bg-[#e9f4f2] px-6 py-4 rounded-xl border border-[#1e4d4d]/20 shadow-inner flex items-center gap-4"
              >
                <i
                  className={`${getCategoryIconClass(item.category)} text-2xl`}
                  style={{ color }}
                ></i>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#163737]">
                    {item.category}
                  </h2>

                  {/* ANIMATED PROGRESS BAR */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${animatedWidths[item.category] || 0}%`,
                        backgroundColor: color,
                        transition: "width 1.2s ease",
                      }}
                    ></div>
                  </div>

                  <p className="text-gray-700 mt-2">
                    Skor: <span className="font-semibold">{item.value}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI TIPS */}
        <h2 className="text-2xl font-bold text-[#163737] mt-12 mb-4">
          Rekomendasi
        </h2>

        <div className="bg-[#eef7f6] border border-[#1e4d4d]/20 p-6 rounded-xl shadow-inner">
          {loading ? (
            <p className="text-gray-600 italic">Mengambil saran...</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="text-[#163737]">
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigate("/quiz")}
            className="px-6 py-2.5 bg-[#1e4d4d] text-white rounded-full shadow-md hover:bg-[#163f3f] transition-all flex items-center gap-2"
          >
            <i className="fas fa-redo text-sm"></i>
            <span>Ulangi Asesmen</span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-white border border-[#1e4d4d]/40 text-[#1e4d4d] rounded-full shadow hover:bg-[#eef7f6] transition-all flex items-center gap-2"
          >
            <i className="fas fa-home text-sm"></i>
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
}