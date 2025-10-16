import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="home-hero position-relative overflow-hidden text-center text-light">

      <div className="home-hero__bg" aria-hidden="true" />

      <div className="container py-5 position-relative">

        <div className="floating-icons" aria-hidden="true">
          <span className="fi" style={{ top: "10%", left: "12%" }}>
            🎮
          </span>
          <span className="fi" style={{ top: "25%", right: "8%" }}>
            🕹️
          </span>
          <span className="fi" style={{ bottom: "18%", left: "15%" }}>
            ⭐
          </span>
          <span className="fi" style={{ bottom: "28%", right: "18%" }}>
            ⚡
          </span>
        </div>

        <div className="display-3 mb-2 home-hero__emoji" role="img" aria-label="Gamepad">
          🎮
        </div>

        <h1 className="home-hero__title mb-3">
          Benvenuto nel tuo <span className="txt-gradient">GameHub</span>
        </h1>

        <p className="lead text-opacity-75 mb-4">Sfoglia i titoli, confronta le caratteristiche, crea i tuoi preferiti.</p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/games" className="btn btn-primary btn-lg btn-cta">
            Entra nel catalogo
          </Link>
        </div>
      </div>
    </section>
  );
}
