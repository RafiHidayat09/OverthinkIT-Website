import { useState, useEffect } from "react";
import { quizQuestions } from "../data/quizData";

export default function Quiz({ onComplete, onQuestionChange }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (onQuestionChange) {
      onQuestionChange(current);
    }
  }, [current]);

  const handleSelect = (value) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);

    if (current === quizQuestions.length - 1) {
      onComplete(updated);
    } else {
      setCurrent(current + 1);
    }
  };

  const question = quizQuestions[current];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Pertanyaan {current + 1} dari {quizQuestions.length}
      </h2>

      <p className="text-gray-700 mb-4">{question.text}</p>

      {question.options.map((opt, index) => (
        <button
          key={index}
          onClick={() => handleSelect(opt.value)}
          className="
            w-full text-left px-4 py-3 my-2 rounded-lg border 
            bg-white hover:bg-gray-100 transition-all shadow-sm
          "
        >
          {opt.text}
        </button>
      ))}
    </div>
  );
}
