export default function ResultSearch({
  search,
  setSearch,
}) {
  return (
    <div className="result-search">

      <span>
        🔍
      </span>

      <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search result by student, class, exam, subject..."
      />

      {search && (
        <button
          type="button"
          onClick={() =>
            setSearch("")
          }
        >
          ×
        </button>
      )}

    </div>
  );
}