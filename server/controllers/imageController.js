import Image from "../models/Image.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { notifyWorkspaceMembers } from "../utils/notify.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadImageFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided" });

    const image = await Image.create({
      workspaceId: req.workspace._id,
      imageUrl: `/uploads/images/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    await notifyWorkspaceMembers({
      workspace: req.workspace,
      actorId: req.user._id,
      message: `${req.user.fullName} uploaded an image`,
    });

    res.status(201).json({ message: "Image uploaded", image });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceImages = async (req, res, next) => {
  try {
    const images = await Image.find({ workspaceId: req.workspace._id })
      .populate("uploadedBy", "fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ images });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findOne({ _id: req.params.imageId, workspaceId: req.workspace._id });
    if (!image) return res.status(404).json({ message: "Image not found" });

    const absolutePath = path.join(__dirname, "..", image.imageUrl);
    fs.unlink(absolutePath, () => {});

    await image.deleteOne();
    res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    next(error);
  }
};
