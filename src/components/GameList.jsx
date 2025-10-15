import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import FavoriteToggle from "./FavoriteToggle";
import slugify from "../utils/slugify.js";

export default function GameList({ items }) {
  const { add, isSelected, toggleSelect } = useCompare();

  if (!items || items.length === 0) {
    return <p className="text-muted">Nessun gioco disponibile.</p>;
  }

  return (
    <ul className="list-group shadow-sm">
      {items.map((g, i) => {
        const hasId = g?.id != null; // se manca id non linko né comparo
        const key = hasId ? g.id : `${g.title}-${i}`;
        const category = g?.category ?? "—";
        const selected = hasId && isSelected(g.id);
        const slug = g.slug ?? slugify(g.title)

        return (
          <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              {hasId ? (
                <Link to={`/games/${slug}`} className="fw-semibold text-decoration-none" title={g.title}>
                  {g.title}
                </Link>
              ) : (
                <strong className="me-3" title={g.title}>
                  {g.title}
                </strong>
              )}

              <FavoriteToggle game={{ id: g.id, title: g.title, category: g.category, image: g.image }} variant="icon" />

              {/* + Confronta: aggiunge al CompareContext */}
              <button
                className={`btn btn-sm btn-icon ${selected ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => (hasId ? toggleSelect({ id: g.id, title: g.title }) : add({ id: g.id, title: g.title }))}
                disabled={!hasId}
                aria-pressed={selected}
                aria-label={selected ? "Rimuovi dal comparatore" : "Aggiungi al comparatore"}
                title="Confronta"
              >
                ⚔️
              </button>
            </div>

            {/* Badge categoria a destra */}
            <span className="badge bg-secondary-subtle text-secondary-emphasis">{category}</span>
          </li>
        );
      })}
    </ul>
  );
}
