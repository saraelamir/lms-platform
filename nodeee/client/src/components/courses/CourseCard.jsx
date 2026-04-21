import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon.jsx';
import CourseIllustration from './CourseIllustration.jsx';
import StarRating from './StarRating.jsx';

export default function CourseCard({ course }) {
  const id = course._id;
  const instructorName = course.instructor?.name || 'Instructor';
  const desc = course.description?.slice(0, 110) + (course.description?.length > 110 ? '…' : '');

  return (
    <div className="card ch-card mb-4">
      <div className="card-body p-4">
        <div className="row align-items-center g-4">
          <div className="col-auto">
            <div
              className="d-flex align-items-center justify-content-center rounded-4 text-white"
              style={{
                width: 88,
                height: 88,
                background: 'linear-gradient(145deg, #4a90e2 0%, #63b3ed 100%)',
                boxShadow: 'var(--ch-shadow-sm)',
              }}
            >
              <CategoryIcon category={course.category} />
            </div>
          </div>
          <div className="col">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <span className="badge rounded-pill" style={{ background: '#edf2f7', color: 'var(--ch-heading)' }}>
                {course.category}
              </span>
            </div>
            <h3 className="h5 mb-2" style={{ color: 'var(--ch-heading)' }}>
              {course.title}
            </h3>
            <StarRating value={course.averageRating} count={course.ratingCount} />
            <p className="mt-2 mb-2 small lh-base" style={{ color: 'var(--ch-body)' }}>
              {desc}
            </p>
            <div className="d-flex align-items-center gap-2 small text-secondary">
              <span
                className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center fw-semibold text-uppercase"
                style={{ width: 32, height: 32, fontSize: '0.7rem', color: 'var(--ch-blue)' }}
              >
                {instructorName.slice(0, 2)}
              </span>
              <span>{instructorName}</span>
            </div>
          </div>
          <div className="col-lg-auto text-center text-lg-end">
            <div className="d-none d-md-block mb-3">
              <CourseIllustration />
            </div>
            <Link to={`/courses/${id}`} className="btn ch-btn-primary px-4">
              View Course
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
