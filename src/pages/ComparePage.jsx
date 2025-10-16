import { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import slugify from "../utils/slugify.js";

const BASE_URL = "http://localhost:3001/games";
const unwrap = (d) => d?.game || d?.item || d?.data || d;

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
const normalize = (g) => (!g ? g : { ...g, price: toNum(g.price), stock: toNum(g.stock), modes: toArray(g.modes), languagesAudio: toArray(g.languagesAudio), languagesText: toArray(g.languagesText) });

async function fetchJSON(url) {
  const res = await fetch(url);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error(`Risposta non JSON da ${url}`);
  if (!res.ok) throw new Error(`Errore ${res.status} su ${url}`);
  return res.json();
}

// Risolve uno slug in id (prova ?slug=, poi ?search=, poi lista intera)
async function resolveIdFromSlug(slug) {
  try {
    const found = await fetchJSON(`${BASE_URL}?slug=${encodeURIComponent(slug)}`);
    const list = Array.isArray(found) ? found : found?.items || [];
    const hit = list.find((x) => x?.slug === slug);
    if (hit?.id != null) return hit.id;
  } catch {}

  try {
    const q = slug.replace(/-/g, " ");
    const light = await fetchJSON(`${BASE_URL}?search=${encodeURIComponent(q)}`);
    const arr = Array.isArray(light) ? light : [];
    for (const c of arr) {
      try {
        const full = unwrap(await fetchJSON(`${BASE_URL}/${encodeURIComponent(c.id)}`));
        if (full?.slug === slug) return full.id;
        if (!full?.slug && slugify(full?.title || "") === slug) return full.id;
      } catch {}
    }
  } catch {}

  const all = await fetchJSON(BASE_URL);
  const arr2 = Array.isArray(all) ? all : [];
  const cand = arr2.find((x) => slugify(x?.title || "") === slug);
  if (cand?.id != null) return cand.id;

  throw new Error(`Record non trovato per slug "${slug}"`);
}

export default function ComparePage() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const aParam = params.get("a");
  const bParam = params.get("b");

  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!aParam || !bParam) throw new Error("Parametri mancanti: servono 'a' e 'b'.");

        setLoading(true);
        setError("");

        const aIsNum = /^\d+$/.test(aParam);
        const bIsNum = /^\d+$/.test(bParam);
        const aId = aIsNum ? aParam : await resolveIdFromSlug(aParam);
        const bId = bIsNum ? bParam : await resolveIdFromSlug(bParam);

        const [da, db] = await Promise.all([fetchJSON(`${BASE_URL}/${encodeURIComponent(aId)}`), fetchJSON(`${BASE_URL}/${encodeURIComponent(bId)}`)]);

        if (!alive) return;
        setLeft(normalize(unwrap(da)));
        setRight(normalize(unwrap(db)));
      } catch (e) {
        if (alive) setError(e?.message || "Errore imprevisto");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [aParam, bParam]);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" />
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!left || !right) return <div className="alert alert-warning">Impossibile caricare i dati di confronto.</div>;

  return (
    <section>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0 color-w">Confronto giochi</h2>
        <Link className="btn btn-outline-secondary btn-sm" to="/games">
          ← Torna al catalogo
        </Link>
      </div>

      <div className="row g-4 mb-3">
        {[left, right].map((g, idx) => (
          <div className="col-12 col-md-6" key={idx}>
            <div className="card h-100 shadow-sm">
              <div className="media-3x4">
                {g.image ? <img src={g.image} alt={g.title} loading="lazy" /> : <div className="h-100 d-flex justify-content-center align-items-center bg-light text-body-secondary">—</div>}
              </div>
              <div className="card-body">
                <div className="fw-semibold">{g.title}</div>
                <span className="badge bg-secondary-subtle text-secondary-emphasis">{g.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <tbody>
            <Row label="Prezzo" va={left} vb={right} render={(g) => priceFmt(g.price, g.currency || "EUR")} />
            <Row label="Piattaforme" va={left} vb={right} field="platform" />
            <Row label="Uscita" va={left} vb={right} field="releaseDate" />
            <Row label="PEGI" va={left} vb={right} field="pegi" />
            <Row label="Modalità" va={left} vb={right} render={(g) => (Array.isArray(g.modes) ? g.modes.join(" · ") : g.modes || "—")} />
            <Row label="Developer" va={left} vb={right} field="developer" />
            <Row label="Publisher" va={left} vb={right} field="publisher" />
            <Row label="Disponibilità" va={left} vb={right} render={(g) => (Number.isFinite(toNum(g.stock)) ? `${toNum(g.stock)} pezzi` : "—")} />
            <Row label="Tag" va={left} vb={right} render={(g) => (Array.isArray(g.tags) ? g.tags.join(", ") : g.tags || "—")} />
            <Row label="Audio" va={left} vb={right} render={(g) => (Array.isArray(g.languagesAudio) ? g.languagesAudio.join(", ") : g.languagesAudio || "—")} />
            <Row label="Testo" va={left} vb={right} render={(g) => (Array.isArray(g.languagesText) ? g.languagesText.join(", ") : g.languagesText || "—")} />
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Row({ label, va, vb, field, render }) {
  return (
    <tr>
      <th className="bg-body-tertiary" style={{ width: "20%" }}>
        {label}
      </th>
      <td style={{ width: "40%" }}>{render ? render(va) : va?.[field] ?? "—"}</td>
      <td style={{ width: "40%" }}>{render ? render(vb) : vb?.[field] ?? "—"}</td>
    </tr>
  );
}

function priceFmt(v, c = "EUR") {
  const n = toNum(v);
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: c }).format(n);
  } catch {
    return `${n} ${c}`;
  }
}
