import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareBar() {
  const { selected, remove, clear } = useCompare();
  const location = useLocation();
  const navigate = useNavigate();

  const [warn, setWarn] = useState("");

  // Nascondo la barra nella pagina di confronto
  const hidden = location.pathname.startsWith("/compare");
  if (hidden) return null;

  const [a, b] = selected;

  // URL di confronto: lo ricalcolo solo quando cambiano gli slug
  const compareHref = useMemo(() => {
    if (!a || !b || !a.slug || !b.slug) return null;
    const qs = new URLSearchParams({ a: a.slug, b: b.slug }).toString();
    return `/compare?${qs}`;
  }, [a?.slug, b?.slug]);

  // Avviso che si chiude da solo dopo 2.5s
  useEffect(() => {
    if (!warn) return;
    const t = setTimeout(() => setWarn(""), 2500);
    return () => clearTimeout(t);
  }, [warn]);

  const handleCompare = () => {
    if (!a || !b) {
      setWarn("Seleziona due giochi per procedere al confronto.");
      return;
    }
    if (!compareHref) {
      setWarn("Dati incompleti: mancano gli slug dei giochi selezionati.");
      return;
    }
    navigate(compareHref);
  };

  function Slot({ item, onRemove }) {
    if (!item) {
      return (
        <div className="compare-slot empty">
          <span>Seleziona un gioco</span>
        </div>
      );
    }
    return (
      <div className="compare-slot">
        <strong className="me-2">{item.title}</strong>
        <button type="button" className="btn-close btn-close-white btn-close-sm" aria-label="Rimuovi" onClick={onRemove} />
      </div>
    );
  }

  return (
    <div className="compare-bar shadow-lg">
      <div className="container py-2">
        {warn && (
          <div className="alert alert-warning p-0 d-flex fade show py-2 mb-2 justify-content-between px-2" role="alert">
            {warn}
            <button type="button" className="btn-close" aria-label="Chiudi" onClick={() => setWarn("")}></button>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Slot item={a} onRemove={() => a && remove(a.id)} />
            <span className="text-body-secondary">⚔️</span>
            <Slot item={b} onRemove={() => b && remove(b.id)} />
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={clear} disabled={!a && !b}>
              Svuota
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleCompare}>
              Confronta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
