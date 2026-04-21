import { api } from './api.js';

/**
 * @param {{ page?: number; limit?: number; search?: string; category?: string }} params
 */
export async function fetchCourses(params = {}) {
  const { data } = await api.get('/courses', { params });
  return data;
}

export async function fetchCourseById(id) {
  const { data } = await api.get(`/courses/${id}`);
  return data;
}
