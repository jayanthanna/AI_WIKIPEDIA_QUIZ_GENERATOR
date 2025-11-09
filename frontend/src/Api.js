const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function generateQuiz(url) {
  const res = await fetch(`${BASE_URL}/generate_quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Server error" }));
    throw err;
  }
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${BASE_URL}/history`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function fetchQuizById(id) {
  const res = await fetch(`${BASE_URL}/quiz/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quiz");
  return res.json();
}

export async function deleteQuiz(id) {
  const res = await fetch(`${BASE_URL}/delete_quiz/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete quiz");
  return res.json();
}
