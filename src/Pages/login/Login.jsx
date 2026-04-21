import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
try {
      const response = await login(email, password); 
      
      const userRole = response.data?.user?.role;

      if (userRole === 'Instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/my-courses');
      }
    }catch (err) {
  setError(err);
} finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className={`card p-4 shadow-lg ${styles.authCard}`} style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body">
          
          <div className={styles.logoIconWrapper}>
            <i className="fa-solid fa-graduation-cap text-white fs-2"></i>
          </div>

          <h3 className="text-center fw-bold mb-1">Welcome Back</h3>
          <p className="text-center text-muted mb-4 small">Enter your credentials to access your account</p>

          {error && <div className="alert alert-danger py-2 small text-center border-0 mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-lg fs-6" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">Password</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control form-control-lg fs-6" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button 
              type="submit" 
              className={`btn btn-primary w-100 py-3 ${styles.mainBtn}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted small">
              Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create free account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}