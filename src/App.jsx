import { Routes, Route } from "react-router-dom";
import GuestLayout from "./layout/GuestLayout";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import GamesPage from "./components/GamesPage";
import GameDetailPage from "./pages/GameDetailPage";
import { CompareProvider } from "./context/CompareContext";
import ComparePage from "./pages/ComparePage";
import { FavoritesProvider } from "./context/FavoritesContext";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";
import PageNotFound from "./pages/PageNotFound";

export default function App() {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <Routes>
          <Route element={<GuestLayout header={<AppHeader />} footer={<AppFooter />} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:id" element={<GameDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </CompareProvider>
    </FavoritesProvider>
  );
}
