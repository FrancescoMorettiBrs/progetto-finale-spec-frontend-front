export default function GameList({ items }) {
  // Difesa: se items è falsy o vuoto, mostro un messaggio neutro.
  if (!items || items.length === 0) {
    return <p className="text-muted">Nessun gioco disponibile.</p>;
  }

  // UI: elenco Bootstrap con due sole info richieste: title e category
  return (
    <ul className="list-group shadow-sm">
      {items.map((g, i) => {
        // Chiave React:
        // - Preferisco slug quando disponibile (è univoco lato dominio)
        // - Fallback su title-index per evitare warning in sviluppo
        const key = g.slug ?? `${g.title}-${i}`;

        return (
          <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
            {/* Titolo in evidenza */}
            <strong className="me-3">{g.title}</strong>

            {/* Categoria come badge Bootstrap (soft style personalizzato in custom.css) */}
            <span className="badge bg-secondary-subtle text-secondary-emphasis">{g.category}</span>
          </li>
        );
      })}
    </ul>
  );
}
