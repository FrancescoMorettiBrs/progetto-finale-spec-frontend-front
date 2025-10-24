import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  // UI: dock aperta/chiusa
  const [isOpen, setIsOpen] = useState(false);
  const openDock = useCallback(() => setIsOpen(true), []);
  const closeDock = useCallback(() => setIsOpen(false), []);
  const toggleDock = useCallback(() => setIsOpen((v) => !v), []);

  // Dati: lista preferiti (id, title, category, image)
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites:items");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persisto nel browser ogni volta che cambia items
  useEffect(() => {
    try {
      localStorage.setItem("favorites:items", JSON.stringify(items));
    } catch {}
  }, [items]);

  // Aggiungo in cima se non presente
  const add = useCallback((game) => {
    // Validazione
    if (!game || game.id == null) return;
    setItems((prev) => {
      // No duplicati
      if (prev.some((x) => x.id === game.id)) return prev;
      const snapshot = { id: game.id, title: game.title, category: game.category, image: game.image };
      return [snapshot, ...prev];
    });
  }, []);

  // Rimuovo per id
  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // Toggle add/remove
  const toggle = useCallback((game) => {
    if (!game || game.id == null) return;
    setItems((prev) => {
      // Esiste? Allora lo tolgo
      const exists = prev.some((x) => x.id === game.id);
      return exists ? prev.filter((x) => x.id !== game.id) : [{ id: game.id, title: game.title, category: game.category, image: game.image }, ...prev];
    });
  }, []);

  // Guardo se è tra i preferiti
  const isFav = useCallback((id) => items.some((x) => x.id === id), [items]);

  // Svuota tutto
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      add,
      remove,
      toggle,
      isFav,
      clear,
      isOpen,
      openDock,
      closeDock,
      toggleDock,
    }),
    [items, isOpen, add, remove, toggle, isFav, clear, openDock, closeDock, toggleDock]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites deve essere usato dentro <FavoritesProvider>");
  return ctx;
}
