import React, { useState } from "react";
import { analyzeResume } from "./api";
import ResultCard from "./ResultCard";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file || !jd) {
      setError("Please provide both resume and job description.");
      return;
    }
    setLoading(true);
    try {
      const data = await analyzeResume(file, jd);
      setResult(data);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div
        className="section-card"
        style={{ maxWidth: 600, margin: "2rem auto" }}
      >
        <h2
          className="app-title"
          style={{
            fontSize: "2.1rem",
            marginBottom: 0,
            marginTop: 0,
            textAlign: "center",
          }}
        >
          AI Resume Analyzer
        </h2>
      </div> */}
      <div
        className="section-card"
        style={{ maxWidth: 600, margin: "2rem auto" }}
      >
        {/* <h3 className="section-title" style={{ marginBottom: 18 }}>
          Analyze your resume
        </h3> */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label
              className="section-title"
              style={{ fontSize: "1rem", marginBottom: 6 }}
            >
              Resume File (.pdf, .docx)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.docx"
              className="input-textarea"
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                marginTop: 6,
                fontSize: "1rem",
              }}
              disabled={loading}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              className="section-title"
              style={{ fontSize: "1rem", marginBottom: 6 }}
            >
              Job Description
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste job description here..."
              rows={6}
              className="input-textarea"
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                marginTop: 6,
                fontSize: "1rem",
                resize: "vertical",
              }}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="copy-btn"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1.2rem",
              fontWeight: 500,
              fontSize: "1rem",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginBottom: 10,
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center" }}>
                <span
                  className="spinner"
                  style={{
                    marginRight: 8,
                    width: 18,
                    height: 18,
                    border: "2px solid #fff",
                    borderTop: "2px solid #2563eb",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 1s linear infinite",
                  }}
                ></span>
                Analyzing...
              </span>
            ) : (
              "Analyze"
            )}
          </button>
          {error && (
            <div
              style={{
                color: "#dc2626",
                background: "#fee2e2",
                borderRadius: 6,
                padding: "0.7rem 1rem",
                marginTop: 10,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}
        </form>
      </div>
      {result && <ResultCard result={result} />}
    </>
  );
};

export default UploadForm;
