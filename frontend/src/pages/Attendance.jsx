import { useState, useEffect } from "react";


import {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} from "../services/attendanceService";


import AttendanceForm from "../components/attendance/AttendanceForm";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceSearch from "../components/attendance/AttendanceSearch";
import AttendanceModal from "../components/attendance/AttendanceModal";


import "../styles/attendance.css";



export default function Attendance() {


  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingAttendance, setEditingAttendance] = useState(null);



  // ==========================
  // GET ALL ATTENDANCE
  // ==========================

  const fetchAttendance = async () => {

    try {

      const res = await getAttendance();

      setAttendance(res.data.data || []);

    } catch(error) {

      console.log(error);

    }

  };



  useEffect(() => {

    fetchAttendance();

  }, []);




  // ==========================
  // SAVE / UPDATE
  // ==========================

  const handleSave = async (record) => {

    try {


      if(editingAttendance){


        const res = await updateAttendance(
          editingAttendance._id,
          record
        );


        setAttendance(

          attendance.map((item)=>

            item._id === editingAttendance._id

            ? res.data.data

            : item

          )

        );



      }else{


        const res = await addAttendance(record);



        setAttendance([

          ...attendance,

          res.data.data

        ]);

      }



      setEditingAttendance(null);

      setIsModalOpen(false);



    } catch(error) {


      console.log(error);


    }


  };





  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (record) => {


    setEditingAttendance(record);


    setIsModalOpen(true);


  };






  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (record) => {


    const confirmDelete = window.confirm(

      `Delete attendance of ${record.studentName}?`

    );



    if(!confirmDelete) return;



    try {


      await deleteAttendance(record._id);



      setAttendance(

        attendance.filter(

          (item)=>

          item._id !== record._id

        )

      );



    } catch(error) {


      console.log(error);


    }


  };






  // ==========================
  // SEARCH
  // ==========================

  const filteredAttendance = attendance.filter((item)=>{


    const text = search.toLowerCase();



    return (

      item.studentName
      ?.toLowerCase()
      .includes(text)



      ||



      item.className
      ?.toLowerCase()
      .includes(text)



      ||



      item.section
      ?.toLowerCase()
      .includes(text)

    );


  });







  return (


    <div className="students-page">



      <div className="students-header">



        <h1>
          📅 Attendance Management
        </h1>





        <button

          className="add-btn"

          onClick={()=>{

            setEditingAttendance(null);

            setIsModalOpen(true);

          }}

        >

          + Mark Attendance

        </button>




      </div>





      <AttendanceSearch

        search={search}

        setSearch={setSearch}

      />





      <AttendanceTable

        attendance={filteredAttendance}

        onEdit={handleEdit}

        onDelete={handleDelete}

      />






      <AttendanceModal


        isOpen={isModalOpen}


        title={

          editingAttendance

          ? "Edit Attendance"

          : "Mark Attendance"

        }



        onClose={()=>{


          setEditingAttendance(null);


          setIsModalOpen(false);


        }}


      >



        <AttendanceForm


          onSave={handleSave}


          attendanceData={editingAttendance}


        />



      </AttendanceModal>




    </div>


  );

}