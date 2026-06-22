import Link from "../models/Link.js";
import { notifyWorkspaceMembers } from "../utils/notify.js";

export const createLink = async (req, res, next) => {
  try {
    const { title, url } = req.body;
    if (!title || !url) return res.status(400).json({ message: "Title and URL are required" });

    const link = await Link.create({
      workspaceId: req.workspace._id,
      title,
      url,
      addedBy: req.user._id,
    });

    await notifyWorkspaceMembers({
      workspace: req.workspace,
      actorId: req.user._id,
      message: `${req.user.fullName} added a link: "${title}"`,
    });

    res.status(201).json({ message: "Link added", link });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ workspaceId: req.workspace._id })
      .populate("addedBy", "fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ links });
  } catch (error) {
    next(error);
  }
};

export const deleteLink = async (req, res, next) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.linkId,
      workspaceId: req.workspace._id,
    });
    if (!link) return res.status(404).json({ message: "Link not found" });
    res.status(200).json({ message: "Link deleted" });
  } catch (error) {
    next(error);
  }
};
