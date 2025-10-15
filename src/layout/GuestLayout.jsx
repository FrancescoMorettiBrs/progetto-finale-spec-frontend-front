import { Outlet } from "react-router-dom";
import CompareBar from "../components/CompareBar";
import FavoritesDock from "../components/FavoritesDock";

export default function GuestLayout({ header, footer }) {
  return (
    <div className="app-shell-grid">
      {header}
      <main className="container py-4">
        <Outlet />
      </main>
      <div className="mb-0">
        <CompareBar />
      </div>
      {footer}
      <FavoritesDock />
    </div>
  );
}
