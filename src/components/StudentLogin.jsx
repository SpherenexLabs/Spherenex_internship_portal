import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import spherenexLogo from '../assets/Logo-removebg-preview.png';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginStudent } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await loginStudent(email, password);
    if (success) {
      navigate('/student/dashboard');
    } else {
      setError('Invalid student credentials. Please contact admin.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={spherenexLogo} alt="Spherenex Logo" className="auth-logo" />
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <div className="auth-footer">
          <p>Use credentials provided by admin</p>
          <button onClick={() => navigate('/admin')} className="btn-link">
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
