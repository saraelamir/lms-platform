import Navbar from './Navbar.jsx';

export default function PageShell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="py-5 mt-5" style={{ background: 'var(--ch-bg-soft)' }}>
        <div className="container text-center small text-secondary">
          © {new Date().getFullYear()} CourseHub — Learn without limits.
        </div>
      </footer>
    </>
  );
}
