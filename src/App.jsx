import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/navbar/Navbar'
import Hero from './Pages/hero/Hero'
import Login from './Pages/login/Login'
import Register from './Pages/register/Register'
import InstructorDashboard from './Pages/instructor/InstructorDashboard'
import Courses from './Pages/courses/MyCourses'

import AuthProvider from './Context/AuthProvider' 
import ManageLessons from './Pages/lesson/ManageLessons'
import ExploreCourses from './Pages/courses/ExploreCourses'
import CourseDetails from './Pages/courses/CourseDetails'
import MyCourses from './Pages/courses/MyCourses'
import LearningPage from './Pages/lessons/LearningPage'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<ExploreCourses />} />
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/course/:courseId/lessons" element={<ManageLessons />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learning/:courseId" element={<LearningPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}