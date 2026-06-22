import api from "./api";

export const createTaskRequest = (workspaceId, data) =>
  api.post(`/workspaces/${workspaceId}/tasks`, data);
export const getWorkspaceTasksRequest = (workspaceId) =>
  api.get(`/workspaces/${workspaceId}/tasks`);
export const updateTaskRequest = (workspaceId, taskId, data) =>
  api.put(`/workspaces/${workspaceId}/tasks/${taskId}`, data);
export const deleteTaskRequest = (workspaceId, taskId) =>
  api.delete(`/workspaces/${workspaceId}/tasks/${taskId}`);
