// Members module reuses Workspace data - no separate collection needed,
// since membership already lives on the Workspace document.

export const getWorkspaceMembers = async (req, res, next) => {
  try {
    const workspace = await req.workspace.populate("members", "fullName email avatar createdAt");

    const members = workspace.members.map((member) => ({
      _id: member._id,
      fullName: member.fullName,
      email: member.email,
      avatar: member.avatar,
      role: member._id.toString() === workspace.owner.toString() ? "Owner" : "Member",
    }));

    res.status(200).json({ members });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;

    if (memberId === req.workspace.owner.toString()) {
      return res.status(400).json({ message: "The owner cannot be removed" });
    }

    req.workspace.members = req.workspace.members.filter(
      (id) => id.toString() !== memberId
    );
    await req.workspace.save();

    res.status(200).json({ message: "Member removed" });
  } catch (error) {
    next(error);
  }
};
