import React, { useState } from "react";
import { generateQuiz } from "../Api";
import QuizDisplay from "./QuizDisplay";

export default function GenerateQuizTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setQuizData(null);

    if (!url.trim()) return setError("Please enter a valid Wikipedia URL.");

    setLoading(true);
    try {
      const data = await generateQuiz(url.trim());
      setQuizData(data);
    } catch (err) {
      setError(err.error || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-700">
        Generate Quiz
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="https://en.wikipedia.org/wiki/Cricket"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow border rounded-md p-3 focus:ring-2 focus:ring-indigo-400 outline-none text-sm sm:text-base"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-md transition-all disabled:opacity-60"
        >
          {loading ? "Generating...🧐" : "Generate 🚀"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {quizData ? (
        <QuizDisplay data={quizData} />
      ) : (
        !loading && (
          <div className="text-gray-500 text-center italic">
            Enter a Wikipedia link and click “Generate” to create your quiz.
          </div>
        )
      )}
    </section>
  );
}
