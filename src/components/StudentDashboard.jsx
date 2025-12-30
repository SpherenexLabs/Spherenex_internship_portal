import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Profile from './student/Profile';
import Queries from './student/Queries';
import Videos from './student/Videos';
import Schedules from './student/Schedules';
import Performance from './student/Performance';
import Tests from './student/Tests';
import InterviewStatus from './student/InterviewStatus';
import './Dashboard.css';
import spherenexLogo from '../assets/Logo-removebg-preview.png';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { currentUser, logout, performancePoints, tests, interviewReferrals } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMyTotalPoints = () => {
    const myPoints = performancePoints[currentUser?.id] || [];
    return myPoints.reduce((sum, entry) => sum + entry.points, 0);
  };

  const getMyReferrals = () => {
    return interviewReferrals.filter(ref => ref.studentId === currentUser?.id);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={spherenexLogo} alt="Spherenex" className="sidebar-logo" />
          <h2>Student Portal</h2>
          <p>{currentUser?.name}</p>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={activeSection === 'overview' ? 'active' : ''} 
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button 
            className={activeSection === 'profile' ? 'active' : ''} 
            onClick={() => setActiveSection('profile')}
          >
            Profile
          </button>
          <button 
            className={activeSection === 'performance' ? 'active' : ''} 
            onClick={() => setActiveSection('performance')}
          >
            Performance Points
          </button>
          <button 
            className={activeSection === 'tests' ? 'active' : ''} 
            onClick={() => setActiveSection('tests')}
          >
            Tests
          </button>
          <button 
            className={activeSection === 'videos' ? 'active' : ''} 
            onClick={() => setActiveSection('videos')}
          >
            Learning Videos
          </button>
          <button 
            className={activeSection === 'schedules' ? 'active' : ''} 
            onClick={() => setActiveSection('schedules')}
          >
            Schedules
          </button>
          <button 
            className={activeSection === 'interview' ? 'active' : ''} 
            onClick={() => setActiveSection('interview')}
          >
            Interview Referral
          </button>
          <button 
            className={activeSection === 'queries' ? 'active' : ''} 
            onClick={() => setActiveSection('queries')}
          >
            Queries
          </button>
        </nav>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="main-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <h1>Welcome, {currentUser?.name}!</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Performance Points</h3>
                <p className="stat-number">{getMyTotalPoints()}</p>
              </div>
              <div className="stat-card">
                <h3>Available Tests</h3>
                <p className="stat-number">{tests.length}</p>
              </div>
              <div className="stat-card">
                <h3>Interview Referrals</h3>
                <p className="stat-number">{getMyReferrals().length}</p>
              </div>
            </div>
            
            <div className="quick-info">
              <div className="info-card">
                <h3>Your Progress</h3>
                <p>Keep completing tasks and tests to earn performance points!</p>
                <p>Reach 70 points to be eligible for interview referrals.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'profile' && <Profile />}
        {activeSection === 'performance' && <Performance />}
        {activeSection === 'tests' && <Tests />}
        {activeSection === 'videos' && <Videos />}
        {activeSection === 'schedules' && <Schedules />}
        {activeSection === 'interview' && <InterviewStatus />}
        {activeSection === 'queries' && <Queries />}
      </div>
    </div>
  );
};

export default StudentDashboard;
