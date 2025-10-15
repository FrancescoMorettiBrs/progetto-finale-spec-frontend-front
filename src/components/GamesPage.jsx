import { useEffect, useRef, useState } from "react";
import GameList from "./GameList";
import useDebouncedValue from "../hooks/useDebounceValue";

const BASE_URL = "http://localhost:3001/games";

export default function GamesPage() {
  // stati UI
  const [search, setSearch] = useState(""); // testo immediato dell'input
  const [category, setCategory] = useState(""); // filtro categoria
  const [sortBy, setSortBy] = useState("title"); // "title" | "category"
  const [dir, setDir] = useState("asc"); // "asc" | "desc"

  // stato dati
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Applichiamo il debounce SOLO alla ricerca (non a categoria/ordinamento)
  const debouncedSearch = useDebouncedValue(search, 450);

  const reqIdRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const myReqId = ++reqIdRef.current;

    (async () => {
      try {
        setLoading(true);
        setError("");

        // Costruiamo la query (?search, ?category)
        const params = new URLSearchParams();
        if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
        if (category) params.set("category", category);

        const url = `${BASE_URL}${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) throw new Error("Risposta non JSON");

        const data = await res.json(); // lista "leggera" { id, title, category, ... }

        // Se nel frattempo è partita un’altra richiesta, ignora questa risposta
        if (!isMounted || myReqId !== reqIdRef.current) return;

        const sorted = Array.isArray(data) ? [...data] : [];
        sorted.sort((a, b) => {
          const va = String(a?.[sortBy] ?? "").toLowerCase();
          const vb = String(b?.[sortBy] ?? "").toLowerCase();
          if (va < vb) return dir === "asc" ? -1 : 1;
          if (va > vb) return dir === "asc" ? 1 : -1;
          return 0;
        });

        setGames(sorted);
      } catch (e) {
        if (isMounted) setError(e?.message || "Errore imprevisto");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
    // Rinfresca quando cambia: ricerca (debounced)
  }, [debouncedSearch, category, sortBy, dir]);

  return (
    <section className="games-page">
      {/* Filtro / controlli */}
      <div className="row g-3 mb-3 align-items-end">
        <div className="col-12 col-md-6">
          <label className="form-label">Cerca per titolo</label>
          <input
            type="search"
            className="form-control"
            placeholder="Es. Elden Ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label">Categoria</label>
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
          <label className="form-label">Ordina per</label>
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="col-3 col-md-1">
          <label className="form-label">Dir.</label>
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
