import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `nav-link px-3 py-2 rounded-3 ${isActive ? 'fw-semibold text-primary' : 'text-secondary'}`;

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg ch-navbar sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/" onClick={() => setOpen(false)}>
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-3 text-white fw-bold"
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #ed8936 0%, #4a90e2 100%)',
              fontSize: '0.85rem',
            }}
          >
            CH
          </span>
          <span style={{ color: 'var(--ch-heading)', letterSpacing: '-0.02em' }}>CourseHub</span>
        </Link>
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
            <li className="nav-item">
              <NavLink className={linkClass} to="/" end onClick={() => setOpen(false)}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/courses" onClick={() => setOpen(false)}>
                Courses
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 ms-lg-2">
            {isAuthenticated ? (
              <>
                <span className="small text-secondary d-none d-sm-inline">{user?.name}</span>
                <button type="button" className="btn btn-link text-secondary text-decoration-none" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-link text-secondary text-decoration-none px-2" to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link className="btn ch-btn-primary btn-sm" to="/register" onClick={() => setOpen(false)}>
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
