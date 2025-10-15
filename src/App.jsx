import { Routes, Route } from "react-router-dom";
import GuestLayout from "./layout/GuestLayout";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import GamesPage from "./components/GamesPage";
import GameDetailPage from "./pages/GameDetailPage";
import { CompareProvider } from "./context/CompareContext";
import ComparePage from "./pages/ComparePage";
import { FavoritesProvider } from "./context/FavoritesContext";

function NotFound() {
  return (
    <div className="py-5">
      <h2 className="h4 mb-3">Pagina non trovata</h2>
      <a className="btn btn-primary" href="/">
        Torna alla lista
      </a>
    </div>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <Routes>
          <Route element={<GuestLayout header={<AppHeader />} footer={<AppFooter />} />}>
            <Route path="/" element={<GamesPage />} />
            <Route path="/games/:id" element={<GameDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CompareProvider>
    </FavoritesProvider>
  );
}
