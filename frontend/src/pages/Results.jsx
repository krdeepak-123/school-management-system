import { useEffect, useState } from "react";

import {
  getResults,
  addResult,
  updateResult,
  deleteResult,
} from "../services/resultService";

import ResultForm from "../components/results/ResultForm";
import ResultModal from "../components/results/ResultModal";
import ResultSearch from "../components/results/ResultSearch";
import ResultTable from "../components/results/ResultTable";

import "../styles/results.css";

export default function Results() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);

      const data = await getResults();

      setResults(data || []);
    } catch (error) {
      console.error("Result Load Error:", error);

      setResults([]);

      alert(
        error.response?.data?.message ||
          "Failed to load results"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (resultData) => {
    try {
      if (editingResult) {
        await updateResult(
          editingResult._id,
          resultData
        );

        alert("Result Updated Successfully");
      } else {
        await addResult(resultData);

        alert("Result Added Successfully");
      }

      await fetchResults();

      setEditingResult(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Result Save Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save result"
      );
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setIsModalOpen(true);
  };

  const handleDelete = async (result) => {
    const confirmDelete = window.confirm(
      `Delete result of ${result.studentName}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteResult(result._id);

      await fetchResults();

      alert("Result Deleted Successfully");
    } catch (error) {
      console.error(
        "Result Delete Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete result"
      );
    }
  };

  const filteredResults = results.filter(
    (item) => {
      const text = search
        .toLowerCase()
        .trim();

      if (!text) return true;

      return (
        item.resultId
          ?.toLowerCase()
          .includes(text) ||

        item.studentName
          ?.toLowerCase()
          .includes(text) ||

        item.className
          ?.toLowerCase()
          .includes(text) ||

        item.section
          ?.toLowerCase()
          .includes(text) ||

        String(item.rollNo || "")
          .toLowerCase()
          .includes(text) ||

        item.exam
          ?.toLowerCase()
          .includes(text) ||

        item.subject
          ?.toLowerCase()
          .includes(text) ||

        item.grade
          ?.toLowerCase()
          .includes(text) ||

        item.status
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  const handleAddResult = () => {
    setEditingResult(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingResult(null);
    setIsModalOpen(false);
  };

  const passedResults = results.filter(
    (item) => item.status === "Pass"
  ).length;

  const failedResults = results.filter(
    (item) => item.status === "Fail"
  ).length;

  return (
    <div className="results-page">

      <div className="results-header">
        <div>
          <h1>📝 Result Management</h1>

          <p>
            Manage student examination results
          </p>
        </div>

        <button
          type="button"
          className="result-add-btn"
          onClick={handleAddResult}
        >
          + Add Result
        </button>
      </div>

      <ResultSearch
        search={search}
        setSearch={setSearch}
      />

      <div className="result-summary">

        <div className="summary-card">
          <span>Total Results</span>
          <strong>
            {loading ? "..." : results.length}
          </strong>
        </div>

        <div className="summary-card">
          <span>Showing</span>
          <strong>
            {loading
              ? "..."
              : filteredResults.length}
          </strong>
        </div>

        <div className="summary-card">
          <span>Passed</span>
          <strong>
            {loading
              ? "..."
              : passedResults}
          </strong>
        </div>

        <div className="summary-card">
          <span>Failed</span>
          <strong>
            {loading
              ? "..."
              : failedResults}
          </strong>
        </div>

      </div>

      {loading ? (
        <div className="result-loading">
          Loading Results...
        </div>
      ) : (
        <ResultTable
          results={filteredResults}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ResultModal
        isOpen={isModalOpen}
        title={
          editingResult
            ? "Edit Result"
            : "Add Result"
        }
        onClose={handleCloseModal}
      >
        <ResultForm
          onSave={handleSave}
          resultData={editingResult}
        />
      </ResultModal>

    </div>
  );
}