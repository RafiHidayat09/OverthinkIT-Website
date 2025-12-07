// src/pages/public/QuizResults.jsx
import { useEffect, useState } from "react";

export default function QuizResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil token dari localStorage
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch("http://localhost:8000/api/quiz-results", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // pastikan user login
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Gagal ambil hasil quiz:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [token]);

  if (loading) {
    return <p>Loading hasil quiz...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (results.length === 0) {
    return <p>Belum ada hasil quiz. Silakan lakukan asesmen terlebih dahulu.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Hasil Quiz Kesehatan Mental</h2>
      <ul>
        {results.map((res) => (
          <li key={res.id} style={{ marginBottom: 15 }}>
            <strong>Tanggal:</strong> {new Date(res.created_at).toLocaleString()}
            <ul>
              <li>Stress: {res.stress}</li>
              <li>Kecemasan: {res.kecemasan}</li>
              <li>Depresi: {res.depresi}</li>
              <li>Burnout: {res.burnout}</li>
              <li>Kualitas Tidur: {res.kualitas_tidur}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
