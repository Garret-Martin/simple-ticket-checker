import React, { useState } from "react";
import { SidebarData } from "./SidebarData";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`Sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="toggle-btn" onClick={() => { setCollapsed(!collapsed) }}>
        {collapsed ? (
          <KeyboardDoubleArrowRightIcon id="icon"/>
        ) : (
          <KeyboardDoubleArrowLeftIcon id="icon"/>
        )}
      </div>
      <ul className="SidebarList">
        {SidebarData.map((val1, key) => {
          const isActive = location.pathname === val1.link;
          return (
            <li
              key={key}
              onClick={() => {
                navigate(val1.link);
              }}
              className={`row ${isActive ? "active" : ""}`}
            >
              <div className="icon">
                <Icon className={`icon ${isActive ? "active" : ""}`}>
                  {val1.icon}
                </Icon>
              </div>
              <div id="title">{val1.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Sidebar;
