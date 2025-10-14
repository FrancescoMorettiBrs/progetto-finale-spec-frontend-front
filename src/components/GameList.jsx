import { Link } from "react-router-dom";

export default function GameList({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-muted">Nessun gioco disponibile.</p>;
  }

  return (
    <ul className="list-group shadow-sm">
      {items.map((g, i) => {
        const hasId = g?.id != null;
        const key = hasId ? g.id : `${g.title}-${i}`;
        const category = g.category || "—";

        return (
          <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
            {hasId ? (
              <Link to={`/games/${g.id}`} className="fw-semibold text-decoration-none" aria-label={`Vai al dettaglio di ${g.title}`} title={g.title}>
                {g.title}
              </Link>
            ) : (
              // Se manca l'id, mostro solo testo e un hint in console
              <strong className="me-3" title={g.title}>
                {g.title}
              </strong>
            )}

            <span className="badge bg-secondary-subtle text-secondary-emphasis">{category}</span>
          </li>
        );
      })}
    </ul>
  );
}
