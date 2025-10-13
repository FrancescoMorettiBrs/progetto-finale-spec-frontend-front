export default function AppHeader() {
  return (
    <header className="app-header app-header--dark sticky-top shadow-sm text-light">

      {/* barra principale */}
      <div className="app-header__main">
        <div className="container py-3 d-flex align-items-center justify-content-between">
          {/* Brand */}
          <div className="d-flex align-items-center gap-2">
            <span className="app-logo app-logo--dark" aria-hidden="true">
              🎮
            </span>
            <div className="d-flex flex-column">
              <span className="fw-semibold fs-5">VideoLab</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
