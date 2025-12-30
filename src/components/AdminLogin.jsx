import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import spherenexLogo from '../assets/Logo-removebg-preview.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (loginAdmin(email, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={spherenexLogo} alt="Spherenex Logo" className="auth-logo" />
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@spherenex.com"
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
          <p>Default credentials: admin@spherenex.com / admin123</p>
          <button onClick={() => navigate('/')} className="btn-link">
            Student Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
