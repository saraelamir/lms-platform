import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Services/api';

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [notification, setNotification] = useState(null);
  const [openLessonId, setOpenLessonId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, lessonsRes, myCoursesRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/courses/${courseId}/lessons`),
          api.get('/enrollments/my-courses')
        ]);

        setCourse(courseRes.data.data?.course || courseRes.data.data);
        setLessons(lessonsRes.data.data?.lessons || lessonsRes.data.data || []);

        const enrolledCourses = myCoursesRes.data.data?.courses || [];


        const enrolled = enrolledCourses.some(
          (c) => c._id === courseId
        );


        setIsEnrolled(enrolled);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);

    try {
      await api.post('/enrollments', { courseId });

      setIsEnrolled(true);

      setNotification({
        type: 'success',
        text: 'Enrolled successfully! '
      });

      setTimeout(() => {
        navigate(`/learning/${course._id}`);
      }, 1000);

    } catch (error) {
      setNotification({
        type: 'danger',
        text: 'Failed to enroll. Please try again.'
      });
    } finally {
      setEnrolling(false);
    }
  };

  const toggleLesson = (id) => {
    setOpenLessonId(openLessonId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">

      {notification && (
        <div className={`position-fixed top-0 end-0 m-3 alert alert-${notification.type}`}>
          {notification.text}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-dark text-white py-5" style={{ minHeight: '350px' }}>
        <div className="container py-4">

          <h1 className="fw-bold display-4 mb-3">
            {course?.title}

            {isEnrolled && (
              <span className="badge bg-success ms-3">
                Enrolled
              </span>
            )}
          </h1>

          <p className="lead text-white-50">
            {course?.description}
          </p>

        </div>
      </div>

      {/* CONTENT */}
      <div className="container" style={{ marginTop: '-100px' }}>
        <div className="row">

          {/* LESSONS */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">

              <h4 className="fw-bold mb-4">Course Content</h4>

              {lessons.map((lesson) => (
                <div key={lesson._id} className="border rounded-3 mb-2 overflow-hidden">

                  <div
                    className="d-flex justify-content-between align-items-center p-3 bg-white fw-bold"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleLesson(lesson._id)}
                  >
                    <span>
                      <i className={`fa-solid ${isEnrolled ? 'fa-circle-check text-success' : 'fa-circle-play text-primary'} me-3`}></i>
                      {lesson.title}
                    </span>

                    <i className={`fa-solid fa-chevron-${openLessonId === lesson._id ? 'up' : 'down'}`}></i>
                  </div>

                  {openLessonId === lesson._id && (
                    <div className="p-3 bg-light text-muted small">
                      {isEnrolled
                        ? "You are enrolled! Enjoy the lesson content."
                        : "Enroll now to unlock this lesson content."}
                    </div>
                  )}

                </div>
              ))}

            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 sticky-top" style={{ top: '20px' }}>

              <div className="card-body p-4">

                {/* STATUS */}
                {isEnrolled && (
                  <div className="alert alert-success text-center fw-semibold">
                    ✅ You are already enrolled in this course
                  </div>
                )}

                {/* BUTTON */}
                <button
                  onClick={
                    isEnrolled
                      ? () => navigate(`/learning/${course._id}}`)
                      : handleEnroll
                  }
                  disabled={enrolling}
                  className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 shadow-sm"
                >
                  {enrolling
                    ? 'Processing...'
                    : isEnrolled
                    ? 'Continue Learning'
                    : 'Enroll Now'}
                </button>

              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}