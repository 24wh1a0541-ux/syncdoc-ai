import Notification from "../models/Notification.js";

// Creates a notification for every member of a workspace except the actor
export const notifyWorkspaceMembers = async ({ workspace, message, actorId }) => {
  const recipients = workspace.members.filter(
    (memberId) => memberId.toString() !== actorId.toString()
  );

  if (recipients.length === 0) return;

  const docs = recipients.map((userId) => ({
    userId,
    workspaceId: workspace._id,
    message,
  }));

  await Notification.insertMany(docs);
};
