import { createContext, useContext, useEffect, useMemo, useState } from "react";
import slugify from "../utils/slugify.js";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  // Ogni elemento: { id, title }
  const [selected, setSelected] = useState(() => {
    try {
      const raw = localStorage.getItem("compare:selected");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("compare:selected", JSON.stringify(selected));
    } catch {}
  }, [selected]);

  const add = (item) => {
    if (!item || item.id == null) return;
    setSelected((prev) => {
      if (prev.some((x) => String(x.id) === String(item.id))) return prev;
      const snapshot = { id: item.id, title: item.title, slug: item.slug ?? slugify(item.title) };
      const next = [...prev, snapshot];
      return next.slice(-2); // max 2
    });
  };

  const remove = (id) => {
    setSelected((prev) => prev.filter((x) => String(x.id) !== String(id)));
  };

  const clear = () => setSelected([]);

  const isSelected = (id) => selected.some((x) => String(x.id) === String(id));

  const toggleSelect = (item) => {
    if (!item || item.id == null) return;
    setSelected((prev) => {
      const exists = prev.some((x) => String(x.id) === String(item.id));
      if (exists) return prev.filter((x) => String(x.id) !== String(item.id));
      const snapshot = { id: item.id, title: item.title, slug: item.slug ?? slugify(item.title) }; // 👈
      const next = [...prev, snapshot];
      return next.slice(-2);
    });
  };

  // nel value:
  const value = useMemo(() => ({ selected, add, remove, clear, isSelected, toggleSelect }), [selected]);
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare deve essere usato dentro <CompareProvider>");
  return ctx;
}
