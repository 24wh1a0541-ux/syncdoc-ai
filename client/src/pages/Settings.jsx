import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "./WorkspaceLayout";
import { updateWorkspaceRequest, deleteWorkspaceRequest } from "../services/workspaceAPI";
import "./Settings.css";

export default function Settings() {
  const { workspace, setWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: workspace.name,
    description: workspace.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMsg("");
    setSaveError("");
    setSaving(true);
    try {
      const { data } = await updateWorkspaceRequest(workspace._id, form);
      setWorkspace(data.workspace);
      setSaveMsg("Changes saved.");
    } catch (err) {
      setSaveError(err.response?.data?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete "${workspace.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteWorkspaceRequest(workspace._id);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete workspace.");
      setDeleting(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p className="settings-sub">Manage your workspace details.</p>

      <div className="settings-card">
        <h2>Workspace details</h2>
        <form onSubmit={handleSave}>
          <div className="form-field">
            <label htmlFor="ws-name">Workspace name</label>
            <input
              id="ws-name"
              required
              maxLength={80}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label htmlFor="ws-desc">Description</label>
            <input
              id="ws-desc"
              maxLength={200}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is this workspace for?"
            />
          </div>
          {saveMsg && <p className="settings-success">{saveMsg}</p>}
          {saveError && <div className="auth-error">{saveError}</div>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      <div className="settings-card settings-danger-card">
        <h2>Danger zone</h2>
        <p>Deleting this workspace removes all files, tasks, links, and snippets permanently.</p>
        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete workspace"}
        </button>
      </div>
    </div>
  );
}