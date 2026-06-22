import React, { useState, useEffect } from "react";
import { useWorkspace } from "./WorkspaceLayout";
import { useAuth } from "../context/AuthContext";
import { getMembersRequest, removeMemberRequest } from "../services/contentAPI";
import "./Members.css";

export default function Members() {
  const { workspace } = useWorkspace();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwner = workspace.owner === user._id || workspace.owner?._id === user._id;

  const loadMembers = async () => {
    try {
      const { data } = await getMembersRequest(workspace._id);
      setMembers(data.members);
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [workspace._id]);

  const handleRemove = async (memberId, name) => {
    if (!window.confirm(`Remove ${name} from this workspace?`)) return;
    try {
      await removeMemberRequest(workspace._id, memberId);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove member.");
    }
  };

  return (
    <div className="members-page">
      <div className="members-header">
        <h1>Members</h1>
        <p className="members-sub">
          Share the join code <span className="members-code">{workspace.workspaceCode}</span> to
          invite more teammates.
        </p>
      </div>

      {loading && <p className="members-empty">Loading members...</p>}

      {!loading && (
        <div className="members-list">
          {members.map((member) => (
            <div className="member-row" key={member._id}>
              <div className="member-avatar">
                {member.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="member-info">
                <span className="member-name">{member.fullName}</span>
                <span className="member-email">{member.email}</span>
              </div>
              <span className={`member-role member-role-${member.role.toLowerCase()}`}>
                {member.role}
              </span>
              {isOwner && member.role !== "Owner" && (
                <button
                  className="member-remove"
                  onClick={() => handleRemove(member._id, member.fullName)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}