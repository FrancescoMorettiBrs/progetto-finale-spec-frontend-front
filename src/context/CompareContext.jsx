import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import slugify from "../utils/slugify";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [selected, setSelected] = useState(() => {
    try {
      // Persistenza: prova a leggere compare:selected da localStorage.
      const raw = localStorage.getItem("compare:selected");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem("compare:selected", JSON.stringify(selected)); // trasformo l’oggetto in una stringa per localStorage
    } catch (err) {
      console.error(err);
    }
  }, [selected]); // Ogni volta che selected cambia, salva la nuova lista in localStorage.

  const add = useCallback((item) => {
    // Validazione
    if (!item || item.id == null) return;
    setSelected((prev) => {
      // No duplicati
      if (prev.some((x) => x.id === item.id)) return prev;
      // Snapshot minimo
      const snapshot = { id: item.id, title: item.title, slug: item.slug ?? slugify(item.title) };
      return [...prev, snapshot].slice(-2); // .slice(-2): mantiene solo gli ultimi 2 elementi
    });
  }, []);

  const remove = useCallback((id) => {
    // Rimuovo l'elememnto con lo stesso id
    setSelected((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clear = useCallback(() => setSelected([]), []); // Svuoto la sezione

  const isSelected = useCallback(
    (id) => selected.some((x) => x.id === id), // Helper pulsante selezionato
    [selected]
  );

  const toggleSelect = useCallback((item) => {
    // Validazione
    if (!item || item.id == null) return;
    setSelected((prev) => {
      // Esiste? Allora lo tolgo
      const exists = prev.some((x) => x.id === item.id);
      if (exists) return prev.filter((x) => x.id !== item.id);
      const snapshot = { id: item.id, title: item.title, slug: item.slug ?? slugify(item.title) };
      return [...prev, snapshot].slice(-2); // .slice(-2): mantiene solo gli ultimi 2 elementi
    });
  }, []);

  const value = useMemo(() => ({ selected, add, remove, clear, isSelected, toggleSelect }), [selected, add, remove, clear, isSelected, toggleSelect]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare deve essere usato dentro <CompareProvider>");
  return ctx;
}
