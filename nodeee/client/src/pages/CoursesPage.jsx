import PageShell from '../components/layout/PageShell.jsx';
import CourseCatalog from '../components/courses/CourseCatalog.jsx';

export default function CoursesPage() {
  return (
    <PageShell>
      <div className="py-4" style={{ background: 'var(--ch-bg-soft)' }}>
        <div className="container py-3">
          <h1 className="h3 mb-1" style={{ color: 'var(--ch-heading)' }}>
            Course catalog
          </h1>
          <p className="text-secondary mb-0">Every listing below is loaded from your Express API.</p>
        </div>
      </div>
      <CourseCatalog title="All courses" />
    </PageShell>
  );
}
