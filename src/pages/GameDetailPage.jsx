import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCompare } from "../context/CompareContext";
import FavoriteToggle from "../components/FavoriteToggle";

const BASE_URL = "http://localhost:3001/games";

const toNum = (v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const s = v.replace(",", ".").trim();
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
};

const toArray = (v) =>
  Array.isArray(v)
    ? v
    : typeof v === "string"
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

const normalizeGame = (g) => {
  if (!g || typeof g !== "object") return g;
  return {
    ...g,
    price: toNum(g.price),
    stock: toNum(g.stock),
    modes: toArray(g.modes),
    languagesAudio: toArray(g.languagesAudio),
    languagesText: toArray(g.languagesText),
  };
};

/* ---------- Formatter ---------- */
const fmt = (v, fallback = "—") => {
  if (v == null) return fallback;
  const s = String(v).trim();
  return s === "" ? fallback : s;
};

const fmtPrice = (price, currency = "EUR") => {
  const n = toNum(price);
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
};

export default function GameDetailPage() {
  const { id: routeId } = useParams(); // ID come stringa
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { add } = useCompare();
  const { isSelected, toggleSelect } = useCompare();
  const selected = isSelected(game?.id);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (!routeId) throw new Error("ID mancante nella URL");
        if (isMounted) {
          setLoading(true);
          setError("");
        }

        const url = `${BASE_URL}/${encodeURIComponent(routeId)}`;
        const res = await fetch(url);

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          throw new Error(`Risposta non JSON da ${url} (Content-Type: ${ct})`);
        }
        if (res.status === 404) throw new Error("Record non trovato");
        if (!res.ok) throw new Error(`Errore ${res.status}`);

        const data = await res.json();

        const record = data && (data.game || data.item || data.data) ? data.game || data.item || data.data : data;

        const normalized = normalizeGame(record);
        if (isMounted) setGame(normalized);
      } catch (e) {
        if (isMounted) setError(e?.message || "Errore imprevisto");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [routeId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status" aria-label="Caricamento" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
        <span>{error}</span>
        <button className="btn btn-light btn-sm" onClick={() => location.reload()}>
          Riprova
        </button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-5">
        <h2 className="h5 mb-3">Gioco non trovato</h2>
        <Link className="btn btn-primary" to="/">
          Torna alla lista
        </Link>
      </div>
    );
  }

  const modes = toArray(game.modes);
  const langsAudio = toArray(game.languagesAudio);
  const langsText = toArray(game.languagesText);

  return (
    <article className="game-detail">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">{fmt(game.title)}</h2>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className={`btn btn-sm ${selected ? "btn-primary" : "btn-outline-primary"} btn-icon`}
            onClick={() => toggleSelect({ id: game.id, title: game.title })}
            aria-pressed={selected}
            title={selected ? "Rimuovi dal comparatore" : "Aggiungi al comparatore"}
          >
            ⚔️
          </button>

          <FavoriteToggle game={game} variant="button" />
          <Link to="/" className="btn btn-outline-secondary btn-sm">
            ← Torna alla lista
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Immagine */}
        <div className="col-12 col-md-4">
          <div className="media-3x4">
            {typeof game.image === "string" && game.image.trim() ? (
              <img
                src={game.image}
                alt={game.title}
                loading="lazy"
                onError={(e) => {
                  // fallback se l'URL non carica
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/placeholder-600x800.jpg";
                }}
              />
            ) : (
              <div className="h-100 d-flex justify-content-center align-items-center bg-light text-body-secondary">Nessuna immagine</div>
            )}
          </div>
        </div>

        {/* Dati */}
        <div className="col-12 col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {game.category && <span className="badge bg-secondary-subtle text-secondary-emphasis">{game.category}</span>}
                {game.pegi != null && <span className="badge bg-dark">PEGI {game.pegi}</span>}
                {modes.length > 0 && <span className="badge bg-info-subtle text-info-emphasis">{modes.join(" · ")}</span>}
              </div>

              <dl className="row mb-0">
                <dt className="col-sm-4">Prezzo</dt>
                <dd className="col-sm-8">{fmtPrice(game.price, game.currency)}</dd>

                <dt className="col-sm-4">Piattaforme</dt>
                <dd className="col-sm-8">{fmt(game.platform)}</dd>

                <dt className="col-sm-4">Uscita</dt>
                <dd className="col-sm-8">{fmt(game.releaseDate)}</dd>

                <dt className="col-sm-4">Developer</dt>
                <dd className="col-sm-8">{fmt(game.developer)}</dd>

                <dt className="col-sm-4">Publisher</dt>
                <dd className="col-sm-8">{fmt(game.publisher)}</dd>

                <dt className="col-sm-4">Disponibilità</dt>
                <dd className="col-sm-8">{Number.isFinite(toNum(game.stock)) ? `${toNum(game.stock)} copie` : "—"}</dd>

                {Array.isArray(game.tags) && game.tags.length > 0 && (
                  <>
                    <dt className="col-sm-4">Tag</dt>
                    <dd className="col-sm-8">
                      <div className="d-flex flex-wrap gap-2">
                        {game.tags.map((t, i) => (
                          <span key={i} className="badge bg-light text-body-secondary border">
                            {t}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </>
                )}

                {langsAudio.length > 0 && (
                  <>
                    <dt className="col-sm-4">Audio</dt>
                    <dd className="col-sm-8">{langsAudio.join(", ")}</dd>
                  </>
                )}

                {langsText.length > 0 && (
                  <>
                    <dt className="col-sm-4">Testo</dt>
                    <dd className="col-sm-8">{langsText.join(", ")}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
