import { useEffect, useMemo, useState } from "react";
import FiltersBar from "./FiltersBar";
import GameList from "./GameList";

const API_URL = "http://localhost:3001/games";

export default function GamesPage() {
  // Stato dati e UI
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Controlli UI (ricerca / filtro / sort)
  const [query, setQuery] = useState(""); // ricerca su title
  const [category, setCategory] = useState("all"); // filtro categoria
  const [sortBy, setSortBy] = useState("title"); // "title" | "category"
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"

  // Fetch iniziale
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError("");
        }

        const res = await fetch(API_URL);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error(`Risposta non JSON da ${API_URL} (Content-Type: ${contentType})`);
        }
        if (!res.ok) {
          throw new Error(`Errore ${res.status}: impossibile caricare i giochi`);
        }
        const data = await res.json();

        const list = Array.isArray(data) ? data : Array.isArray(data?.games) ? data.games : Array.isArray(data?.items) ? data.items : [];

        if (isMounted) setGames(list);
      } catch (e) {
        if (isMounted) setError(e?.message || "Errore imprevisto");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calcolo elenco categorie uniche ordinate alfabeticamente
  const categories = useMemo(() => {
    const set = new Set(
      games.map((g) => g?.category).filter(Boolean) // rimuove null/undefined/"" falsy
    );
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "it", { sensitivity: "base" }))];
  }, [games]);

  // Applico ricerca + filtro + ordinamento in modo memoizzato
  const visibleGames = useMemo(() => {
    // 1) ricerca per titolo (case-insensitive, substring)
    const q = query.trim().toLowerCase();
    let result = games.filter((g) => {
      const title = (g?.title || "").toLowerCase();
      const matchTitle = q ? title.includes(q) : true;

      const matchCategory = category === "all" ? true : g?.category === category;
      return matchTitle && matchCategory;
    });

    // 2) ordinamento
    const dir = sortDir === "desc" ? -1 : 1;
    result = result.slice().sort((a, b) => {
      const A = (a?.[sortBy] || "").toString();
      const B = (b?.[sortBy] || "").toString();
      return A.localeCompare(B, "it", { sensitivity: "base" }) * dir;
    });

    return result;
  }, [games, query, category, sortBy, sortDir]);

  // UI stati
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status" aria-label="Caricamento" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn btn-light btn-sm" onClick={() => location.reload()}>
            Riprova
          </button>
        </div>
      </div>
    );
  }

  // Render pagina: barra controlli + lista
  return (
    <>
      <div className="container mb-3">
        <FiltersBar
          query={query}
          onQueryChange={setQuery}
          category={category}
          categories={categories}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortByChange={setSortBy}
          onSortDirChange={setSortDir}
        />
      </div>

      <div className="container">
        <GameList items={visibleGames} />
      </div>
    </>
  );
}
