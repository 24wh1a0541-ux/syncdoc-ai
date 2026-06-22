import Task from "../models/Task.js";
import { notifyWorkspaceMembers } from "../utils/notify.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const task = await Task.create({
      workspaceId: req.workspace._id,
      title,
      description,
      assignedTo: assignedTo || null,
      priority: priority || "Medium",
      dueDate: dueDate || null,
    });

    await notifyWorkspaceMembers({
      workspace: req.workspace,
      actorId: req.user._id,
      message: `${req.user.fullName} created a task: "${title}"`,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ workspaceId: req.workspace._id })
      .populate("assignedTo", "fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;
    const task = await Task.findOne({ _id: req.params.taskId, workspaceId: req.workspace._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      workspaceId: req.workspace._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
