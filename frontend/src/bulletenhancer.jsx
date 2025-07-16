import React, { useState } from "react";
import axios from "axios";

const BulletEnhancer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const enhanceBullet = async () => {
    if (!input) return alert("Please enter a bullet point");
    setLoading(true);
    setOutput("");

    try {
      const res = await axios.post("http://localhost:8000/enhance", {
        bullet: input,
      });

      setOutput(res.data.improved || "No response");
    } catch (err) {
      console.error(err);
      alert("Error contacting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="section-card"
      style={{ maxWidth: 600, margin: "2rem auto" }}
    >
      <h2 className="section-title" style={{ marginBottom: 18 }}>
        ✨ AI Resume Bullet Enhancer (Gemini)
      </h2>
      <textarea
        rows={4}
        placeholder="Enter a bullet point from your resume..."
        className="input-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          padding: "0.7rem 1rem",
          borderRadius: 6,
          border: "1px solid #cbd5e1",
          marginBottom: 14,
          fontSize: "1rem",
          resize: "vertical",
        }}
      />
      <button
        onClick={enhanceBullet}
        className="copy-btn"
        style={{
          background: "#22c55e",
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
        {loading ? "Enhancing..." : "Enhance with AI"}
      </button>

      {output && (
        <div
          style={{
            marginTop: 24,
            background: "#f1f5f9",
            borderRadius: 8,
            padding: "1rem 1.2rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h4
            className="section-title"
            style={{ fontSize: "1.05rem", marginBottom: 8 }}
          >
            Improved Version:
          </h4>
          {/* Render output as bullet points if multiple, else as paragraph */}
          {output.match(/^\s*[-*]/m) || output.includes("\n") ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {output
                .split(/\n|\r/)
                .filter((line) => line.trim())
                .map((line, idx) => {
                  if (/^\s*[-*]\s+/.test(line)) {
                    return (
                      <li
                        key={idx}
                        style={{
                          marginBottom: 10,
                          lineHeight: 1.7,
                          background: "#fff",
                          borderRadius: 6,
                          padding: "0.5rem 0.9rem",
                          fontSize: "1.04rem",
                          color: "#0f172a",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        }}
                      >
                        {line.replace(/^\s*[-*]\s+/, "")}
                      </li>
                    );
                  }
                  return (
                    <li
                      key={idx}
                      style={{
                        listStyle: "none",
                        marginLeft: 0,
                        marginBottom: 10,
                        lineHeight: 1.7,
                        background: "#fff",
                        borderRadius: 6,
                        padding: "0.5rem 0.9rem",
                        fontSize: "1.04rem",
                        color: "#0f172a",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      }}
                    >
                      {line}
                    </li>
                  );
                })}
            </ul>
          ) : (
            <p style={{ color: "#0f172a", fontSize: "1.05rem", marginTop: 4 }}>
              {output}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BulletEnhancer;
