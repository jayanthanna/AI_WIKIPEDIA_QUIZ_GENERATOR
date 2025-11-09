import React, { useState } from "react";
import GenerateQuizTab from "./components/GenerateQuizTab";
import HistoryTab from "./components/HistoryTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-gray-800">
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            AI Wiki Quiz Generator
          </h1>
          <nav className="mt-3 sm:mt-0 flex gap-3">
            <button
              onClick={() => setActiveTab("generate")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "generate"
                  ? "bg-white text-indigo-700 shadow"
                  : "hover:bg-indigo-600 hover:text-white"
              }`}
            >
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-white text-indigo-700 shadow"
                  : "hover:bg-indigo-600 hover:text-white"
              }`}
            >
              History
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        {activeTab === "generate" ? <GenerateQuizTab /> : <HistoryTab />}
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} --Quiz Generator
      </footer>
    </div>
  );
}
