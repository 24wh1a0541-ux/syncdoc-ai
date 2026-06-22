import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    language: { type: String, required: true, trim: true },
    code: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export default mongoose.model("Snippet", snippetSchema);
