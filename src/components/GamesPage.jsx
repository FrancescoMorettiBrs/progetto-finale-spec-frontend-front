import { useEffect, useState } from "react";
import GameList from "./GameList";
import useDebouncedValue from "../hooks/useDebounceValue";
import { useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

const BASE_URL = "http://localhost:3001/games";

export default function GamesPage() {
  // UI
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [dir, setDir] = useState("asc");

  // Data
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useDebouncedValue(search, 500);
  const { openDock } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();

  // Apri dock se ?open=favorites (e pulisci la query)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("open") === "favorites") {
      openDock();
      params.delete("open");
      navigate({ search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
    }
  }, [location.search, openDock, navigate]);

  // Carica + ordina
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const qs = new URLSearchParams();
        if (debouncedSearch) qs.set("search", debouncedSearch);
        if (category) qs.set("category", category);

        const res = await fetch(`${BASE_URL}${qs.size ? `?${qs}` : ""}`);
        if (!res.ok) throw new Error(`Errore ${res.status}`);

        const data = await res.json();
        if (!alive) return;

        const sorted = [...data].sort((a, b) => {
          const A = String(a?.[sortBy] ?? "").toLowerCase();
          const B = String(b?.[sortBy] ?? "").toLowerCase();
          return dir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        });

        setGames(sorted);
      } catch (e) {
        if (alive) setError(e.message || "Errore imprevisto");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [debouncedSearch, category, sortBy, dir]);

  return (
    <section className="games-page">
      {/* Filtri */}
      <div className="row g-3 mb-3 align-items-end">
        <div className="col-12 col-md-6">
          <label className="form-label color-w">Cerca per titolo</label>
          <input type="search" className="form-control" placeholder="Es. Elden Ring" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label color-w">Categoria</label>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Tutte</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="RPG">RPG</option>
            <option value="Shooter">Shooter</option>
            <option value="Racing">Racing</option>
            <option value="Simulation">Simulation</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <div className="col-3 col-md-2">
          <label className="form-label color-w">Ordina per</label>
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Titolo</option>
            <option value="category">Categoria</option>
          </select>
        </div>

        <div className="col-3 col-md-1">
          <label className="form-label color-w">Dir.</label>
          <select className="form-select" value={dir} onChange={(e) => setDir(e.target.value)}>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>
      </div>

      {/* Stato */}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border" role="status" aria-label="Caricamento" />
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Lista */}
      {!loading && !error && <GameList items={games} />}
    </section>
  );
}
