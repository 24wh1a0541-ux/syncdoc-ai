import React, { useState, useEffect, createContext, useContext } from "react";
import { useParams, Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getWorkspaceRequest } from "../services/workspaceAPI";
import "./WorkspaceLayout.css";

const WorkspaceContext = createContext(null);
export const useWorkspace = () => useContext(WorkspaceContext);

export default function WorkspaceLayout() {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getWorkspaceRequest(workspaceId);
        setWorkspace(data.workspace);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this workspace.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="workspace-layout-loading">
        <Navbar />
        <p>Loading workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workspace-layout-loading">
        <Navbar />
        <div className="workspace-layout-error">
          <p>{error}</p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace, refetch: () => {} }}>
      <div className="workspace-layout">
        <Navbar />
        <div className="workspace-layout-body">
          <Sidebar workspace={workspace} />
          <main className="workspace-layout-main">
            <Outlet />
          </main>
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
}