import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell.jsx';
import CourseCatalog from '../components/courses/CourseCatalog.jsx';

export default function LandingPage() {
  return (
    <PageShell>
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5 ch-hero-strip p-4 p-lg-5">
            <div className="col-lg-6">
              <p className="text-uppercase small fw-semibold mb-2" style={{ color: 'var(--ch-blue)', letterSpacing: '0.08em' }}>
                Online learning
              </p>
              <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--ch-heading)', letterSpacing: '-0.03em' }}>
                Build skills with courses crafted by expert instructors.
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '1.05rem' }}>
                Browse real courses from our catalog, enroll as a student, or teach your own — all in one calm, focused workspace.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/courses" className="btn ch-btn-accent px-4 py-2">
                  Explore courses
                </Link>
                <Link to="/register" className="btn btn-outline-secondary rounded-4 px-4 py-2 border-0 shadow-sm" style={{ background: '#fff' }}>
                  Create account
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <HeroArt />
            </div>
          </div>
        </div>
      </section>

      <CourseCatalog
        title="Popular courses"
        subtitle="Live data from your CourseHub API — search and paginate through the full catalog."
      />
    </PageShell>
  );
}

function HeroArt() {
  return (
    <svg viewBox="0 0 400 280" className="w-100" style={{ maxWidth: 420 }} aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bee3f8" />
          <stop offset="100%" stopColor="#c6f6d5" />
        </linearGradient>
      </defs>
      <rect x="40" y="30" width="320" height="220" rx="24" fill="url(#g1)" opacity="0.55" />
      <ellipse cx="300" cy="60" rx="40" ry="28" fill="#fff" opacity="0.5" />
      <rect x="80" y="70" width="200" height="130" rx="12" fill="#fff" stroke="#4a90e2" strokeWidth="2" opacity="0.9" />
      <rect x="95" y="88" width="170" height="10" rx="4" fill="#e2e8f0" />
      <rect x="95" y="108" width="120" height="10" rx="4" fill="#e2e8f0" />
      <rect x="95" y="128" width="150" height="10" rx="4" fill="#e2e8f0" />
      <circle cx="130" cy="195" r="22" fill="#fbd38d" />
      <path d="M118 188c6-10 24-10 28 0M112 208h48" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="165" y="175" width="140" height="44" rx="10" fill="#48bb78" opacity="0.95" />
      <text x="235" y="203" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="600">
        Continue
      </text>
    </svg>
  );
}
