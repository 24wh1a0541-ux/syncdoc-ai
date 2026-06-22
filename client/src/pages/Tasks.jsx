import React, { useState, useEffect } from "react";
import { useWorkspace } from "./WorkspaceLayout";
import Modal from "../components/Modal";
import {
  createTaskRequest,
  getWorkspaceTasksRequest,
  updateTaskRequest,
  deleteTaskRequest,
} from "../services/taskAPI";
import "./Tasks.css";

const statusOptions = ["Pending", "In Progress", "Completed"];
const priorityOptions = ["Low", "Medium", "High"];

export default function Tasks() {
  const { workspace } = useWorkspace();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", dueDate: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    try {
      const { data } = await getWorkspaceTasksRequest(workspace._id);
      setTasks(data.tasks);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [workspace._id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createTaskRequest(workspace._id, form);
      setShowCreate(false);
      setForm({ title: "", description: "", priority: "Medium", dueDate: "" });
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create task.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await updateTaskRequest(workspace._id, taskId, { status });
    } catch (err) {
      loadTasks(); // revert on failure
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTaskRequest(workspace._id, taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete task.");
    }
  };

  const grouped = statusOptions.map((status) => ({
    status,
    items: tasks.filter((t) => t.status === status),
  }));

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p className="tasks-sub">Assign work and track progress as a team.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          + New task
        </button>
      </div>

      {loading && <p className="tasks-empty">Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <div className="tasks-empty-state">
          <h3>No tasks yet</h3>
          <p>Break your project into tasks so nothing falls through the cracks.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + New task
          </button>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="tasks-board">
          {grouped.map((col) => (
            <div className="tasks-column" key={col.status}>
              <div className="tasks-column-header">
                <span>{col.status}</span>
                <span className="tasks-column-count">{col.items.length}</span>
              </div>
              {col.items.map((task) => (
                <div className="task-card" key={task._id}>
                  <div className="task-card-top">
                    <h4>{task.title}</h4>
                    <span className={`task-priority task-priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && <p className="task-card-desc">{task.description}</p>}
                  {task.dueDate && (
                    <p className="task-card-due">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="task-card-footer">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      className="task-card-delete"
                      onClick={() => handleDelete(task._id)}
                      aria-label="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="New task" onClose={() => setShowCreate(false)}>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-field">
              <label htmlFor="task-title">Title</label>
              <input
                id="task-title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Design database schema"
              />
            </div>
            <div className="form-field">
              <label htmlFor="task-desc">Description (optional)</label>
              <input
                id="task-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What needs to happen"
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="task-due">Due date (optional)</label>
                <input
                  id="task-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create task"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}