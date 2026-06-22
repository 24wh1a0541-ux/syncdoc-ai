import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const navItems = [
  { to: "", label: "Overview", end: true },
  { to: "pdfs", label: "PDFs" },
  { to: "images", label: "Images" },
  { to: "links", label: "Links" },
  { to: "code", label: "Code" },
  { to: "tasks", label: "Tasks" },
  { to: "members", label: "Members" },
  { to: "settings", label: "Settings" },
];

export default function Sidebar({ workspace }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-workspace">
        <h2 className="sidebar-workspace-name">{workspace?.name}</h2>
        <span className="sidebar-workspace-code">{workspace?.workspaceCode}</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "sidebar-nav-item is-active" : "sidebar-nav-item"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}