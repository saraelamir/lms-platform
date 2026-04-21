import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import api from '../../Services/api';
import styles from './LearningPage.module.css';

export default function LearningPage() {
  const { courseId } = useParams();
  const navigate = useNavigate(); 
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const totalLessons = lessons.length;
  const completedCount = lessons.filter(l => l.completed).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/lessons`);
        const lessonsData = response.data.data?.lessons || response.data.data || [];
        setLessons(lessonsData);
        if (lessonsData.length > 0) {
          setCurrentLesson(lessonsData[0]);
        }

        const courseRes = await api.get(`/courses/${courseId}`);
        setCourseInfo(courseRes.data.data?.course || courseRes.data.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);


  useEffect(() => {
    const fetchLessonData = async () => {
      if (currentLesson?._id) {
        try {
          const progressResponse = await api.get(`/lessons/${currentLesson._id}/progress`);
          const progressInfo = progressResponse.data.data?.progress; 

          if (progressInfo) {
            const isDone = progressInfo.progressPercent === 100 || progressInfo.completed === true;
            setCurrentLesson(prev => ({ ...prev, completed: isDone }));
            setLessons(prev => prev.map(lesson => 
              lesson._id === currentLesson._id ? { ...lesson, completed: isDone } : lesson
            ));
          }

          const commentsResponse = await api.get(`/lessons/${currentLesson._id}/comments`);
          const fetchedComments = commentsResponse.data.data?.comments || commentsResponse.data.data || [];
          setComments(fetchedComments);
        } catch (error) {
          console.error("Error fetching lesson data:", error);
        }
      }
    };
    fetchLessonData();
  }, [currentLesson?._id]);

  const handleMarkAsCompleted = async (lessonId) => {
    try {
      await api.put(`/lessons/${lessonId}/progress`, {
        progressPercent: 100,
        completed: true,
        lastPositionSec: 0 
      });
      
      setLessons(prev => prev.map(lesson => 
        lesson._id === lessonId ? { ...lesson, completed: true } : lesson
      ));
      setCurrentLesson(prev => ({ ...prev, completed: true }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const response = await api.post(`/lessons/${currentLesson._id}/comments`, { text: newComment });
      const addedComment = response.data.data?.comment || response.data.data;
      setComments(prev => [addedComment, ...prev]);
      setNewComment(""); 
    } catch (error) {
      console.error(error);
    } finally { setCommentLoading(false); }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className={styles.learningContainer}>
      <div className="bg-white border-bottom py-3 px-lg-5 sticky-top shadow-sm">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <button onClick={() => navigate('/my-courses')} className="btn btn-outline-secondary btn-sm rounded-circle">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 small">
                    <li className="breadcrumb-item"><Link to="/my-courses">My Courses</Link></li>
                    <li className="breadcrumb-item active text-truncate" style={{maxWidth: '200px'}}>{courseInfo?.title || 'Course'}</li>
                  </ol>
                </nav>
                <h6 className="fw-bold mb-0 mt-1 d-none d-md-block">{courseInfo?.title}</h6>
              </div>
            </div>
            
            <div className="text-end">
                <span className="badge bg-light text-primary border border-primary-subtle rounded-pill px-3 py-2">
                   Your Progress: {progressPercentage}%
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4 px-lg-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Video Player Area */}
            <div className={styles.videoSection}>
              <div className="text-center">
                <i className="fa-solid fa-circle-play display-1 mb-3 opacity-50"></i>
                <h3>{currentLesson?.title}</h3>
                <p className="text-white-50 small">Video Content Area</p>
              </div>
            </div>
            
            {/* Lesson Info Card */}
            <div className={`${styles.contentCard} mt-4`}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <h2 className={styles.lessonTitle}>{currentLesson?.title}</h2>
                <button 
                  className={`btn ${currentLesson?.completed ? 'btn-success' : 'btn-outline-success'} rounded-pill px-4 fw-bold shadow-sm`}
                  onClick={() => handleMarkAsCompleted(currentLesson?._id)}
                  disabled={currentLesson?.completed}
                >
                  {currentLesson?.completed ? (
                    <span><i className="fa-solid fa-circle-check me-2"></i>Completed ✅</span>
                  ) : (
                    <span>Mark as Completed</span>
                  )}
                </button>
              </div>
              <hr />
              <div className="mt-4">
                <h5 className="fw-bold mb-3 small text-uppercase text-muted ls-1">Description</h5>
                <p className="text-muted lh-lg">{currentLesson?.content || 'No description available.'}</p>
              </div>
            </div>

            <div className={`${styles.contentCard} mt-4`}>
              <h5 className="fw-bold mb-4"><i className="fa-regular fa-comments me-2"></i>Discussion ({comments.length})</h5>
              <form onSubmit={handleAddComment} className="mb-4">
                <textarea className="form-control bg-light border-0 mb-2 p-3" rows="3" placeholder="Ask a question..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ borderRadius: '12px' }}></textarea>
                <div className="text-end"><button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={commentLoading || !newComment.trim()}>{commentLoading ? "Posting..." : "Post Comment"}</button></div>
              </form>
              <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment._id} className="d-flex gap-3 mb-3 p-3 bg-white border rounded-3 shadow-sm">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', flexShrink: 0 }}>{comment.user?.name?.charAt(0) || "S"}</div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between"><h6 className="fw-bold mb-1 text-dark small">{comment.user?.name || "Student"}</h6><span className="text-muted" style={{ fontSize: '0.7rem' }}>{new Date(comment.createdAt).toLocaleDateString()}</span></div>
                        <p className="mb-0 text-muted small">{comment.text}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="col-lg-4">
            <div className={`${styles.sidebar} shadow-sm border p-0`}>
              <div className="p-4 border-bottom bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between mb-2">
                   <h6 className="fw-bold m-0 text-dark">Course Progress</h6>
                   <span className="fw-bold text-primary">{progressPercentage}%</span>
                </div>
                <div className="progress shadow-sm" style={{ height: '8px', borderRadius: '10px' }}>
                  <div 
                    className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    style={{ width: `${progressPercentage}%` }} 
                  ></div>
                </div>
              </div>

              <div className="p-4 pt-3">
                <div className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-list-ol me-2 text-primary"></i>
                  <h6 className="fw-bold m-0">Course Content</h6>
                </div>
                
                <div className="lesson-list">
                  {lessons.map((lesson, index) => (
                    <div key={lesson._id} className={`${styles.lessonItem} ${currentLesson?._id === lesson._id ? styles.activeLesson : ''}`} onClick={() => setCurrentLesson(lesson)}>
                      <div className="d-flex align-items-center w-100">
                        <div className="me-3 text-muted small fw-bold">{String(index + 1).padStart(2, '0')}</div>
                        <div className="flex-grow-1"><h6 className="mb-0 fw-bold small text-dark">{lesson.title}</h6></div>
                        {lesson.completed && (<div><i className="fa-solid fa-circle-check fs-5 text-success"></i></div>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}