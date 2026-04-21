import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Services/api';
import styles from './MyCourses.module.css';
import { getCategoryImage } from '../../utils/courseUI';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tempRating, setTempRating] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get('/enrollments/my-courses');

        const fetchedData =
          response.data.data?.courses || response.data.data || [];

        setEnrollments(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const handleSubmitRating = async (courseId) => {
    const value = tempRating[courseId];

    if (!value || submitted[courseId]) return;

    try {
      await api.post(`/courses/${courseId}/ratings`, { value });

      setSubmitted((prev) => ({
        ...prev,
        [courseId]: true
      }));

      setEnrollments((prev) =>
        prev.map((course) =>
          course._id === courseId
            ? { ...course, userRating: value }
            : course
        )
      );
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">

        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">
              My Learning Journey
              <i className="fa-solid fa-graduation-cap ms-2"></i>
            </h2>

            <p className="text-muted">
              Pick up where you left off and continue growing.
            </p>
          </div>

          <Link
            to="/courses"
            className="btn btn-outline-primary rounded-pill px-4 fw-bold"
          >
            Explore More
          </Link>
        </div>

        {/* COURSES */}
        {enrollments.length > 0 ? (
          <div className="row g-4">

            {enrollments.map((course) => (
              <div className="col-md-6 col-lg-4" key={course._id}>

                <div className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden ${styles.cardHover}`}>

                  {/* IMAGE */}
                  <img
                    src={getCategoryImage(course.category)}
                    className="card-img-top"
                    alt={course.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />

                  <div className="card-body p-4 d-flex flex-column">

                    <h5 className="fw-bold text-dark mb-2">
                      {course.title}
                    </h5>

                    <p className="text-muted small mb-3">
                      {course.description}
                    </p>

                    {/* ⭐ RATING */}
                    <div className="mb-3">

                      <p className="small fw-semibold mb-2">
                        {course.userRating
                          ? 'Your rating'
                          : 'Rate this course'}
                      </p>

                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          onClick={() => {
                            if (submitted[course._id]) return;

                            setTempRating((prev) => ({
                              ...prev,
                              [course._id]: star
                            }));
                          }}
                          className={`fa-solid fa-star me-1 fs-5 ${
                            star <=
                            (tempRating[course._id] ||
                              course.userRating ||
                              0)
                              ? 'text-warning'
                              : 'text-secondary'
                          }`}
                          style={{
                            cursor: submitted[course._id]
                              ? 'not-allowed'
                              : 'pointer',
                            transition: '0.2s'
                          }}
                        />
                      ))}

                      {!submitted[course._id] && (
                        <button
                          className="btn btn-sm btn-primary mt-2"
                          disabled={!tempRating[course._id]}
                          onClick={() =>
                            handleSubmitRating(course._id)
                          }
                        >
                          Submit Rating
                        </button>
                      )}
                    </div>

                    {/* BUTTON */}
                    <div className="mt-auto">
                      <Link
                        to={`/learning/${course._id}`}
                        className="btn btn-dark rounded-pill w-100 fw-bold"
                      >
                        Continue Learning
                      </Link>
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-5 bg-white shadow-sm rounded-5">
            <h3>No Active Courses</h3>
          </div>
        )}

      </div>
    </div>
  );
}