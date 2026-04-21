import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Services/api'; 
import styles from "../login/Login.module.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student' // ✅ لازم تطابق backend
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log("SENDING DATA:", formData);

      await api.post("/auth/register", formData);

      navigate('/login');

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      <div className={`card p-4 shadow-lg ${styles.authCard}`} style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">

          <div className={styles.logoIconWrapper}>
            <i className="fa-solid fa-graduation-cap text-white fs-2"></i>
          </div>

          <h3 className="text-center fw-bold mb-1">Create Account</h3>
          <p className="text-center text-muted mb-4 small">Join our learning platform today</p>

          {error && <div className="alert alert-danger py-2 small text-center border-0 mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">Full Name</label>
              <input 
                type="text" 
                className="form-control form-control-lg fs-6" 
                placeholder="  your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required 
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-lg fs-6" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required 
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">Password</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control form-control-lg fs-6" 
                  placeholder="at least 6 car"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required 
                />
                <span 
                  className={styles.eyeIcon} 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            {/* ROLE */}
            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">I want to join as:</label>
              <select 
                className="form-select form-select-lg fs-6"
                style={{ borderRadius: '12px' }}
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>

            {/* SUBMIT */}
            <button 
              type="submit" 
              className={`btn btn-primary w-100 py-3 ${styles.mainBtn}`} 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : "Create Account"}
            </button>

          </form>

          <div className="text-center mt-4">
            <p className="text-muted small">
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}