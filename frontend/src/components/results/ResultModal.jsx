export default function ResultModal({
  isOpen,
  title,
  onClose,
  children,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="result-modal-overlay"
      onMouseDown={onClose}
    >

      <div
        className="result-modal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="result-modal-header">

          <h2>
            {title}
          </h2>

          <button
            type="button"
            className="result-close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div className="result-modal-body">
          {children}
        </div>

      </div>

    </div>
  );
}