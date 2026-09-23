import React from "react";

export default function IOSInstallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="pwa-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-title"
    >
      <div
        className="pwa-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pwa-modal-header">
          <div className="pwa-modal-app-info">
            <div className="pwa-modal-icon">🏫</div>
            <div>
              <h3 id="ios-install-title" className="pwa-modal-title">
                Install Paradise Kids School
              </h3>
              <p className="pwa-modal-subtitle">Add to Home Screen for fast access</p>
            </div>
          </div>
          <button
            type="button"
            className="pwa-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="pwa-modal-body">
          <p className="pwa-modal-intro">
            To install on your iPhone or iPad:
          </p>

          <ol className="pwa-instructions-list">
            <li className="pwa-instruction-step">
              <span className="pwa-step-num">1</span>
              <span>
                Tap the <strong>Share</strong> button in Safari toolbar (
                <span className="pwa-inline-icon">⎋</span> or icon at bottom).
              </span>
            </li>
            <li className="pwa-instruction-step">
              <span className="pwa-step-num">2</span>
              <span>
                Scroll down and select <strong>"Add to Home Screen"</strong> (
                <span className="pwa-inline-icon">➕</span>).
              </span>
            </li>
            <li className="pwa-instruction-step">
              <span className="pwa-step-num">3</span>
              <span>
                Tap <strong>"Add"</strong> in the top-right corner.
              </span>
            </li>
          </ol>
        </div>

        <div className="pwa-modal-footer">
          <button
            type="button"
            className="pwa-modal-btn"
            onClick={onClose}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
