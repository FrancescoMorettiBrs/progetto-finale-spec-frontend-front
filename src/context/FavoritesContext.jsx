import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  // Inizializza da localStorage
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites:items");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Persiste ogni modifica
  useEffect(() => {
    try {
      localStorage.setItem("favorites:items", JSON.stringify(items));
    } catch {}
  }, [items]);

  // Aggiunge se non presente (id come chiave)
  const add = (game) => {
    if (!game || game.id == null) return;
    setItems((prev) => {
      if (prev.some((x) => String(x.id) === String(game.id))) return prev;
      // snapshot minimale per UI veloce
      const snapshot = {
        id: game.id,
        title: game.title,
        category: game.category,
        image: game.image,
      };
      return [snapshot, ...prev];
    });
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((x) => String(x.id) !== String(id)));
  };

  const toggle = (game) => {
    if (!game || game.id == null) return;
    setItems((prev) => {
      const exists = prev.some((x) => String(x.id) === String(game.id));
      return exists ? prev.filter((x) => String(x.id) !== String(game.id)) : [{ id: game.id, title: game.title, category: game.category, image: game.image }, ...prev];
    });
  };

  const isFav = (id) => items.some((x) => String(x.id) === String(id));

  const clear = () => setItems([]);

  const value = useMemo(() => ({ items, add, remove, toggle, isFav, clear }), [items]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites deve essere usato dentro <FavoritesProvider>");
  return ctx;
}
