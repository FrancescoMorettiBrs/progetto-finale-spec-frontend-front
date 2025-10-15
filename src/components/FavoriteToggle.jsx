import { useMemo, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";

const BASE_URL = "http://localhost:3001/games";

const unwrap = (data) => data?.game || data?.item || data?.data || data;

export default function FavoriteToggle({ game, variant = "icon", className = "" }) {
  const { isFav, toggle, add } = useFavorites();
  const [busy, setBusy] = useState(false);

  const fav = useMemo(() => isFav(game?.id), [isFav, game?.id]);

  const handleClick = async () => {
    if (!game || game.id == null || busy) return;

    // Se è già preferito -> togli
    if (fav) {
      toggle(game);
      return;
    }

    if (!game.image) {
      try {
        setBusy(true);
        const res = await fetch(`${BASE_URL}/${encodeURIComponent(game.id)}`);
        if (res.ok && (res.headers.get("content-type") || "").includes("application/json")) {
          const data = await res.json();
          const record = unwrap(data) || {};
          const enriched = {
            id: game.id,
            title: game.title ?? record.title,
            category: game.category ?? record.category,
            image: record.image ?? null,
          };
          add(enriched);
          return;
        }
      } catch {
      } finally {
        setBusy(false);
      }
    }

    add({
      id: game.id,
      title: game.title,
      category: game.category,
      image: game.image ?? null,
    });
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        className={`btn ${fav ? "btn-danger" : "btn-outline-danger"} btn-sm ${className}`}
        onClick={handleClick}
        disabled={busy}
        title={fav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      >
        {fav ? "♥ Preferito" : "♡ Aggiungi ai preferiti"}
      </button>
    );
  }

  // variant "icon"
  return (
    <button
      type="button"
      className={`btn btn-sm ${fav ? "btn-danger" : "btn-outline-danger"} ${className}`}
      onClick={handleClick}
      disabled={busy}
      aria-pressed={fav}
      title={fav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      style={{ lineHeight: 1 }}
    >
      {fav ? "♥" : "♡"}
    </button>
  );
}
