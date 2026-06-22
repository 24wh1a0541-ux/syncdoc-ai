import React, { useState, useEffect, useRef } from "react";
import { useWorkspace } from "./WorkspaceLayout";
import { getImagesRequest, uploadImageRequest, deleteImageRequest } from "../services/contentAPI";
import "./Files.css";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
  /\/api$/,
  ""
);

export default function Images() {
  const { workspace } = useWorkspace();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const loadImages = async () => {
    try {
      const { data } = await getImagesRequest(workspace._id);
      setImages(data.images);
    } catch (err) {
      console.error("Failed to load images", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [workspace._id]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      await uploadImageRequest(workspace._id, formData);
      loadImages();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteImageRequest(workspace._id, imageId);
      setImages((prev) => prev.filter((i) => i._id !== imageId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete image.");
    }
  };

  return (
    <div className="files-page">
      <div className="files-header">
        <div>
          <h1>Images</h1>
          <p className="files-sub">Screenshots, diagrams, and UI designs.</p>
        </div>
        <label className="btn btn-primary files-upload-btn">
          {uploading ? "Uploading..." : "+ Upload image"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            hidden
          />
        </label>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {loading && <p className="files-empty">Loading images...</p>}

      {!loading && images.length === 0 && (
        <div className="files-empty-state">
          <h3>No images yet</h3>
          <p>Upload screenshots, diagrams, or design mockups.</p>
        </div>
      )}

      {!loading && images.length > 0 && (
        <div className="image-grid">
          {images.map((image) => (
            <div className="image-card" key={image._id}>
              <a href={`${API_ORIGIN}${image.imageUrl}`} target="_blank" rel="noopener noreferrer">
                <img src={`${API_ORIGIN}${image.imageUrl}`} alt="" loading="lazy" />
              </a>
              <div className="image-card-footer">
                <span className="image-card-meta">{image.uploadedBy?.fullName}</span>
                <button className="file-card-delete" onClick={() => handleDelete(image._id)}>
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