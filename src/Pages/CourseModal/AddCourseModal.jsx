import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../Services/api';

export default function AddCourseModal({ show, handleClose, onCourseSaved, courseData }) {
  const [course, setCourse] = useState({ title: '', description: '', category: '' });

  useEffect(() => {
    if (courseData) {
      setCourse({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category
      });
    } else {
      setCourse({ title: '', description: '', category: '' });
    }
  }, [courseData, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (courseData) {
        response = await api.put(`/courses/${courseData._id}`, course);
      } else {
        response = await api.post('/courses', course);
      }

      const savedCourse = response.data.data.course || response.data.data || response.data;
      onCourseSaved(savedCourse, !!courseData);
      handleClose();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {courseData ? 'Edit Course' : 'Create New Course'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Course Title</Form.Label>
            <Form.Control
              type="text"
              required
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Category</Form.Label>
            <Form.Select
              required
              value={course.category}
              onChange={(e) => setCourse({ ...course, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Web Development">Web Development</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit">
            {courseData ? 'Update Course' : 'Create Course'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}