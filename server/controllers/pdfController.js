import Pdf from "../models/Pdf.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { notifyWorkspaceMembers } from "../utils/notify.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadPdfFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No PDF file provided" });

    const pdf = await Pdf.create({
      workspaceId: req.workspace._id,
      fileName: req.file.originalname,
      fileUrl: `/uploads/pdfs/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    await notifyWorkspaceMembers({
      workspace: req.workspace,
      actorId: req.user._id,
      message: `${req.user.fullName} uploaded "${pdf.fileName}"`,
    });

    res.status(201).json({ message: "PDF uploaded", pdf });
  } catch (error) {
    next(error);
  }
};

export const getWorkspacePdfs = async (req, res, next) => {
  try {
    const pdfs = await Pdf.find({ workspaceId: req.workspace._id })
      .populate("uploadedBy", "fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ pdfs });
  } catch (error) {
    next(error);
  }
};

export const deletePdf = async (req, res, next) => {
  try {
    const pdf = await Pdf.findOne({ _id: req.params.pdfId, workspaceId: req.workspace._id });
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    const absolutePath = path.join(__dirname, "..", pdf.fileUrl);
    fs.unlink(absolutePath, () => {}); // best-effort file cleanup

    await pdf.deleteOne();
    res.status(200).json({ message: "PDF deleted" });
  } catch (error) {
    next(error);
  }
};
