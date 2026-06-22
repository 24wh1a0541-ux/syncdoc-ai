import Pdf from "../models/Pdf.js";
import Link from "../models/Link.js";
import Snippet from "../models/Snippet.js";
import Task from "../models/Task.js";

// @route GET /api/workspaces/:workspaceId/search?q=keyword
// Searches PDFs, links, snippets, and tasks in one workspace by keyword.
export const searchWorkspace = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(q.trim(), "i");
    const workspaceId = req.workspace._id;

    const [pdfs, links, snippets, tasks] = await Promise.all([
      Pdf.find({ workspaceId, fileName: regex }).limit(10),
      Link.find({ workspaceId, $or: [{ title: regex }, { url: regex }] }).limit(10),
      Snippet.find({ workspaceId, $or: [{ title: regex }, { language: regex }] }).limit(10),
      Task.find({ workspaceId, $or: [{ title: regex }, { description: regex }] }).limit(10),
    ]);

    const results = [
      ...pdfs.map((p) => ({ type: "pdf", id: p._id, label: p.fileName, url: p.fileUrl })),
      ...links.map((l) => ({ type: "link", id: l._id, label: l.title, url: l.url })),
      ...snippets.map((s) => ({ type: "snippet", id: s._id, label: s.title, language: s.language })),
      ...tasks.map((t) => ({ type: "task", id: t._id, label: t.title, status: t.status })),
    ];

    res.status(200).json({ query: q, count: results.length, results });
  } catch (error) {
    next(error);
  }
};
