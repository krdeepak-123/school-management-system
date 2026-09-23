import React, { useState } from "react";
import usePWAInstall from "../hooks/usePWAInstall";
import IOSInstallModal from "./IOSInstallModal";

export default function InstallAppButton({
  variant = "navbar",
  className = "",
  onInstalled = () => {},
}) {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (!isInstallable || isInstalled) {
    return null;
  }

  const handleClick = async () => {
    const result = await promptInstall();
    if (result.outcome === "ios_instructions") {
      setShowIOSModal(true);
    } else if (result.outcome === "accepted") {
      onInstalled();
    }
  };

  if (variant === "sidebar") {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className={`sidebar-install-btn ${className}`}
          aria-label="Install App"
        >
          <span className="sidebar-install-icon">📱</span>
          <span className="sidebar-install-text">Install App</span>
        </button>
        <IOSInstallModal
          isOpen={showIOSModal}
          onClose={() => setShowIOSModal(false)}
        />
      </>
    );
  }

  // Default navbar variant
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`navbar-install-btn ${className}`}
        aria-label="Install App"
        title="Install Paradise Kids School App"
      >
        <span className="navbar-install-icon">📲</span>
        <span className="navbar-install-label">Install App</span>
      </button>
      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
}
