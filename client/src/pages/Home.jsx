import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const modules = [
  { icon: "📄", label: "PDFs" },
  { icon: "🖼️", label: "Images" },
  { icon: "🔗", label: "Links" },
  { icon: "💻", label: "Code" },
  { icon: "✅", label: "Tasks" },
  { icon: "👥", label: "Members" },
];

export default function Home() {
  return (
    <div className="home">
      <nav className="home-nav">
        <span className="home-brand">SyncDoc</span>
        <div className="home-nav-links">
          <Link to="/login">Log in</Link>
          <Link to="/register" className="home-nav-cta">Get started</Link>
        </div>
      </nav>

      <section className="home-hero">
        <h1 className="home-title">SyncDoc</h1>
        <p className="home-tagline">One workspace. Everything your team needs.</p>
        <div className="home-hero-actions">
          <Link to="/register" className="home-btn-primary">Create a workspace</Link>
          <Link to="/login" className="home-btn-ghost">Log in</Link>
        </div>
      </section>

      <section className="home-modules">
        {modules.map((m) => (
          <div className="home-module-chip" key={m.label}>
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </div>
        ))}
      </section>

      <footer className="home-footer">
        SyncDoc &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}