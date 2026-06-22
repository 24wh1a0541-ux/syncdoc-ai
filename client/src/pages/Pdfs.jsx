import React, { useState, useEffect, useRef } from "react";
import { useWorkspace } from "./WorkspaceLayout";
import { getPdfsRequest, uploadPdfRequest, deletePdfRequest } from "../services/contentAPI";
import "./Files.css";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
  /\/api$/,
  ""
);

export default function Pdfs() {
  const { workspace } = useWorkspace();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const loadPdfs = async () => {
    try {
      const { data } = await getPdfsRequest(workspace._id);
      setPdfs(data.pdfs);
    } catch (err) {
      console.error("Failed to load PDFs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPdfs();
  }, [workspace._id]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await uploadPdfRequest(workspace._id, formData);
      loadPdfs();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (pdfId) => {
    if (!window.confirm("Delete this PDF?")) return;
    try {
      await deletePdfRequest(workspace._id, pdfId);
      setPdfs((prev) => prev.filter((p) => p._id !== pdfId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete PDF.");
    }
  };

  return (
    <div className="files-page">
      <div className="files-header">
        <div>
          <h1>PDFs</h1>
          <p className="files-sub">Research papers, reports, and documentation.</p>
        </div>
        <label className="btn btn-primary files-upload-btn">
          {uploading ? "Uploading..." : "+ Upload PDF"}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            disabled={uploading}
            hidden
          />
        </label>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {loading && <p className="files-empty">Loading PDFs...</p>}

      {!loading && pdfs.length === 0 && (
        <div className="files-empty-state">
          <h3>No PDFs yet</h3>
          <p>Upload research papers or reports for your team to access.</p>
        </div>
      )}

      {!loading && pdfs.length > 0 && (
        <div className="files-grid">
          {pdfs.map((pdf) => (
            <div className="file-card" key={pdf._id}>
              <div className="file-card-icon">PDF</div>
              <div className="file-card-info">
                <a
                  href={`${API_ORIGIN}${pdf.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-card-name"
                  title={pdf.fileName}
                >
                  {pdf.fileName}
                </a>
                <span className="file-card-meta">
                  {pdf.uploadedBy?.fullName} · {new Date(pdf.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="file-card-actions">
                <a
                  href={`${API_ORIGIN}${pdf.fileUrl}`}
                  download
                  className="file-card-action"
                >
                  Download
                </a>
                <button className="file-card-delete" onClick={() => handleDelete(pdf._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}