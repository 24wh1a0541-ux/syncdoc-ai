import React from "react";
import { useNavigate } from "react-router-dom";
import "./WorkspaceCard.css";

export default function WorkspaceCard({ workspace, onDelete }) {
  const navigate = useNavigate();

  const handleOpen = () => navigate(`/workspace/${workspace._id}`);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${workspace.name}"? This cannot be undone.`)) {
      onDelete(workspace._id);
    }
  };

  return (
    <div className="workspace-card" onClick={handleOpen}>
      <div className="workspace-card-top">
        <h3>{workspace.name}</h3>
        <span className="workspace-code-chip">{workspace.workspaceCode}</span>
      </div>

      {workspace.description && (
        <p className="workspace-card-desc">{workspace.description}</p>
      )}

      <div className="workspace-card-stats">
        <span>{workspace.membersCount ?? workspace.members?.length ?? 0} members</span>
        <span>{workspace.filesCount ?? 0} files</span>
        <span>{workspace.tasksCount ?? 0} tasks</span>
      </div>

      <div className="workspace-card-footer">
        <button className="btn btn-ghost workspace-card-open" onClick={handleOpen}>
          Open
        </button>
        <button className="workspace-card-delete" onClick={handleDelete} aria-label="Delete workspace">
          Delete
        </button>
      </div>
    </div>
  );
}