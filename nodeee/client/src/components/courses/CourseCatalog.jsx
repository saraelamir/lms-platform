import { useCallback, useEffect, useState } from 'react';
import { fetchCourses } from '../../services/courseService.js';
import CourseCard from './CourseCard.jsx';

export default function CourseCatalog({ title = 'Available courses', subtitle }) {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (page = 1, q = search) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchCourses({ page, limit: 10, search: q || undefined });
      if (!res.success) {
        setError(res.message || 'Could not load courses.');
        return;
      }
      setCourses(res.data?.courses ?? []);
      setPagination(res.data?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 });
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Could not load courses.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load(1, search);
  }, [search, load]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const goPage = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    load(p, search);
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-between align-items-end g-3 mb-4">
          <div className="col-lg-7">
            <h2 className="h3 mb-2" style={{ color: 'var(--ch-heading)' }}>
              {title}
            </h2>
            {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
          </div>
          <div className="col-lg-5">
            <form onSubmit={onSearchSubmit} className="d-flex gap-2">
              <input
                type="search"
                className="form-control rounded-4 border-0 shadow-sm"
                style={{ background: '#f7fafc' }}
                placeholder="Search by title…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search courses"
              />
              <button type="submit" className="btn ch-btn-primary px-4">
                Search
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger rounded-4 border-0 shadow-sm" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-5 text-secondary">
            <div className="spinner-border text-primary" role="status" aria-label="Loading" />
            <p className="mt-3 mb-0">Loading courses from the server…</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="ch-hero-strip p-5 text-center text-secondary rounded-4">
            No courses match your filters yet. Try another search or check back later.
          </div>
        )}

        {!loading &&
          courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}

        {!loading && pagination.totalPages > 1 && (
          <nav aria-label="Course pagination" className="mt-2">
            <ul className="pagination justify-content-center gap-1">
              <li className={`page-item ${pagination.page <= 1 ? 'disabled' : ''}`}>
                <button type="button" className="page-link rounded-3 border-0 shadow-sm" onClick={() => goPage(pagination.page - 1)}>
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link border-0 bg-transparent text-secondary">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              </li>
              <li className={`page-item ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`}>
                <button type="button" className="page-link rounded-3 border-0 shadow-sm" onClick={() => goPage(pagination.page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
