import React, { useState, useEffect } from "react";
import { useWorkspace } from "./WorkspaceLayout";
import Modal from "../components/Modal";
import {
  getLinksRequest,
  createLinkRequest,
  deleteLinkRequest,
} from "../services/contentAPI";
import "./Links.css";

export default function Links() {
  const { workspace } = useWorkspace();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", url: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadLinks = async () => {
    try {
      const { data } = await getLinksRequest(workspace._id);
      setLinks(data.links);
    } catch (err) {
      console.error("Failed to load links", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, [workspace._id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let { url } = form;
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
      await createLinkRequest(workspace._id, { title: form.title, url });
      setShowCreate(false);
      setForm({ title: "", url: "" });
      loadLinks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add link.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (linkId) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      await deleteLinkRequest(workspace._id, linkId);
      setLinks((prev) => prev.filter((l) => l._id !== linkId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete link.");
    }
  };

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <div className="links-page">
      <div className="links-header">
        <div>
          <h1>Links</h1>
          <p className="links-sub">Repos, references, and resources — saved, not scattered.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          + Add link
        </button>
      </div>

      {loading && <p className="links-empty">Loading links...</p>}

      {!loading && links.length === 0 && (
        <div className="links-empty-state">
          <h3>No links yet</h3>
          <p>Save your GitHub repo, Figma file, or research links here.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + Add link
          </button>
        </div>
      )}

      {!loading && links.length > 0 && (
        <div className="links-list">
          {links.map((link) => (
            <div className="link-row" key={link._id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-main">
                <span className="link-title">{link.title}</span>
                <span className="link-domain">{getDomain(link.url)}</span>
              </a>
              <button
                className="link-delete"
                onClick={() => handleDelete(link._id)}
                aria-label="Delete link"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Add a link" onClose={() => setShowCreate(false)}>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-field">
              <label htmlFor="link-title">Title</label>
              <input
                id="link-title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="GitHub Repository"
              />
            </div>
            <div className="form-field">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="github.com/your-team/project"
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add link"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}