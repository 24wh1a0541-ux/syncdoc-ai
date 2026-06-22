import Workspace from "../models/Workspace.js";
import Pdf from "../models/Pdf.js";
import Image from "../models/Image.js";
import Task from "../models/Task.js";
import { generateWorkspaceCode } from "../utils/generateWorkspaceCode.js";
import { notifyWorkspaceMembers } from "../utils/notify.js";

// @route POST /api/workspaces
export const createWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Workspace name is required" });

    let workspaceCode;
    let codeExists = true;
    while (codeExists) {
      workspaceCode = generateWorkspaceCode();
      codeExists = await Workspace.findOne({ workspaceCode });
    }

    const workspace = await Workspace.create({
      name,
      description,
      workspaceCode,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({ message: "Workspace created", workspace });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/workspaces/join
export const joinWorkspace = async (req, res, next) => {
  try {
    const { workspaceCode } = req.body;
    if (!workspaceCode) return res.status(400).json({ message: "Workspace code is required" });

    const workspace = await Workspace.findOne({ workspaceCode: workspaceCode.toUpperCase() });
    if (!workspace) return res.status(404).json({ message: "No workspace found with that code" });

    const alreadyMember = workspace.members.some(
      (id) => id.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "You are already a member of this workspace" });
    }

    workspace.members.push(req.user._id);
    await workspace.save();

    await notifyWorkspaceMembers({
      workspace,
      actorId: req.user._id,
      message: `${req.user.fullName} joined the workspace "${workspace.name}"`,
    });

    res.status(200).json({ message: "Joined workspace", workspace });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/workspaces
export const getMyWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ members: req.user._id }).sort({ createdAt: -1 });

    // Attach quick counts for the dashboard cards
    const withCounts = await Promise.all(
      workspaces.map(async (ws) => {
        const [pdfCount, imageCount, taskCount] = await Promise.all([
          Pdf.countDocuments({ workspaceId: ws._id }),
          Image.countDocuments({ workspaceId: ws._id }),
          Task.countDocuments({ workspaceId: ws._id }),
        ]);
        return {
          ...ws.toObject(),
          membersCount: ws.members.length,
          filesCount: pdfCount + imageCount,
          tasksCount: taskCount,
        };
      })
    );

    res.status(200).json({ workspaces: withCounts });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/workspaces/:workspaceId
// Uses req.workspace attached by requireWorkspaceMember middleware
export const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await req.workspace.populate("members", "fullName email avatar");
    res.status(200).json({ workspace });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/workspaces/:workspaceId
export const updateWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (name) req.workspace.name = name;
    if (description !== undefined) req.workspace.description = description;
    await req.workspace.save();
    res.status(200).json({ message: "Workspace updated", workspace: req.workspace });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/workspaces/:workspaceId
export const deleteWorkspace = async (req, res, next) => {
  try {
    await req.workspace.deleteOne();
    res.status(200).json({ message: "Workspace deleted" });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/workspaces/:workspaceId/leave
export const leaveWorkspace = async (req, res, next) => {
  try {
    if (req.workspace.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Owner cannot leave the workspace. Delete it instead." });
    }
    req.workspace.members = req.workspace.members.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await req.workspace.save();
    res.status(200).json({ message: "You left the workspace" });
  } catch (error) {
    next(error);
  }
};
