import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '../components/layout/PageShell.jsx';
import StarRating from '../components/courses/StarRating.jsx';
import { fetchCourseById } from '../services/courseService.js';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchCourseById(courseId);
        if (cancelled) return;
        if (!res.success) {
          setError(res.message || 'Course not found.');
          setCourse(null);
          return;
        }
        setCourse(res.data?.course ?? null);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || e.message || 'Could not load course.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return (
    <PageShell>
      <div className="container py-5">
        <Link to="/courses" className="small text-secondary text-decoration-none mb-3 d-inline-block">
          ← Back to catalog
        </Link>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" aria-label="Loading" />
          </div>
        )}

        {error && <div className="alert alert-danger rounded-4 border-0">{error}</div>}

        {!loading && course && (
          <div className="ch-card card border-0">
            <div className="card-body p-4 p-md-5">
              <span className="badge rounded-pill mb-3" style={{ background: '#edf2f7', color: 'var(--ch-heading)' }}>
                {course.category}
              </span>
              <h1 className="h2 mb-3" style={{ color: 'var(--ch-heading)' }}>
                {course.title}
              </h1>
              <StarRating value={course.averageRating} count={course.ratingCount} />
              <p className="mt-4 mb-0 lh-lg" style={{ color: 'var(--ch-body)', maxWidth: '720px' }}>
                {course.description}
              </p>
              <p className="mt-4 text-secondary small mb-0">
                Instructor: <strong style={{ color: 'var(--ch-heading)' }}>{course.instructor?.name}</strong>
              </p>
              <div className="mt-4 d-flex flex-wrap gap-2">
                <Link to="/login" className="btn ch-btn-accent">
                  Log in to enroll
                </Link>
                <Link to="/" className="btn btn-outline-secondary rounded-4 border-0 shadow-sm" style={{ background: '#f7fafc' }}>
                  Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
