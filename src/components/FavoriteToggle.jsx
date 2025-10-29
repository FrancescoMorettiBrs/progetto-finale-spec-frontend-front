import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";

const BASE_URL = "http://localhost:3001/games";

export default function FavoriteToggle({ game, variant = "icon", className = "" }) {
  const { isFav, toggle, add } = useFavorites();
  const [busy, setBusy] = useState(false);

  const fav = isFav(game?.id);

  const handleClick = async () => {
    if (!game || game.id == null || busy) return;

    // già preferito => rimuovo
    if (fav) {
      toggle(game);
      return;
    }

    // se non ho l'immagine, la recupero dall'API prima di aggiungere
    if (!game.image) {
      try {
        setBusy(true);
        const res = await fetch(`${BASE_URL}/${game.id}`);
        if (res.ok) {
          const data = await res.json();
          add({
            id: game.id,
            title: game.title,
            category: game.category,
            image: data.game.image,
          });
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setBusy(false);
      }
    }

    add({
      id: game.id,
      title: game.title,
      category: game.category,
      image: game.image,
    });
  };

  // variante "button" testuale
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

  // variante "icon" (solo cuore)
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
