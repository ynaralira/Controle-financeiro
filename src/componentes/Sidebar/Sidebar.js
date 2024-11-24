import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">

        <Link to="/home" className="side-menu">
          <i className="fi fi-br-menu-burger"></i>
        </Link>
        
      </nav>
    </aside>
  );
}

export default Sidebar;
