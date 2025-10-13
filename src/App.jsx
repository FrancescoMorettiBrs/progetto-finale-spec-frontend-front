import GuestLayout from "./layout/GuestLayout";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import GamesPage from "./components/GamesPage";

export default function App() {
  return (
    <>
      <GuestLayout header={<AppHeader />} footer={<AppFooter />}>
        <GamesPage />
      </GuestLayout>
    </>
  );
}
