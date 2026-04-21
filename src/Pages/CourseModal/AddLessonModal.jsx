import React, { useState } from 'react';
import api from '../../Services/api';

export default function AddLessonModal({ show, handleClose, courseId }) {
  const [lesson, setLesson] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(`/courses/${courseId}/lessons`, lesson);

      setMessage("Lesson added successfully!");
      setMessageType("success");

      setLesson({ title: '', content: '' });

      setTimeout(() => {
        setMessage(null);
        handleClose();
      }, 1500);

    } catch (error) {
      console.error(error);

      setMessage("Failed to add lesson");
      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">

          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold fs-4">Add New Lesson</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-4">

              {/* الرسالة */}
              {message && (
                <div
                  className={`alert py-2 ${
                    messageType === "success"
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Lesson Title
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-0"
                  placeholder="e.g. Introduction to Hooks"
                  required
                  value={lesson.title}
                  onChange={(e) =>
                    setLesson({ ...lesson, title: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Lesson Content / URL
                </label>
                <textarea
                  className="form-control bg-light border-0"
                  rows="4"
                  placeholder="Paste lesson content or video link here..."
                  required
                  value={lesson.content}
                  onChange={(e) =>
                    setLesson({ ...lesson, content: e.target.value })
                  }
                />
              </div>

            </div>

            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-light px-4 rounded-pill"
                onClick={handleClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-dark px-4 rounded-pill"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Lesson"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}