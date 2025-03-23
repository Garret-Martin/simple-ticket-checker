import React from "react";
import { SidebarData } from "./SidebarData";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val1, key) => {
          return (
            <li
              key={key}
              onClick={() => {
                navigate(val1.link)
              }}
              className="row"
              id={window.location.pathname == val1.link ? "active" : ""}
            >
              <div id="icon">{val1.icon}</div>
              <div id="title">{val1.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Sidebar;
