export default function FiltersBar({ query, onQueryChange, category, categories, onCategoryChange, sortBy, sortDir, onSortByChange, onSortDirChange }) {
  return (
    <form className="row g-2 align-items-end">
      {/* Ricerca per titolo */}
      <div className="col-12 col-md-6">
        <label htmlFor="search" className="form-label mb-1">
          Cerca per titolo
        </label>
        <input id="search" type="text" className="form-control" placeholder="Es. Elden Ring" value={query} onChange={(e) => onQueryChange(e.target.value)} />
      </div>

      {/* Filtro categoria */}
      <div className="col-6 col-md-3">
        <label htmlFor="category" className="form-label mb-1">
          Categoria
        </label>
        <select id="category" className="form-select" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Tutte" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Ordinamento */}
      <div className="col-6 col-md-3">
        <div className="d-flex gap-2">
          <div className="flex-fill">
            <label htmlFor="sortBy" className="form-label mb-1">
              Ordina per
            </label>
            <select id="sortBy" className="form-select" value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div style={{ width: 110 }}>
            <label htmlFor="sortDir" className="form-label mb-1">
              Direzione
            </label>
            <select id="sortDir" className="form-select" value={sortDir} onChange={(e) => onSortDirChange(e.target.value)}>
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
