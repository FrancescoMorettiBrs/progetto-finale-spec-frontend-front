export default function GuestLayout({ header, footer, children }) {
  return (
    <>
      {header}
      <main className="container py-4">{children}</main>
      {footer}
    </>
  );
}
