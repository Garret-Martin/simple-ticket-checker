import React from "react";
import Sidebar from "../Components/Sidebar";
import "./Admin.css";

import Scan from "./Scan";
import Tickets from "./Tickets";
import Users from "./Users";
import Logs from "./Logs";

import { Routes, Route } from "react-router-dom";
function Admin() {
  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/scan" element={<Scan />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="users" element={<Users />} />
          <Route path="logs" element={<Logs />} />
          {/* Default Page */}
          <Route path="/" element={<Tickets />} />
        </Routes>
      </div>
    </div>
  );
}
export default Admin;
