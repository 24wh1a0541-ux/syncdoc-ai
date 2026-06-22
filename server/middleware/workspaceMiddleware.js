import Workspace from "../models/Workspace.js";

// Verifies the logged-in user belongs to the workspace referenced by
// :workspaceId in the route params. Attaches the workspace doc to req.workspace.
export const requireWorkspaceMember = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    req.workspace = workspace;
    next();
  } catch (error) {
    next(error);
  }
};

// Stricter guard for destructive actions (e.g. delete workspace, remove member)
export const requireWorkspaceOwner = (req, res, next) => {
  if (req.workspace.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the workspace owner can do this" });
  }
  next();
};
