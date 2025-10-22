import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import slugify from "../utils/slugify";

const BASE_URL = "http://localhost:3001/games";

async function fetchListBySlug(slug) {
  const res = await fetch(`${BASE_URL}?slug=${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Errore ${res.status} su lista per slug "${slug}"`);
  const data = await res.json();

  const arr = Array.isArray(data) ? data : [];
  const hit = arr.find((g) => (g?.slug ?? slugify(g?.title || "")) === slug);
  if (!hit) throw new Error(`Nessun gioco trovato per slug "${slug}"`);
  return hit;
}

async function fetchDetailById(id) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Errore ${res.status} su dettaglio id ${id}`);
  const data = await res.json();
  return data.game || data;
}

export default function ComparePage() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const aSlug = params.get("a");
  const bSlug = params.get("b");

  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!aSlug || !bSlug) throw new Error("Parametri mancanti: servono 'a' e 'b'.");
        if (aSlug === bSlug) throw new Error("Seleziona due giochi diversi.");

        setLoading(true);
        setError("");

        const aListItem = await fetchListBySlug(aSlug);
        const bListItem = await fetchListBySlug(bSlug);

        const [aDetail, bDetail] = await Promise.all([fetchDetailById(aListItem.id), fetchDetailById(bListItem.id)]);

        // Anti-duplicato finale: se per qualsiasi motivo arrivano uguali
        if (aDetail?.id === bDetail?.id) {
          throw new Error("Seleziona due giochi diversi.");
        }

        if (!alive) return;
        setLeft(aDetail);
        setRight(bDetail);
      } catch (e) {
        if (alive) setError(e?.message || "Errore imprevisto");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [aSlug, bSlug]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" />
      </div>
    );
  }
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
            <tr>
              <th className="bg-body-tertiary" style={{ width: "20%" }}>
                Prezzo
              </th>
              <td style={{ width: "40%" }}>{left?.price || "EUR"} €</td>
              <td style={{ width: "40%" }}>{right?.price || "EUR"} €</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Piattaforme</th>
              <td>{left?.platform ?? "—"}</td>
              <td>{right?.platform ?? "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Uscita</th>
              <td>{left?.releaseDate ?? "—"}</td>
              <td>{right?.releaseDate ?? "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">PEGI</th>
              <td>{left?.pegi ?? "—"}</td>
              <td>{right?.pegi ?? "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Modalità</th>
              <td>{left?.modes?.length ? left.modes.join(" · ") : "—"}</td>
              <td>{right?.modes?.length ? right.modes.join(" · ") : "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Developer</th>
              <td>{left?.developer ?? "—"}</td>
              <td>{right?.developer ?? "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Publisher</th>
              <td>{left?.publisher ?? "—"}</td>
              <td>{right?.publisher ?? "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Disponibilità</th>
              <td>{Number.isFinite(left?.stock) ? `${left.stock} pezzi` : "—"}</td>
              <td>{Number.isFinite(right?.stock) ? `${right.stock} pezzi` : "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Tag</th>
              <td>{left?.tags?.length ? left.tags.join(", ") : "—"}</td>
              <td>{right?.tags?.length ? right.tags.join(", ") : "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Audio</th>
              <td>{left?.languagesAudio?.length ? left.languagesAudio.join(", ") : "—"}</td>
              <td>{right?.languagesAudio?.length ? right.languagesAudio.join(", ") : "—"}</td>
            </tr>

            <tr>
              <th className="bg-body-tertiary">Testo</th>
              <td>{left?.languagesText?.length ? left.languagesText.join(", ") : "—"}</td>
              <td>{right?.languagesText?.length ? right.languagesText.join(", ") : "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
