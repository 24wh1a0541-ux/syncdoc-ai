import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/dashboard" className="navbar-logo">
          SyncDoc
        </Link>

        <div className="navbar-right">
          <button className="navbar-icon-btn" aria-label="Notifications" title="Notifications">
            🔔
          </button>

          <div className="navbar-profile">
            <div className="navbar-avatar">{user?.fullName?.charAt(0).toUpperCase() || "U"}</div>
            <span className="navbar-name">{user?.fullName}</span>
          </div>

          <button className="btn btn-ghost navbar-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}