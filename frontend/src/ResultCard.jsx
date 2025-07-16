import React from "react";

const ResultCard = ({ result }) => {
  const [showFull, setShowFull] = React.useState(false);
  if (!result || result.error) {
    return (
      <div className="mt-4 p-4 border rounded bg-red-50 text-red-700">
        <strong>Error:</strong> {result?.error || "No result data."}
      </div>
    );
  }

  // Support both old and new course_suggestions format
  const renderCourseSuggestions = () => {
    if (
      !result.course_suggestions ||
      Object.keys(result.course_suggestions).length === 0
    ) {
      return <li>No course suggestions found</li>;
    }
    return Object.entries(result.course_suggestions).map(
      ([skill, value], i) => {
        // New Gemini format: { skill: { courses: [...], youtube: [...] } }
        if (typeof value === "object" && (value.courses || value.youtube)) {
          return (
            <li key={i} className="mb-2">
              <div className="font-medium text-blue-700">{skill}</div>
              {value.courses && value.courses.length > 0 && (
                <div className="ml-2">
                  <span className="font-semibold">Courses:</span>
                  <ul className="list-disc ml-5">
                    {value.courses.map((course, idx) => (
                      <li key={idx}>
                        {course.includes("http") ? (
                          <a
                            href={course.split(" - ").pop()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {course.split(" - ")[0] || course}
                          </a>
                        ) : (
                          course
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {value.youtube && value.youtube.length > 0 && (
                <div className="ml-2 mt-1">
                  <span className="font-semibold">YouTube:</span>
                  <ul className="list-disc ml-5">
                    {value.youtube.map((yt, idx) => (
                      <li key={idx}>
                        {yt.includes("http") ? (
                          <a
                            href={yt.split(" - ").pop()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {yt.split(" - ")[0] || yt}
                          </a>
                        ) : (
                          yt
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        }
        // Old format: { skill: "url" }
        return (
          <li key={i}>
            {skill}:{" "}
            {typeof value === "string" && value.startsWith("http") ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Learn More
              </a>
            ) : (
              value
            )}
          </li>
        );
      }
    );
  };

  return (
    <div className="card">
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
      <h3 className="section-title" style={{ marginTop: 8 }}>
        🎯 Analysis Result
      </h3>

      {result.gemini_analysis && (
        <div className="gemini-analysis-card">
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <span style={{ fontSize: 20, marginRight: 8 }}>🤖</span>
            <span style={{ fontWeight: 600, fontSize: "1.08rem" }}>
              Gemini AI Analysis
            </span>
            <button
              className="copy-btn"
              onClick={() =>
                navigator.clipboard.writeText(result.gemini_analysis)
              }
              title="Copy analysis to clipboard"
            >
              Copy
            </button>
          </div>
          <ul
            className="bulleted-list"
            style={{ marginTop: 8, marginBottom: 8, paddingLeft: 18 }}
          >
            {result.gemini_analysis.split(/\n|\r/).map((line, idx) => {
              // Bullet points
              if (/^\s*[-*]\s+/.test(line)) {
                return (
                  <li
                    key={idx}
                    style={{
                      marginBottom: 10,
                      lineHeight: 1.7,
                      background: "#f1f5f9",
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
              // Headings: lines starting with ##, or bolded (**) or ending with :
              if (/^(##|\*\*|\s*\w.*:|\*\*.*\*\*)/.test(line.trim())) {
                return (
                  <li
                    key={idx}
                    style={{
                      marginBottom: 10,
                      lineHeight: 1.7,
                      background: "#e0f2fe",
                      borderRadius: 6,
                      padding: "0.5rem 0.9rem",
                      fontWeight: 700,
                      fontSize: "1.08rem",
                      color: "#0369a1",
                      listStyleType: "disc",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    {line
                      .replace(/^##\s*/, "")
                      .replace(/\*\*/g, "")
                      .replace(/:$/, ":")}
                  </li>
                );
              }
              // Normal lines
              return line.trim() ? (
                <li
                  key={idx}
                  style={{
                    listStyle: "none",
                    marginLeft: 0,
                    marginBottom: 10,
                    lineHeight: 1.7,
                    background: "#f1f5f9",
                    borderRadius: 6,
                    padding: "0.5rem 0.9rem",
                    fontSize: "1.04rem",
                    color: "#0f172a",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {line}
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <span className="section-title" style={{ fontSize: "1rem" }}>
          Match Score:
        </span>{" "}
        {result.match_score}%
      </div>
      <div style={{ marginBottom: 12 }}>
        <span className="section-title" style={{ fontSize: "1rem" }}>
          Email:
        </span>{" "}
        {result.email}
      </div>
      <div style={{ marginBottom: 12 }}>
        <span className="section-title" style={{ fontSize: "1rem" }}>
          Phone:
        </span>{" "}
        {result.phone}
      </div>

      <hr style={{ margin: "1rem 0" }} />

      <h4 className="section-title">✅ Matched Skills</h4>
      <ul className="bulleted-list">
        {result.matched_skills && result.matched_skills.length > 0 ? (
          result.matched_skills.map((skill, i) => <li key={i}>{skill}</li>)
        ) : (
          <li>No matched skills</li>
        )}
      </ul>

      <h4 className="section-title">❌ Missing Skills</h4>
      <ul className="bulleted-list">
        {result.missing_skills && result.missing_skills.length > 0 ? (
          result.missing_skills.map((skill, i) => <li key={i}>{skill}</li>)
        ) : (
          <li>No missing skills</li>
        )}
      </ul>

      <h4 className="section-title">📚 Course & Video Suggestions</h4>
      <ul className="bulleted-list">{renderCourseSuggestions()}</ul>

      {/* Resume Preview removed as per user request */}
    </div>
  );
};

export default ResultCard;
