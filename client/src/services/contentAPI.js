import api from "./api";

export const getMembersRequest = (workspaceId) =>
  api.get(`/workspaces/${workspaceId}/members`);
export const removeMemberRequest = (workspaceId, memberId) =>
  api.delete(`/workspaces/${workspaceId}/members/${memberId}`);

export const getPdfsRequest = (workspaceId) => api.get(`/workspaces/${workspaceId}/pdfs`);
export const uploadPdfRequest = (workspaceId, formData) =>
  api.post(`/workspaces/${workspaceId}/pdfs`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deletePdfRequest = (workspaceId, pdfId) =>
  api.delete(`/workspaces/${workspaceId}/pdfs/${pdfId}`);

export const getImagesRequest = (workspaceId) => api.get(`/workspaces/${workspaceId}/images`);
export const uploadImageRequest = (workspaceId, formData) =>
  api.post(`/workspaces/${workspaceId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteImageRequest = (workspaceId, imageId) =>
  api.delete(`/workspaces/${workspaceId}/images/${imageId}`);

export const getLinksRequest = (workspaceId) => api.get(`/workspaces/${workspaceId}/links`);
export const createLinkRequest = (workspaceId, data) =>
  api.post(`/workspaces/${workspaceId}/links`, data);
export const deleteLinkRequest = (workspaceId, linkId) =>
  api.delete(`/workspaces/${workspaceId}/links/${linkId}`);

export const getSnippetsRequest = (workspaceId) => api.get(`/workspaces/${workspaceId}/snippets`);
export const createSnippetRequest = (workspaceId, data) =>
  api.post(`/workspaces/${workspaceId}/snippets`, data);
export const updateSnippetRequest = (workspaceId, snippetId, data) =>
  api.put(`/workspaces/${workspaceId}/snippets/${snippetId}`, data);
export const deleteSnippetRequest = (workspaceId, snippetId) =>
  api.delete(`/workspaces/${workspaceId}/snippets/${snippetId}`);

export const searchWorkspaceRequest = (workspaceId, query) =>
  api.get(`/workspaces/${workspaceId}/search`, { params: { q: query } });