import React, { useState } from "react";
import { useWorkspace } from "./WorkspaceLayout";
import "./Overview.css";

export default function Overview() {
  const { workspace } = useWorkspace();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(workspace.workspaceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable - silently ignore
    }
  };

  return (
    <div className="overview">
      <div className="overview-header">
        <h1>{workspace?.name}</h1>
        {workspace?.description && <p className="overview-desc">{workspace.description}</p>}
      </div>

      <div className="overview-code-card">
        <div>
          <span className="overview-code-label">Workspace join code</span>
          <span className="overview-code-value">{workspace?.workspaceCode}</span>
        </div>
        <button className="btn btn-ghost" onClick={handleCopyCode}>
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>

      <div className="overview-stats">
        <div className="overview-stat">
          <span className="overview-stat-value">{workspace?.members?.length ?? 0}</span>
          <span className="overview-stat-label">Members</span>
        </div>
        <div className="overview-stat">
          <span className="overview-stat-value">—</span>
          <span className="overview-stat-label">Files</span>
        </div>
        <div className="overview-stat">
          <span className="overview-stat-value">—</span>
          <span className="overview-stat-label">Tasks</span>
        </div>
      </div>

      <p className="overview-hint">
        Use the sidebar to share PDFs, images, links, and code with your team,
        or assign tasks to keep everyone on track.
      </p>
    </div>
  );
}