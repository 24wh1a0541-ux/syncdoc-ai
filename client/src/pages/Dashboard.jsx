import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import WorkspaceCard from "../components/WorkspaceCard";
import Modal from "../components/Modal";
import {
  getMyWorkspacesRequest,
  createWorkspaceRequest,
  joinWorkspaceRequest,
  deleteWorkspaceRequest,
} from "../services/workspaceAPI";
import "./Dashboard.css";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [joinCode, setJoinCode] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadWorkspaces = async () => {
    try {
      const { data } = await getMyWorkspacesRequest();
      setWorkspaces(data.workspaces);
    } catch (err) {
      console.error("Failed to load workspaces", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const resetModals = () => {
    setShowCreate(false);
    setShowJoin(false);
    setFormError("");
    setCreateForm({ name: "", description: "" });
    setJoinCode("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await createWorkspaceRequest(createForm);
      resetModals();
      loadWorkspaces();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not create workspace.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await joinWorkspaceRequest(joinCode.trim());
      resetModals();
      loadWorkspaces();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not join workspace.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (workspaceId) => {
    try {
      await deleteWorkspaceRequest(workspaceId);
      setWorkspaces((prev) => prev.filter((w) => w._id !== workspaceId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete workspace.");
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="container dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Your workspaces</h1>
            <p className="dashboard-sub">Everything your teams are working on.</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-ghost" onClick={() => setShowJoin(true)}>
              Join workspace
            </button>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              + Create workspace
            </button>
          </div>
        </div>

        {loading && <p className="dashboard-empty">Loading your workspaces...</p>}

        {!loading && workspaces.length === 0 && (
          <div className="dashboard-empty-state">
            <h3>No workspaces yet</h3>
            <p>Create one for your project, or join your team with their code.</p>
            <div className="dashboard-actions">
              <button className="btn btn-ghost" onClick={() => setShowJoin(true)}>
                Join workspace
              </button>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                + Create workspace
              </button>
            </div>
          </div>
        )}

        {!loading && workspaces.length > 0 && (
          <div className="workspace-grid">
            {workspaces.map((ws) => (
              <WorkspaceCard key={ws._id} workspace={ws} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <Modal title="Create a workspace" onClose={resetModals}>
          {formError && <div className="auth-error">{formError}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-field">
              <label htmlFor="ws-name">Workspace name</label>
              <input
                id="ws-name"
                required
                maxLength={80}
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Capstone Project"
              />
            </div>
            <div className="form-field">
              <label htmlFor="ws-desc">Description (optional)</label>
              <input
                id="ws-desc"
                maxLength={200}
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Final year project on..."
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create workspace"}
            </button>
          </form>
        </Modal>
      )}

      {showJoin && (
        <Modal title="Join a workspace" onClose={resetModals}>
          {formError && <div className="auth-error">{formError}</div>}
          <form onSubmit={handleJoin}>
            <div className="form-field">
              <label htmlFor="ws-code">Workspace code</label>
              <input
                id="ws-code"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="SD-84KQ2M"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
              {submitting ? "Joining..." : "Join workspace"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}