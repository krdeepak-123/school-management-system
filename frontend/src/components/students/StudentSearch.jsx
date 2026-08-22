import "../../styles/students.css";

export default function StudentSearch({
  search,
  setSearch,
  filterClass,
  setFilterClass,
}) {
  return (
    <div className="student-search">

      <input
        type="text"
        placeholder="🔍 Search Student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filterClass}
        onChange={(e) => setFilterClass(e.target.value)}
      >
        <option value="">All Classes</option>
        <option>Class 1</option>
        <option>Class 2</option>
        <option>Class 3</option>
        <option>Class 4</option>
        <option>Class 5</option>
        <option>Class 6</option>
        <option>Class 7</option>
        <option>Class 8</option>
        <option>Class 9</option>
        <option>Class 10</option>
        <option>Class 11</option>
        <option>Class 12</option>
      </select>

    </div>
  );
}