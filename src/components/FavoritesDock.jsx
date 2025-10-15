import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useId, useState } from "react";

export default function FavoritesDock() {
  const { items, remove, clear } = useFavorites();
  const offcanvasId = useId();
  const [open, setOpen] = useState(false);

  const toggleCanvas = () => setOpen((v) => !v);

  return (
    <>
      {/* Floating Button */}
      <button type="button" className="favorites-fab btn btn-danger shadow-lg" onClick={toggleCanvas} aria-controls={offcanvasId} aria-expanded={open} title="Apri i preferiti">
        ♥{items.length > 0 && <span className="badge bg-light text-danger ms-2">{items.length}</span>}
      </button>

      <div id={offcanvasId} className={`favorites-offcanvas ${open ? "show" : ""}`} aria-hidden={!open} role="dialog">
        <div className="favorites-offcanvas-header d-flex justify-content-between">
          <h5 className="mb-0">I miei preferiti</h5>
          <button className="btn-close" aria-label="Chiudi" onClick={toggleCanvas}></button>
        </div>

        <div className="favorites-offcanvas-body">
          {items.length === 0 ? (
            <p className="text-body-secondary mb-0">Nessun preferito. Aggiungi giochi dal catalogo o dal dettaglio.</p>
          ) : (
            <ul className="list-group">
              {items.map((g) => (
                <li key={g.id} className="list-group-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <Thumb src={g.image} alt={g.title} />
                    <div>
                      <div className="fw-semibold">{g.title}</div>
                      <div className="small text-body-secondary">{g.category ?? "—"}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Link className="btn btn-sm btn-outline-primary" to={`/games/${g.id}`} onClick={toggleCanvas}>
                      Apri
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(g.id)} title="Rimuovi">
                      Rimuovi
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="favorites-offcanvas-footer">
          <button className="btn btn-outline-secondary btn-sm me-2" onClick={toggleCanvas}>
            Chiudi
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={clear} disabled={items.length === 0}>
            Svuota
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {open && <div className="favorites-backdrop" onClick={toggleCanvas} />}
    </>
  );
}

function Thumb({ src, alt }) {
  return (
    <div className="fav-thumb">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-96x96.jpg";
          }}
        />
      ) : (
        <div className="fav-thumb-fallback">—</div>
      )}
    </div>
  );
}
