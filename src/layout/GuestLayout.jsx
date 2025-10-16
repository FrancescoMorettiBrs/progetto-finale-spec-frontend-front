import { Outlet, useLocation } from "react-router-dom";
import CompareBar from "../components/CompareBar";
import FavoritesDock from "../components/FavoritesDock";

export default function GuestLayout({ header, footer }) {
  const { pathname } = useLocation();

  const onFullBleed = pathname === "/" || pathname === "/info";

  const showCompareBar = pathname === "/games";

  return (
    <div className="app-shell-grid">
      {header}

      {onFullBleed ? (
        <main className="py-0">
          <Outlet />
        </main>
      ) : (
        <main className="container py-4">
          <Outlet />
        </main>
      )}

      {showCompareBar && <CompareBar />}
      {footer}

      <FavoritesDock />
    </div>
  );
}
