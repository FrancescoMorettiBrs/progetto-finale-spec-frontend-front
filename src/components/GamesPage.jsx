import { useEffect, useState } from "react";
import GameList from "./GameList";
import useDebouncedValue from "../hooks/useDebounceValue";

const BASE_URL = "http://localhost:3001/games";

export default function GamesPage() {
  // UI
  const [search, setSearch] = useState(""); // Testo cercato
  const [category, setCategory] = useState(""); // Filtro categoria
  const [sortBy, setSortBy] = useState("title"); // Campo su cui ordinare(default: Titolo)
  const [dir, setDir] = useState("asc"); // Direzione ordinamento

  // Data
  const [games, setGames] = useState([]); // Risultati
  const [loading, setLoading] = useState(false); // Caricamento
  const [error, setError] = useState(""); // Gestione eventuale errore

  const debouncedSearch = useDebouncedValue(search, 500); // Ricerca con Debounce

  // Carica + ordina
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Inizio caricamento e pulizia eventuali errori precedenti
        setLoading(true);
        setError("");

        // Costruisco la query string
        const qs = new URLSearchParams();
        if (debouncedSearch) qs.set("search", debouncedSearch); // Filtro testuale
        if (category) qs.set("category", category); // Filtro categorico

        // Chiamata API
        const res = await fetch(`${BASE_URL}${qs.size ? `?${qs}` : ""}`);
        if (!res.ok) throw new Error(`Errore ${res.status}`);

        // Ottengo l'array
        const data = await res.json();

        // Se il componente si è smontato, esco
        if (!alive) return;

        // Ordinamento
        const sorted = [...data].sort((a, b) => {
          // Validazione
          const A = String(a?.[sortBy] ?? "").toLowerCase();
          const B = String(b?.[sortBy] ?? "").toLowerCase();
          return dir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        });

        // Aggiorno con i dati ordinati
        setGames(sorted);
      } catch (e) {
        if (alive) setError(e.message || "Errore imprevisto"); // Gestisco un eventuale errore
      } finally {
        if (alive) setLoading(false); // FIne caricamento, se montato
      }
    })();
    return () => {
      alive = false; // Cleanup dell'effetto
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
