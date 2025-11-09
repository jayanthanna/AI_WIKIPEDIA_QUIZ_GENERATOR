import React, { useState } from "react";

export default function QuizDisplay({ data }) {
  const [mode, setMode] = useState("view");
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const quiz = data.quiz || [];

  const normalize = (text) =>
    text
      ?.replace(/^[A-D]\)\s*/, "")
      .replace(/^(Answer:|Correct:)\s*/i, "")
      .replace(/[^a-z0-9\s]/gi, "")
      .trim()
      .toLowerCase();

  const handleSelect = (idx, value) => {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const submit = () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      const userAns = answers[i];
      if (!userAns) return;

      const cleanUser = normalize(userAns);
      const cleanCorrect = normalize(q.answer);

      if (cleanUser === cleanCorrect) {
        correct++;
      }
    });

    setScore(`${correct} / ${quiz.length}`);
    setSubmitted(true);
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white rounded-lg shadow-lg p-6 transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-700 mb-2">
            {data.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
            {data.summary}
          </p>
        </div>
        <button
          onClick={() => {
            setMode(mode === "view" ? "take" : "view");
            setScore(null);
            setSubmitted(false);
            setAnswers({});
          }}
          className={`mt-3 sm:mt-0 px-4 py-2 rounded-lg font-medium text-white shadow-md transition-all ${
            mode === "view"
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {mode === "view" ? "Take Quiz" : "Back to View"}
        </button>
      </div>

      {/* Quiz List */}
      <div className="space-y-6">
        {quiz.map((q, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-lg transition-shadow"
          >
            <div className="font-semibold mb-3 text-gray-800">
              {i + 1}. {q.question}
            </div>

            {/* VIEW MODE */}
            {mode === "view" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options?.map((opt, idx) => {
                    const isCorrect = normalize(opt) === normalize(q.answer);
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded border transition-all ${
                          isCorrect
                            ? "bg-green-100 border-green-400"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {opt}
                        {isCorrect && (
                          <span className="ml-2 text-green-600 font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm text-gray-600 mt-2 leading-relaxed">
                  <strong>Answer:</strong> {q.answer} <br />
                  <strong>Difficulty:</strong>{" "}
                  <span
                    className={`capitalize ${
                      q.difficulty === "easy"
                        ? "text-green-600"
                        : q.difficulty === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <br />
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </>
            )}

            {/* TAKE MODE */}
            {mode === "take" && (
              <div className="flex flex-col gap-2 mb-3">
                {q.options?.map((opt, idx) => {
                  const selected = answers[i] === opt;
                  const cleanOpt = normalize(opt);
                  const cleanAns = normalize(q.answer);
                  const isCorrect = cleanOpt === cleanAns;

                  let optionColor = "border hover:border-indigo-300";
                  if (submitted) {
                    if (selected && isCorrect)
                      optionColor = "border-green-500 bg-green-50";
                    else if (selected && !isCorrect)
                      optionColor = "border-red-500 bg-red-50";
                    else if (isCorrect)
                      optionColor = "border-green-300 bg-green-50";
                  } else if (selected) {
                    optionColor = "border-indigo-500 bg-indigo-50";
                  }

                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all ${optionColor}`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        value={opt}
                        checked={selected}
                        onChange={() => handleSelect(i, opt)}
                        className="text-indigo-600 focus:ring-indigo-500"
                        disabled={submitted}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit & Score */}
      {mode === "take" && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!submitted && (
            <button
              onClick={submit}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow transition-all"
            >
              Submit Quiz
            </button>
          )}
          {score && (
            <div className="text-lg font-semibold text-gray-700">
              Your Score:{" "}
              <span className="text-indigo-700 font-bold">{score}</span>
            </div>
          )}
        </div>
      )}

      {/* Related Topics */}
      {data.related_topics && (
        <div className="mt-8 border-t pt-4">
          <h3 className="font-semibold text-indigo-700 mb-2">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {data.related_topics.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
