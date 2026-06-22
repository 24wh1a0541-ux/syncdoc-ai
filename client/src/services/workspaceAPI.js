import api from "./api";

export const createWorkspaceRequest = (data) => api.post("/workspaces", data);
export const joinWorkspaceRequest = (workspaceCode) =>
  api.post("/workspaces/join", { workspaceCode });
export const getMyWorkspacesRequest = () => api.get("/workspaces");
export const getWorkspaceRequest = (workspaceId) => api.get(`/workspaces/${workspaceId}`);
export const updateWorkspaceRequest = (workspaceId, data) =>
  api.put(`/workspaces/${workspaceId}`, data);
export const deleteWorkspaceRequest = (workspaceId) =>
  api.delete(`/workspaces/${workspaceId}`);
export const leaveWorkspaceRequest = (workspaceId) =>
  api.delete(`/workspaces/${workspaceId}/leave`);
