import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Services/api';

export default function ManageLessons() {
  const { courseId } = useParams(); 
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/lessons`);
        setLessons(response.data.data?.lessons || response.data.data || []);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-5">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline-dark rounded-circle me-3"
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="fw-bold mb-0">Course Content</h2>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : lessons.length > 0 ? (
        <div className="row g-4">
          {lessons.map((lesson, index) => (
            <div className="col-12" key={lesson._id}>
              <div className="card border-0 shadow-sm rounded-4 p-3 hover-shadow">
                <div className="d-flex align-items-center">
                  <div 
                    className="bg-primary bg-opacity-10 text-primary rounded-3 fw-bold d-flex align-items-center justify-content-center me-4" 
                    style={{ minWidth: '50px', height: '50px', fontSize: '1.2rem' }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1 text-dark">{lesson.title}</h5>
                    <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '80%' }}>
                      {lesson.content}
                    </p>
                  </div>
                  <div className="text-muted small px-3">
                    <i className="fa-solid fa-circle-check text-success me-1"></i> Published
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-light rounded-5 border border-dashed">
          <i className="fa-solid fa- folder-open fs-1 text-muted mb-3"></i>
          <p className="text-muted">No lessons found for this course yet.</p>
        </div>
      )}
    </div>
  );
}