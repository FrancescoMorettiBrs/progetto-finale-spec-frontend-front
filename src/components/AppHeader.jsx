import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openDock } = useFavorites();

  const handleOpenFavorites = (e) => {
    e.preventDefault();
    if (location.pathname.startsWith("/")) {
      openDock();
    }
  };

  return (
    <header className="app-header navbar navbar-expand-md navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <span role="img" aria-label="Gamepad">
            🎮
          </span>
          <span>Game Hub</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <nav id="mainNav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/games" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Catalogo
              </NavLink>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handleOpenFavorites} title="Apri preferiti">
                Preferiti
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
