// src/components/Results.jsx

import { useEffect, useState } from "react";
import { getMentalHealthTips } from "../_services/geminiService";

export default function Results({ scores, onRestart }) {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    async function loadTips() {
      const result = await getMentalHealthTips(scores);
      setTips(result.tips || []);
    }
    loadTips();
  }, [scores]); // Added scores dependency

  return (
    <div style={{ padding: 20 }}>
      <h2>Hasil Assessment</h2>

      <ul>
        {Object.entries(scores).map(([cat, score]) => (
          <li key={cat}>
            <strong>{cat}:</strong> {score}
          </li>
        ))}
      </ul>

      <h3>Saran dari AI</h3>
      <ul>
        {tips.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>

      <button onClick={onRestart}>Mulai Lagi</button>
    </div>
  );
}