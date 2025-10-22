export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer app-footer--dark text-light">
      <div className="app-footer__main">
        <div className="container py-4">
          <div className="row g-4 align-items-start">
            {/* Brand + descrizione */}
            <div className="col-12 col-md-5">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="app-footer__logo app-footer__logo--dark" aria-hidden="true">
                  🎮
                </span>
                <span className="fw-semibold">GameHub</span>
              </div>
            </div>

            {/* Link rapidi */}
            <nav className="col-6 col-md-3">
              <h6 className="text-uppercase small fw-semibold mb-2 opacity-85">Link</h6>
              <ul className="list-unstyled mb-0 small">
                <li>
                  <a className="app-footer__link app-footer__link--dark" href="/">
                    Home
                  </a>
                </li>
                <li>
                  <a className="app-footer__link app-footer__link--dark" href="/games">
                    Catalogo
                  </a>
                </li>
                <li>
                  <a className="app-footer__link app-footer__link--dark" href="/info">
                    Informazioni
                  </a>
                </li>
              </ul>
            </nav>

            {/* Contatti / social */}
            <div className="col-6 col-md-4">
              <h6 className="text-uppercase small fw-semibold mb-2 opacity-85">Contatti</h6>
              <ul className="list-unstyled mb-3 small">
                <li className="d-flex align-items-center gap-2">
                  <span aria-hidden="true">📧</span>
                  <a className="app-footer__link app-footer__link--dark" href="mailto:info@gameHub.com">
                    info@gameHub.com
                  </a>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <span aria-hidden="true">📍</span>
                  <span className="opacity-85">Italia</span>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>

      {/* divider */}
      <div className="app-footer__divider app-footer__divider--dark" role="presentation" />

      <div className="app-footer__bottom">
        <div className="container py-3 d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-center small">
          <span>© {year} GameHub — Demo</span>
          <span className="opacity-85">Built with React &amp; Bootstrap</span>
        </div>
      </div>
    </footer>
  );
}
