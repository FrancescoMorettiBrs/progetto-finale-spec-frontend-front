import { Outlet } from "react-router-dom";

export default function GuestLayout({ header, footer }) {
  return (
    <>
      {header}
      <main className="container py-4">
        <Outlet />
      </main>
      {footer}
    </>
  );
}
