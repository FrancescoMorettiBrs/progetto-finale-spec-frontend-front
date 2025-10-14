import { useEffect, useMemo, useState } from "react";
import FiltersBar from "./FiltersBar";
import GameList from "./GameList";

const BASE_URL = "http://localhost:3001/games";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // controlli UI
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError("");
        }

        // Costruisco l’URL con le query supportate dal server
        const params = new URLSearchParams();
        if (query.trim()) params.set("search", query.trim());
        if (category !== "all") params.set("category", category);

        const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const data = await res.json();

        if (isMounted) setGames(Array.isArray(data) ? data : []);
      } catch (e) {
        if (isMounted) setError(e?.message || "Errore imprevisto");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [query, category]); // ricarico quando cambiano search o category

  // categorie 
  const categories = useMemo(() => {
    const set = new Set(games.map((g) => g?.category).filter(Boolean));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "it", { sensitivity: "base" }))];
  }, [games]);

  // ordinamento lato client 
  const visibleGames = useMemo(() => {
    const dir = sortDir === "desc" ? -1 : 1;
    return games.slice().sort((a, b) => {
      const A = (a?.[sortBy] || "").toString();
      const B = (b?.[sortBy] || "").toString();
      return A.localeCompare(B, "it", { sensitivity: "base" }) * dir;
    });
  }, [games, sortBy, sortDir]);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" />
      </div>
    );
  if (error)
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

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
