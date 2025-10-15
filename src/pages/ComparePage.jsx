import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const BASE_URL = "http://localhost:3001/games";

const toNum = (v) => (typeof v === "number" ? v : Number((v ?? "").toString().replace(",", ".")));
const toArray = (v) =>
  Array.isArray(v)
    ? v
    : typeof v === "string"
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

const normalizeGame = (g) =>
  !g
    ? g
    : {
        ...g,
        price: toNum(g.price),
        stock: toNum(g.stock),
        modes: toArray(g.modes),
        languagesAudio: toArray(g.languagesAudio),
        languagesText: toArray(g.languagesText),
      };

const unwrap = (data) => data?.game || data?.item || data?.data || data;

export default function ComparePage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const idA = params.get("a");
  const idB = params.get("b");

  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (!idA || !idB) throw new Error("Seleziona due giochi per il confronto");
        setLoading(true);
        setError("");

        const [ra, rb] = await Promise.all([fetch(`${BASE_URL}/${encodeURIComponent(idA)}`), fetch(`${BASE_URL}/${encodeURIComponent(idB)}`)]);

        for (const r of [ra, rb]) {
          const ct = r.headers.get("content-type") || "";
          if (!ct.includes("application/json")) throw new Error("Risposta non JSON");
          if (!r.ok) throw new Error(`Errore ${r.status}`);
        }

        const [da, db] = await Promise.all([ra.json(), rb.json()]);
        if (!isMounted) return;
        setA(normalizeGame(unwrap(da)));
        setB(normalizeGame(unwrap(db)));
      } catch (e) {
        if (isMounted) setError(e?.message || "Errore imprevisto");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [idA, idB]);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" />
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!a || !b) return <div className="alert alert-warning">Impossibile caricare i dati di confronto.</div>;

  const Row = ({ label, va, vb, render }) => (
    <tr>
      <th className="bg-body-tertiary" style={{ width: "20%" }}>
        {label}
      </th>
      <td style={{ width: "40%" }}>{render ? render(va) : va ?? "—"}</td>
      <td style={{ width: "40%" }}>{render ? render(vb) : vb ?? "—"}</td>
    </tr>
  );

  const price = (v, c = "EUR") => {
    const n = toNum(v);
    return Number.isFinite(n) ? new Intl.NumberFormat("it-IT", { style: "currency", currency: c }).format(n) : "—";
  };

  const media = (src, alt) => (
    <div className="media-3x4">{src ? <img src={src} alt={alt} loading="lazy" /> : <div className="h-100 d-flex justify-content-center align-items-center bg-light text-body-secondary">—</div>}</div>
  );

  return (
    <section>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">Confronto giochi</h2>
        <Link className="btn btn-outline-secondary btn-sm" to="/">
          ← Torna al catalogo
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-4 mb-3">
            {/* Intestazioni con immagine e titoli */}
            <div className="col-12 col-md-6">
              <div className="d-flex flex-column gap-2">
                {media(a.image, a.title)}
                <div>
                  <div className="fw-semibold">{a.title}</div>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">{a.category}</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex flex-column gap-2">
                {media(b.image, b.title)}
                <div>
                  <div className="fw-semibold">{b.title}</div>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">{b.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabella confronto */}
          <div className="table-responsive">
            <table className="table align-middle">
              <tbody>
                <Row label="Prezzo" va={a.price} vb={b.price} render={(v) => price(v, a.currency || "EUR")} />
                <Row label="Piattaforme" va={a.platform} vb={b.platform} />
                <Row label="Uscita" va={a.releaseDate} vb={b.releaseDate} />
                <Row label="PEGI" va={a.pegi} vb={b.pegi} />
                <Row label="Modalità" va={a.modes} vb={b.modes} render={(v) => (Array.isArray(v) ? v.join(" · ") : v)} />
                <Row label="Developer" va={a.developer} vb={b.developer} />
                <Row label="Publisher" va={a.publisher} vb={b.publisher} />
                <Row label="Disponibilità" va={a.stock} vb={b.stock} render={(v) => (Number.isFinite(toNum(v)) ? `${toNum(v)} copie` : "—")} />
                <Row label="Tag" va={a.tags} vb={b.tags} render={(v) => (Array.isArray(v) ? v.join(", ") : v)} />
                <Row label="Audio" va={a.languagesAudio} vb={b.languagesAudio} render={(v) => (Array.isArray(v) ? v.join(", ") : v)} />
                <Row label="Testo" va={a.languagesText} vb={b.languagesText} render={(v) => (Array.isArray(v) ? v.join(", ") : v)} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
