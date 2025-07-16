import React from "react";
import UploadForm from "./uploadform";
import BulletEnhancer from "./bulletenhancer";

const App = () => {
  return (
    <div className="app-bg">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="app-title">AI Resume Analyzer</h1>
          <span className="powered-by">Powered by Gemini AI</span>
        </div>
      </nav>

      <main className="main-container">
        {/* Resume Upload & Analysis */}
        <section className="section-card">
          <h2
            className="section-title"
            style={{ fontSize: "1.25rem", marginBottom: 16 }}
          >
            Analyze Your Resume
          </h2>
          <UploadForm />
        </section>

        {/* Bullet Enhancer */}
        <section className="section-card">
          <h2
            className="section-title"
            style={{ fontSize: "1.25rem", marginBottom: 16 }}
          >
            Enhance a Resume Bullet
          </h2>
          <BulletEnhancer />
        </section>
      </main>
      {/* Footer */}
      <footer
        style={{
          width: "100%",
          textAlign: "center",
          padding: "1.2rem 0 1.5rem 0",
          color: "#64748b",
          fontSize: "1.05rem",
          letterSpacing: "0.5px",
          background: "transparent",
        }}
      >
        Made with ❤️ by Nishtha
      </footer>
    </div>
  );
};

export default App;
