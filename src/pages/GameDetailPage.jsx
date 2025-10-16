import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCompare } from "../context/CompareContext";
import FavoriteToggle from "../components/FavoriteToggle";
import slugify from "../utils/slugify.js";

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

// unwrap generico per risposte tipo { success, game: {...} }
const unwrap = (data) => data?.game || data?.item || data?.data || data;

export default function GameDetailPage() {
  const { id: routeId } = useParams(); // può essere ID o slug
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isSelected, toggleSelect } = useCompare();
  const selected = isSelected(game?.id);

  useEffect(() => {
    let alive = true;

    async function fetchJSON(url) {
      const res = await fetch(url);
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error(`Risposta non JSON da ${url}`);
      if (!res.ok) throw new Error(`Errore ${res.status} su ${url}`);
      return res.json();
    }

    async function resolveIdFromSlug(slug) {
      // 1) Tentativo diretto: /games?slug=...
      try {
        const data = await fetchJSON(`${BASE_URL}?slug=${encodeURIComponent(slug)}`);
        const list = Array.isArray(data) ? data : data?.items || [];
        const hit = list.find((x) => x?.slug === slug);
        if (hit?.id != null) return hit.id;
      } catch {
        // Ignora e passa al fallback
      }

      // 2) Fallback: /games?search=...
      try {
        const q = slug.replace(/-/g, " ");
        const light = await fetchJSON(`${BASE_URL}?search=${encodeURIComponent(q)}`);
        const candidates = Array.isArray(light) ? light : [];
        for (const c of candidates) {
          try {
            const fullData = await fetchJSON(`${BASE_URL}/${encodeURIComponent(c.id)}`);
            const full = unwrap(fullData);
            if (full?.slug === slug) return full.id;
            // ultima chance se il backend non avesse 'slug'
            if (!full?.slug && slugify(full?.title || "") === slug) return full.id;
          } catch {
            // ignora candidato rotto e continua
          }
        }
      } catch {
        // ignora e passa al fallback finale
      }

      // 3) Fallback definitivo: /games (lista completa) → match con slugify(title)
      const all = await fetchJSON(BASE_URL);
      const arr = Array.isArray(all) ? all : [];
      const candidate = arr.find((x) => slugify(x?.title || "") === slug);
      if (candidate?.id != null) return candidate.id;

      throw new Error("Record non trovato");
    }

    async function load() {
      try {
        if (!routeId) throw new Error("Parametro mancante");
        if (alive) {
          setLoading(true);
          setError("");
        }

        // Se numerico, usa direttamente; altrimenti risolvi slug -> id
        const looksNumeric = /^\d+$/.test(String(routeId));
        const realId = looksNumeric ? routeId : await resolveIdFromSlug(String(routeId));

        // Dettaglio per id (qui ottieni TUTTE le proprietà, incluso slug)
        const data = await fetchJSON(`${BASE_URL}/${encodeURIComponent(realId)}`);
        const record = normalizeGame(unwrap(data));
        if (!alive) return;

        setGame(record);

        // Se sei arrivato con ID, sostituisci l'URL con lo slug (SEO/UX)
        if (looksNumeric && record?.slug) {
          navigate(`/games/${record.slug}`, { replace: true });
        }
      } catch (e) {
        if (alive) setError(e?.message || "Errore imprevisto");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
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
        <Link className="btn btn-primary" to="/games">
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
        <h2 className="mb-0 color-w">{fmt(game.title)}</h2>
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
          <Link to="/games" className="btn btn-outline-secondary btn-sm">
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
