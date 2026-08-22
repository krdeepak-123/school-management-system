export default function ClassSearch({
  search,
  setSearch,
}) {
  return (
    <div className="student-search">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search Class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}