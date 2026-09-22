import { useEffect, useState } from "react";

import {
  getFees,
  addFee,
  updateFee,
  deleteFee,
} from "../services/feeService";

import FeeForm from "../components/fees/FeeForm";
import FeeTable from "../components/fees/FeeTable";
import FeeSearch from "../components/fees/FeeSearch";
import FeeModal from "../components/fees/FeeModal";

import "../styles/fees.css";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  // ==========================================
  // LOAD FEES
  // ==========================================
  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const data = await getFees();

      setFees(data || []);
    } catch (error) {
      console.error("Fee Load Error:", error);

      setFees([]);

      alert(
        error.response?.data?.message ||
        "Unable to load fees"
      );
    }
  };

  // ==========================================
  // SAVE / UPDATE FEE
  // ==========================================
  const handleSave = async (feeData) => {
    try {
      if (editingFee) {
        await updateFee(
          editingFee._id,
          feeData
        );
      } else {
        await addFee(feeData);
      }

      await fetchFees();

      setEditingFee(null);
      setIsModalOpen(false);

    } catch (error) {
      console.error("Fee Save Error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to save fee"
      );
    }
  };

  // ==========================================
  // EDIT FEE
  // ==========================================
  const handleEdit = (fee) => {
    setEditingFee(fee);
    setIsModalOpen(true);
  };

  // ==========================================
  // DELETE FEE
  // ==========================================
  const handleDelete = async (fee) => {
    if (
      !window.confirm(
        `Delete fee of ${fee.studentName}?`
      )
    ) {
      return;
    }

    try {
      await deleteFee(fee._id);

      await fetchFees();

    } catch (error) {
      console.error("Fee Delete Error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to delete fee"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================
  const filteredFees = fees.filter((fee) => {
    const text = search.toLowerCase();

    return (
      fee.studentName
        ?.toLowerCase()
        .includes(text) ||

      fee.className
        ?.toLowerCase()
        .includes(text) ||

      fee.section
        ?.toLowerCase()
        .includes(text) ||

      fee.feeId
        ?.toLowerCase()
        .includes(text)
    );
  });

  // ==========================================
  // ADD FEE
  // ==========================================
  const handleAddFee = () => {
    setEditingFee(null);
    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const handleClose = () => {
    setEditingFee(null);
    setIsModalOpen(false);
  };

  return (
    <div>

      {/* ================================
          HEADER
      ================================= */}

      <div className="students-header">

        <h1>💰 Fee Management</h1>

        <button
          className="add-btn"
          onClick={handleAddFee}
        >
          + Add Fee
        </button>

      </div>

      {/* ================================
          SEARCH
      ================================= */}

      <FeeSearch
        search={search}
        setSearch={setSearch}
      />

      {/* ================================
          FEE TABLE
      ================================= */}

      <FeeTable
        fees={filteredFees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ================================
          FEE MODAL
      ================================= */}

      <FeeModal
        isOpen={isModalOpen}
        title={
          editingFee
            ? "Edit Fee"
            : "Add Fee"
        }
        onClose={handleClose}
      >

        <FeeForm
          onSave={handleSave}
          feeData={editingFee}
        />

      </FeeModal>

    </div>
  );
}