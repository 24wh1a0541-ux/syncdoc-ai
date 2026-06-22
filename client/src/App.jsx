import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkspaceLayout from "./pages/WorkspaceLayout";
import Overview from "./pages/Overview";
import Tasks from "./pages/Tasks";
import Members from "./pages/Members";
import Links from "./pages/Links";
import CodeSnippets from "./pages/CodeSnippets";
import Pdfs from "./pages/Pdfs";
import Images from "./pages/Images";
import Settings from "./pages/Settings";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/workspace/:workspaceId" element={<PrivateRoute><WorkspaceLayout /></PrivateRoute>}>
        <Route index element={<Overview />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="members" element={<Members />} />
        <Route path="links" element={<Links />} />
        <Route path="code" element={<CodeSnippets />} />
        <Route path="pdfs" element={<Pdfs />} />
        <Route path="images" element={<Images />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}