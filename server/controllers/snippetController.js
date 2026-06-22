import Snippet from "../models/Snippet.js";
import { notifyWorkspaceMembers } from "../utils/notify.js";

export const createSnippet = async (req, res, next) => {
  try {
    const { title, language, code } = req.body;
    if (!title || !language || !code) {
      return res.status(400).json({ message: "Title, language, and code are required" });
    }

    const snippet = await Snippet.create({
      workspaceId: req.workspace._id,
      title,
      language,
      code,
      createdBy: req.user._id,
    });

    await notifyWorkspaceMembers({
      workspace: req.workspace,
      actorId: req.user._id,
      message: `${req.user.fullName} added a code snippet: "${title}"`,
    });

    res.status(201).json({ message: "Snippet created", snippet });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceSnippets = async (req, res, next) => {
  try {
    const snippets = await Snippet.find({ workspaceId: req.workspace._id })
      .populate("createdBy", "fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ snippets });
  } catch (error) {
    next(error);
  }
};

export const updateSnippet = async (req, res, next) => {
  try {
    const { title, language, code } = req.body;
    const snippet = await Snippet.findOne({
      _id: req.params.snippetId,
      workspaceId: req.workspace._id,
    });
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    if (title) snippet.title = title;
    if (language) snippet.language = language;
    if (code !== undefined) snippet.code = code;
    await snippet.save();

    res.status(200).json({ message: "Snippet updated", snippet });
  } catch (error) {
    next(error);
  }
};

export const deleteSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOneAndDelete({
      _id: req.params.snippetId,
      workspaceId: req.workspace._id,
    });
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });
    res.status(200).json({ message: "Snippet deleted" });
  } catch (error) {
    next(error);
  }
};
