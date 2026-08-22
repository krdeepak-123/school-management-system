export default function ClassModal({
  isOpen,
  title,
  children,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <div className="modal-header">

          <h2>{title}</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✖
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}