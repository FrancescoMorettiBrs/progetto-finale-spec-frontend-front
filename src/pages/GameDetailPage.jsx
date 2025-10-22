import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCompare } from "../context/CompareContext";
import FavoriteToggle from "../components/FavoriteToggle";
import slugify from "../utils/slugify.js";

const BASE_URL = "http://localhost:3001/games";

// --- Helper ---
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Errore ${res.status} su ${url}`);
  return res.json();
}

async function fetchById(id) {
  const data = await fetchJSON(`${BASE_URL}/${encodeURIComponent(id)}`);
  return data.game || data;
}

async function resolveIdBySlug(slug) {
  try {
    const data = await fetchJSON(`${BASE_URL}?slug=${encodeURIComponent(slug)}`);
    const arr = Array.isArray(data) ? data : [];
    const findSlug = arr.find((g) => g?.slug === slug);
    if (findSlug?.id != null) return findSlug.id;
  } catch (err) {
    console.err(err);
  }

  const all = await fetchJSON(BASE_URL);
  const list = Array.isArray(all) ? all : [];
  const exact = list.find((g) => g?.slug === slug);
  if (exact?.id != null) return exact.id;

  const byTitle = list.find((g) => slugify(g?.title || "") === slug);
  if (byTitle?.id != null) return byTitle.id;

  throw new Error("Gioco non trovato");
}

export default function GameDetailPage() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isSelected, toggleSelect } = useCompare();
  const selected = isSelected(game?.id);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!routeId) throw new Error("Parametro mancante");
        setLoading(true);
        setError("");

        const isNumeric = /^\d+$/.test(String(routeId));
        const id = isNumeric ? routeId : await resolveIdBySlug(String(routeId));
        const full = await fetchById(id);
        if (!alive) return;

        setGame(full);

        if (isNumeric && full?.slug) {
          navigate(`/games/${full.slug}`, { replace: true });
        }
      } catch (e) {
        if (alive) setError(e?.message || "Errore imprevisto");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [routeId, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status" aria-label="Caricamento" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn btn-light btn-sm" onClick={() => location.reload()}>
            Riprova
          </button>
        </div>
        <div>
          <Link className="btn btn-primary" to="/games">
            Torna alla lista
          </Link>
        </div>
      </>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-5">
        <h2 className="h5 mb-3">Gioco non trovato</h2>
        <Link className="btn btn-primary" to="/games">
          Torna alla lista
        </Link>
      </div>
    );
  }

  return (
    <article className="game-detail">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 color-w">{game.title ?? "—"}</h2>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className={`btn btn-sm ${selected ? "btn-primary" : "btn-outline-primary"} btn-icon`}
            onClick={() => toggleSelect({ id: game.id, title: game.title, slug: game.slug })}
            aria-pressed={selected}
            title={selected ? "Rimuovi dal comparatore" : "Aggiungi al comparatore"}
          >
            ⚔️
          </button>

          <FavoriteToggle game={game} variant="button" />
          <Link to="/games" className="btn btn-outline-secondary btn-sm">
            ← Torna alla lista
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Immagine */}
        <div className="col-12 col-md-4">
          <div className="media-3x4">
            {game.image ? (
              <img
                src={game.image}
                alt={game.title}
                loading="lazy"
                onError={(e) => {
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
                {game.modes?.length > 0 && <span className="badge bg-info-subtle text-info-emphasis">{game.modes.join(" · ")}</span>}
              </div>

              <dl className="row mb-0">
                <dt className="col-sm-4">Prezzo</dt>
                <dd className="col-sm-8">{game.price} €</dd>

                <dt className="col-sm-4">Piattaforme</dt>
                <dd className="col-sm-8">{game.platform ?? "—"}</dd>

                <dt className="col-sm-4">Uscita</dt>
                <dd className="col-sm-8">{game.releaseDate ?? "—"}</dd>

                <dt className="col-sm-4">Developer</dt>
                <dd className="col-sm-8">{game.developer ?? "—"}</dd>

                <dt className="col-sm-4">Publisher</dt>
                <dd className="col-sm-8">{game.publisher ?? "—"}</dd>

                <dt className="col-sm-4">Disponibilità</dt>
                <dd className="col-sm-8">{game.stock ? `${game.stock} copie` : "—"}</dd>

                {game.tags?.length > 0 && (
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

                {game.languagesAudio?.length > 0 && (
                  <>
                    <dt className="col-sm-4">Audio</dt>
                    <dd className="col-sm-8">{game.languagesAudio.join(", ")}</dd>
                  </>
                )}

                {game.languagesText?.length > 0 && (
                  <>
                    <dt className="col-sm-4">Testo</dt>
                    <dd className="col-sm-8">{game.languagesText.join(", ")}</dd>
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
