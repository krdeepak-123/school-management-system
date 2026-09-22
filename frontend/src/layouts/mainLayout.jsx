import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import "../styles/layout.css";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="app-main">
        <Navbar onMenuClick={openSidebar} />

        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}