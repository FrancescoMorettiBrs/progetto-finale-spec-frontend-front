import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareBar() {
  const { selected, remove, clear } = useCompare();
  const location = useLocation();
  const navigate = useNavigate();

  const [warn, setWarn] = useState(""); // messaggio di avviso temporaneo

  // Nascondi la barra nella pagina di confronto
  const hidden = location.pathname.startsWith("/compare");
  const [a, b] = selected;

  const compareHref = useMemo(() => {
    if (!a || !b) return null;
    const params = new URLSearchParams({ a: String(a.id), b: String(b.id) });
    return `/compare?${params.toString()}`;
  }, [a, b]);

  // Auto-hide dell’alert dopo 3s
  useEffect(() => {
    if (!warn) return;
    const t = setTimeout(() => setWarn(""), 3000);
    return () => clearTimeout(t);
  }, [warn]);

  if (hidden) return null;

  const handleCompare = () => {
    if (!a || !b) {
      setWarn("Seleziona due giochi per procedere al confronto.");
      return;
    }
    navigate(compareHref);
  };

  return (
    <div className="compare-bar shadow-lg">
      <div className="container py-2">
        {/* Alert elegante di bootstrap */}
        {warn && (
          <div className="alert alert-warning p-0 d-flex fade show py-2 mb-2 justify-content-between px-2" role="alert">
            {warn}
            <button type="button" className="btn-close" aria-label="Chiudi" onClick={() => setWarn("")}></button>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Slot item={a} onRemove={() => a && remove(a.id)} />
            <span className="text-body-secondary">vs</span>
            <Slot item={b} onRemove={() => b && remove(b.id)} />
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={clear} disabled={!a && !b}>
              Svuota
            </button>

            {/* Invece del Link, uso un button che valida e poi naviga */}
            <button className="btn btn-primary btn-sm" onClick={handleCompare}>
              Confronta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slot({ item, onRemove }) {
  if (!item) {
    return (
      <div className="compare-slot empty">
        <span className="text-body-secondary">Seleziona un gioco</span>
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
