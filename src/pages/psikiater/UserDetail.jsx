import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserDetail() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await fetch(`http://localhost:8000/api/quiz-results/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchResult();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!result) return <p>Data tidak ditemukan.</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold">{result.user.name}</h2>
      <p>Email: {result.user.email}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>Stress: {result.stress}</div>
        <div>Kecemasan: {result.kecemasan}</div>
        <div>Depresi: {result.depresi}</div>
        <div>Burnout: {result.burnout}</div>
        <div>Kualitas Tidur: {result.kualitas_tidur}</div>
      </div>
      <h3 className="text-xl font-semibold mt-4">Tips AI</h3>
      <ul className="list-disc pl-5">
        {result.ai_tips?.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
