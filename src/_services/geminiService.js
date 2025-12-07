export async function getMentalHealthTips(scores) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const prompt = `
  Berdasarkan skor berikut:
  - Stress: ${scores.Stress}
  - Kecemasan: ${scores.Kecemasan}
  - Depresi: ${scores.Depresi}

  Berikan **hanya JSON valid**, seperti:
  {
    "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
  }
  Tanpa kata-kata lain di luar JSON.
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) return { tips: ["AI tidak mengembalikan teks."] };

  let clean = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const jsonMatch = clean.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return { tips: ["Format dari tidak dapat dibaca."] };
  }

  clean = jsonMatch[0];

  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error(" PARSE ERROR:", clean);
    return { tips: ["Gagal memproses respon.", e] };
  }
}
