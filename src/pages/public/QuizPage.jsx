import { useNavigate } from "react-router-dom";
import { quizQuestions } from "../../data/quizData";
import Quiz from "../../components/Quiz";
import { useState } from "react";

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleComplete = (answers) => {
    const categoryScores = {};

    quizQuestions.forEach((q, i) => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = 0;
      }
      categoryScores[q.category] += answers[i];
    });

    navigate("/result", { state: { scores: categoryScores } });
  };

  return (
    <div className="min-h-screen bg-[#1a3c3c]/20 flex items-center justify-center px-4 py-10">
      
      {/* Card utama */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden border border-[#1e4d4d]/20">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#163737] text-center">
            Asesmen Kesehatan Mental
          </h1>
          <p className="text-gray-600 text-center text-sm mt-1">
            Jawab pertanyaan berikut dengan jujur agar hasil lebih akurat
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
              backgroundColor: "#1e4d4d", // hijau gelap tenang
            }}
          ></div>
        </div>

        {/* Box Quiz */}
        <div className="bg-[#e9f4f2] border border-[#1e4d4d]/20 rounded-xl p-6 shadow-inner">
          <Quiz
            onComplete={handleComplete}
            onQuestionChange={(index) => setCurrentIndex(index)}
          />
        </div>

        {/* Footer / Info */}
        <div className="text-center text-sm text-gray-500 mt-6">
          Semua jawaban bersifat rahasia dan hanya digunakan untuk rekomendasi.
        </div>
      </div>
    </div>
  );
}
