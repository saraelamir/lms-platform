import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Services/api'; 
import AddCourseModal from '../CourseModal/AddCourseModal';
import AddLessonModal from '../CourseModal/AddLessonModal';
import { getCategoryImage } from '../../utils/courseUI';

export default function InstructorDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses'); 
        const courses = response.data.data?.courses || response.data.data || [];
        setMyCourses(Array.isArray(courses) ? courses : []); 
        console.log("courses data:", courses); 
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const calculateTotalAvgRating = () => {
    if (myCourses.length === 0) return "0.0";
    const total = myCourses.reduce((acc, course) => acc + (course.averageRating || 0), 0);
    return (total / myCourses.length).toFixed(1);
  };

  const handleOpenAddModal = () => {
    setSelectedCourse(null);
    setShowCourseModal(true);
  };

  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleOpenAddLesson = (courseId) => {
    setCurrentCourseId(courseId);
    setShowLessonModal(true);
  };

  const handleCourseSaved = (savedCourse, isEdit) => {
    if (isEdit) {
      setMyCourses(myCourses.map(c => c._id === savedCourse._id ? savedCourse : c));
    } else {
      setMyCourses([savedCourse, ...myCourses]);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/courses/${courseId}`);
        setMyCourses(myCourses.filter(course => course._id !== courseId));
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold">Instructor Control Panel</h2>
          <p className="text-muted">Manage your courses and track student performance</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm">
          <i className="fa-solid fa-plus me-2"></i> Create New Course
        </button>
      </div>

      <div className="row mb-5 g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 text-center h-100 rounded-4">
            <div className="text-primary mb-2"><i className="fa-solid fa-book-open fs-3"></i></div>
            <h3 className="fw-bold mb-0">{myCourses.length}</h3>
            <span className="text-muted small fw-medium">Active Courses</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 text-center h-100 rounded-4">
            <div className="text-warning mb-2"><i className="fa-solid fa-star fs-3"></i></div>
            <h3 className="fw-bold mb-0">{calculateTotalAvgRating()}</h3>
            <span className="text-muted small fw-medium">Average Rating</span>
          </div>
        </div>
      </div>

      <div className="row">
        {loading ? (
          <div className="text-center w-100 py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : myCourses.length > 0 ? (
          myCourses.map((course) => (
            <div className="col-md-6 col-lg-4 mb-4" key={course._id}>
              <div className="card h-100 border-0 shadow-sm overflow-hidden rounded-4">

                {/* صورة الكورس حسب الكاتيجوري */}
                <div style={{ height: '140px', overflow: 'hidden' }}>
                  <img
                    src={getCategoryImage(course.category)}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div className="card-body d-flex flex-column p-4">
                  
                  {/* TOP: category + rating */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                      {course.category}
                    </span>
                    <span className="text-warning small fw-bold">
                      <i className="fa-solid fa-star me-1"></i>
                      {course.averageRating || 0}
                    </span>
                  </div>

                  {/* TITLE + DESC */}
                  <h5 className="card-title fw-bold mb-1">{course.title}</h5>
                  <p className="card-text text-muted small mb-4 flex-grow-1">
                    {course.description?.substring(0, 80)}...
                  </p>

                  {/* ACTIONS */}
                  <div className="d-flex flex-column gap-2 mt-auto">

                    {/* Manage Lessons */}
                    <Link
                      to={`/instructor/course/${course._id}/lessons`}
                      className="btn btn-dark w-100 rounded-pill py-2 fw-medium shadow-sm"
                      style={{ fontSize: '13px' }}
                    >
                      <i className="fa-solid fa-chalkboard-user me-2"></i> Manage Lessons
                    </Link>

                    {/* Add Lesson + Edit + Delete في صف واحد */}
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleOpenAddLesson(course._id)}
                        className="btn btn-outline-success rounded-pill px-3 shadow-sm"
                        title="Add Lesson"
                        style={{ fontSize: '13px' }}
                      >
                        <i className="fa-solid fa-plus me-1"></i> Add lesson
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(course)}
                        className="btn btn-outline-primary flex-grow-1 rounded-pill fw-medium shadow-sm"
                        style={{ fontSize: '13px' }}
                      >
                        <i className="fa-solid fa-pen me-1"></i> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(course._id)}
                        className="btn btn-outline-danger rounded-pill px-3 shadow-sm"
                        title="Delete"
                        style={{ fontSize: '13px' }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 w-100 text-muted">No courses yet. Click "Create New Course" to start.</div>
        )}
      </div>

      <AddCourseModal 
        show={showCourseModal} 
        handleClose={() => setShowCourseModal(false)} 
        onCourseSaved={handleCourseSaved} 
        courseData={selectedCourse} 
      />

      <AddLessonModal 
        show={showLessonModal} 
        handleClose={() => setShowLessonModal(false)} 
        courseId={currentCourseId}
      />
    </div>
  );
}