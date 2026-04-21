import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell.jsx';

export default function PlaceholderPage({ title, hint }) {
  return (
    <PageShell>
      <div className="container py-5 text-center" style={{ maxWidth: 560 }}>
        <h1 className="h3 mb-3" style={{ color: 'var(--ch-heading)' }}>
          {title}
        </h1>
        <p className="text-secondary mb-4">{hint}</p>
        <Link to="/" className="btn ch-btn-primary">
          Back to home
        </Link>
      </div>
    </PageShell>
  );
}
