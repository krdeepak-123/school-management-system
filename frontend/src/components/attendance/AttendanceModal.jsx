export default function AttendanceModal({
  isOpen,
  title,
  children,
  onClose,
}) {

  if (!isOpen) return null;


  return (

    <div className="modal-overlay">

      <div className="modal-container">


        <div className="modal-header">

          <h2>
            {title}
          </h2>


          <button

            className="close-btn"

            onClick={onClose}

          >

            ✖

          </button>


        </div>



        <div className="modal-body">

          {children}

        </div>



      </div>

    </div>

  );

}