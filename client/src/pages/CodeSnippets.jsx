import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useWorkspace } from "./WorkspaceLayout";
import Modal from "../components/Modal";
import {
  getSnippetsRequest,
  createSnippetRequest,
  updateSnippetRequest,
  deleteSnippetRequest,
} from "../services/contentAPI";
import "./CodeSnippets.css";

const languages = ["JavaScript", "Python", "Java", "C++", "SQL", "TypeScript", "HTML", "CSS"];

export default function CodeSnippets() {
  const { workspace } = useWorkspace();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", language: "JavaScript", code: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadSnippets = async () => {
    try {
      const { data } = await getSnippetsRequest(workspace._id);
      setSnippets(data.snippets);
    } catch (err) {
      console.error("Failed to load snippets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnippets();
  }, [workspace._id]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", language: "JavaScript", code: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (snippet) => {
    setEditingId(snippet._id);
    setForm({ title: snippet.title, language: snippet.language, code: snippet.code });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editingId) {
        await updateSnippetRequest(workspace._id, editingId, form);
      } else {
        await createSnippetRequest(workspace._id, form);
      }
      setShowModal(false);
      loadSnippets();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save snippet.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (snippetId) => {
    if (!window.confirm("Delete this snippet?")) return;
    try {
      await deleteSnippetRequest(workspace._id, snippetId);
      setSnippets((prev) => prev.filter((s) => s._id !== snippetId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete snippet.");
    }
  };

  return (
    <div className="snippets-page">
      <div className="snippets-header">
        <div>
          <h1>Code</h1>
          <p className="snippets-sub">Share snippets with syntax highlighting, no Git needed.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + New snippet
        </button>
      </div>

      {loading && <p className="snippets-empty">Loading snippets...</p>}

      {!loading && snippets.length === 0 && (
        <div className="snippets-empty-state">
          <h3>No snippets yet</h3>
          <p>Save reusable code, configs, or queries your team needs.</p>
          <button className="btn btn-primary" onClick={openCreate}>
            + New snippet
          </button>
        </div>
      )}

      {!loading && snippets.length > 0 && (
        <div className="snippets-list">
          {snippets.map((snippet) => (
            <div className="snippet-card" key={snippet._id}>
              <div className="snippet-card-header">
                <div>
                  <h4>{snippet.title}</h4>
                  <span className="snippet-lang">{snippet.language}</span>
                </div>
                <div className="snippet-actions">
                  <button onClick={() => openEdit(snippet)}>Edit</button>
                  <button className="snippet-delete" onClick={() => handleDelete(snippet._id)}>
                    Delete
                  </button>
                </div>
              </div>
              <SyntaxHighlighter
                language={snippet.language.toLowerCase()}
                style={oneLight}
                customStyle={{
                  margin: 0,
                  borderRadius: "0 0 10px 10px",
                  fontSize: "13px",
                  padding: "16px",
                }}
                wrapLongLines
              >
                {snippet.code}
              </SyntaxHighlighter>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editingId ? "Edit snippet" : "New snippet"} onClose={() => setShowModal(false)}>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="snippet-title">Title</label>
              <input
                id="snippet-title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Debounce hook"
              />
            </div>
            <div className="form-field">
              <label htmlFor="snippet-lang">Language</label>
              <select
                id="snippet-lang"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="snippet-code">Code</label>
              <textarea
                id="snippet-code"
                required
                rows={8}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="Paste your code here..."
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Save changes" : "Create snippet"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}