import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg sticky-top ${styles.navbarCustom}`}>
      <div className="container">
        <Link to={user?.role === 'Instructor' ? "/instructor/dashboard" : "/"} className="navbar-brand d-flex align-items-center text-decoration-none">
          <div className={`${styles.logoBox} me-2`}>
            <i className="fa-solid fa-graduation-cap text-white fs-5"></i>
          </div>
          <span className={styles.logoText}>
            Course<span className={styles.logoSpan}>Hub</span>
          </span>
        </Link>

        <button className={`navbar-toggler border-0 shadow-none ${styles.toggler}`} type="button" data-bs-toggle="collapse" data-bs-target="#courseNav">
          <span className={styles.togglerIcon}>☰</span>
        </button>

        <div className="collapse navbar-collapse" id="courseNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${styles.navLinkCustom} ${location.pathname === '/' ? styles.active : ''}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/courses" className={`nav-link ${styles.navLinkCustom} ${location.pathname === '/courses' ? styles.active : ''}`}>
                Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my-courses" className={`nav-link ${styles.navLinkCustom} ${location.pathname === '/my-courses' ? styles.active : ''}`}>
                My Courses
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className={styles.hiText}>Hi, {user?.name?.split(' ')[0]}</span>
                {user.role === 'Instructor' && (
                  <Link to="/instructor/dashboard" className={styles.btnDashboard}>
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.btnLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className={styles.btnLoginLink}>Login</Link>
                <Link to="/register" className={styles.btnSignupCustom}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}