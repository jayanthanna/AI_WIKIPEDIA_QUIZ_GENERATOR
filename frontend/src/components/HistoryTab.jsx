import React, { useEffect, useState } from "react";
import { fetchHistory, fetchQuizById } from "../Api";
import Modal from "./Modal";
import QuizDisplay from "./QuizDisplay";

export default function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const h = await fetchHistory();
        setHistory(h);
      } catch {
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openDetails = async (id) => {
    try {
      const data = await fetchQuizById(id);
      setSelectedQuiz(data);
      setModalOpen(true);
    } catch {
      setError("Failed to load quiz details.");
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-700">
        Quiz History
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No quizzes have been generated yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm sm:text-base">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="border p-3">ID</th>
                <th className="border p-3">Title</th>
                <th className="border p-3">URL</th>
                <th className="border p-3">Date</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-indigo-50">
                  <td className="border p-3 text-center">{h.id}</td>
                  <td className="border p-3 font-medium">{h.title}</td>
                  <td className="border p-3 text-blue-600 break-all">
                    {h.url}
                  </td>
                  <td className="border p-3 text-gray-600">
                    {new Date(h.date).toLocaleString()}
                  </td>
                  <td className="border p-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => openDetails(h.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "Are you sure you want to delete this quiz?"
                          )
                        )
                          return;
                        try {
                          await fetch(
                            `http://127.0.0.1:5000/delete_quiz/${h.id}`,
                            { method: "DELETE" }
                          );
                          setHistory((prev) =>
                            prev.filter((q) => q.id !== h.id)
                          );
                        } catch (err) {
                          alert("Failed to delete quiz");
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedQuiz ? (
          <QuizDisplay data={selectedQuiz} />
        ) : (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        )}
      </Modal>
    </section>
  );
}
