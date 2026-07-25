import { Link } from "react-router-dom";
import { config } from "../config";
import "./Resume.css";

const Resume = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-page-wrapper">
      <div className="resume-navbar">
        <Link to="/" className="back-btn">
          ← Back to Portfolio
        </Link>
        <div className="resume-action-btns">
          <button onClick={handlePrint} className="print-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Save as PDF
          </button>
          <a href="/Sachidananda_Nayak_CV.html" download="Sachidananda_Nayak_CV.html" className="download-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download HTML CV
          </a>
        </div>
      </div>

      <div className="cv-card-container">
        {/* Header */}
        <header className="cv-card-header">
          <div className="cv-header-info">
            <h1>{config.developer.fullName}</h1>
            <p className="cv-title">Cloud Engineer · Full Stack Developer</p>
          </div>
          <div className="cv-contact-pills">
            <div className="cv-pill">
              <span>📍 {config.social.location}</span>
            </div>
            <a href={`mailto:${config.social.email}`} className="cv-pill clickable">
              <span>✉️ {config.social.email}</span>
            </a>
            <a href={`tel:${config.social.phone}`} className="cv-pill clickable">
              <span>📞 {config.social.phone}</span>
            </a>
            <a href={config.contact.linkedin} target="_blank" rel="noreferrer" className="cv-pill clickable">
              <span>🔗 LinkedIn</span>
            </a>
            <a href={config.contact.github} target="_blank" rel="noreferrer" className="cv-pill clickable">
              <span>💻 GitHub</span>
            </a>
          </div>
        </header>

        {/* Main Body */}
        <main className="cv-card-body">
          {/* Professional Summary */}
          <section className="cv-section">
            <h2 className="cv-section-title">Professional Summary</h2>
            <p className="cv-summary-text">{config.developer.description}</p>
          </section>

          {/* Education */}
          <section className="cv-section">
            <h2 className="cv-section-title">Education</h2>
            <div className="cv-edu-list">
              {config.education.map((edu, idx) => (
                <div key={idx} className="cv-edu-box">
                  <div className="cv-edu-header">
                    <div>
                      <h3>{edu.institution}</h3>
                      <p className="cv-edu-degree">{edu.degree} — <span className="cv-score">{edu.score}</span></p>
                    </div>
                    <span className="cv-badge">{edu.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Skills */}
          <section className="cv-section">
            <h2 className="cv-section-title">Technical Skills</h2>
            <div className="cv-skills-grid">
              <div className="cv-skill-card">
                <h4>Cloud & DevOps</h4>
                <div className="cv-tags">
                  {["AWS", "Azure", "Docker", "Terraform", "GitHub Actions", "CI/CD", "Linux", "Git"].map((tool, i) => (
                    <span key={i} className="cv-tag">{tool}</span>
                  ))}
                </div>
              </div>

              <div className="cv-skill-card">
                <h4>Frontend</h4>
                <div className="cv-tags">
                  {["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"].map((tool, i) => (
                    <span key={i} className="cv-tag">{tool}</span>
                  ))}
                </div>
              </div>

              <div className="cv-skill-card">
                <h4>Backend & Database</h4>
                <div className="cv-tags">
                  {["Node.js", "Express.js", "Python (Flask, FastAPI)", "Java", "MongoDB", "MySQL", "PostgreSQL"].map((tool, i) => (
                    <span key={i} className="cv-tag">{tool}</span>
                  ))}
                </div>
              </div>

              <div className="cv-skill-card">
                <h4>Tools & Environment</h4>
                <div className="cv-tags">
                  {["VS Code", "PyCharm", "Git", "GitHub", "Google Colab", "NetBeans", "MS Office", "Photoshop", "Canva"].map((tool, i) => (
                    <span key={i} className="cv-tag">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="cv-section">
            <h2 className="cv-section-title">Featured Projects</h2>
            <div className="cv-projects-list">
              {config.projects.map((proj) => (
                <div key={proj.id} className="cv-project-card">
                  <div className="cv-project-top">
                    <h4>{proj.title}</h4>
                  </div>
                  <p className="cv-tech-stack">{proj.technologies}</p>
                  {proj.bullets ? (
                    <ul className="cv-bullets">
                      {proj.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="cv-project-desc">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="cv-section">
            <h2 className="cv-section-title">Certifications</h2>
            <div className="cv-cert-list">
              {config.certifications.map((cert, idx) => (
                <div key={idx} className="cv-cert-item">
                  <span>● {cert.title}</span>
                  <span className="cv-cert-date">{cert.date}</span>
                </div>
              ))}
            </div>
            <p className="cv-drive-link">
              <strong>Certificate Drive Folder:</strong>{" "}
              <a href={config.certificateDriveLink} target="_blank" rel="noreferrer">
                {config.certificateDriveLink}
              </a>
            </p>
          </section>

          {/* Achievements */}
          <section className="cv-section">
            <h2 className="cv-section-title">Key Achievements</h2>
            <ul className="cv-bullets">
              {config.achievements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Resume;
