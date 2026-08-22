export default function AttendanceSearch({
  search,
  setSearch,
}) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="🔍 Search Student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}