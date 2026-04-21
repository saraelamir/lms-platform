import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      <Route
        path="/login"
        element={<PlaceholderPage title="Login" hint="Auth UI is next: this screen will call POST /api/auth/login with validation." />}
      />
      <Route
        path="/register"
        element={
          <PlaceholderPage title="Create account" hint="Registration will call POST /api/auth/register with role selection (Student / Instructor)." />
        }
      />
      <Route
        path="/dashboard"
        element={
          <PlaceholderPage title="Dashboard" hint="Role-based student or instructor dashboards will load from /api/enrollments and instructor course APIs." />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
