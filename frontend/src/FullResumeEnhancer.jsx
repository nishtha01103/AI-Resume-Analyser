import React, { useState } from "react";
import axios from "axios";

const FullResumeEnhancer = () => {
  const [text, setText] = useState("");
  const [improved, setImproved] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleImprove = async () => {
    setError("");
    if (!text.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    setLoading(true);
    setImproved("");
    setCopied(false);
    try {
      const res = await axios.post("http://localhost:5000/improve-full", {
        resume_text: text,
      });
      setImproved(res.data.improved_resume);
    } catch (err) {
      console.error(err);
      setError("Failed to enhance resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (improved) {
      navigator.clipboard.writeText(improved);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="mt-10 p-4 max-w-2xl mx-auto bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-2">
        🧠 Full Resume Enhancer (Gemini)
      </h2>
      <p className="mb-3 text-gray-600 text-sm">
        Paste your full resume text below and let Gemini AI rewrite it to be
        more professional, concise, and impactful.
      </p>

      <textarea
        rows={10}
        className="w-full p-3 border rounded mb-3"
        placeholder="Paste your full resume text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleImprove}
        className={`bg-purple-600 text-white px-4 py-2 rounded ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Improving...
          </span>
        ) : (
          "Improve with AI"
        )}
      </button>

      {error && (
        <div className="text-red-600 bg-red-100 rounded px-3 py-2 mt-3">
          {error}
        </div>
      )}

      {improved && (
        <div className="mt-6 bg-gray-100 p-4 rounded relative">
          <h3 className="font-semibold mb-2 flex items-center">
            🔍 Improved Resume
            <button
              onClick={handleCopy}
              className="ml-3 text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-700"
              title="Copy to clipboard"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </h3>
          <pre className="whitespace-pre-wrap text-gray-800 text-sm max-h-96 overflow-auto">
            {improved}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FullResumeEnhancer;
