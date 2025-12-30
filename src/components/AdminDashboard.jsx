import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateStudent from './admin/CreateStudent';
import BulkCreateStudent from './admin/BulkCreateStudent';
import AllocatePoints from './admin/AllocatePoints';
import CreateTest from './admin/CreateTest';
import InterviewReferral from './admin/InterviewReferral';
import './Dashboard.css';
import spherenexLogo from '../assets/Logo-removebg-preview.png';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { currentUser, logout, students, tests, firestoreError, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={spherenexLogo} alt="Spherenex" className="sidebar-logo" />
          <h2>Admin Panel</h2>
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
            className={activeSection === 'create-student' ? 'active' : ''} 
            onClick={() => setActiveSection('create-student')}
          >
            Create Student
          </button>
          <button 
            className={activeSection === 'bulk-create' ? 'active' : ''} 
            onClick={() => setActiveSection('bulk-create')}
          >
            Bulk Create Students
          </button>
          <button 
            className={activeSection === 'allocate-points' ? 'active' : ''} 
            onClick={() => setActiveSection('allocate-points')}
          >
            Allocate Points
          </button>
          <button 
            className={activeSection === 'create-test' ? 'active' : ''} 
            onClick={() => setActiveSection('create-test')}
          >
            Create Test
          </button>
          <button 
            className={activeSection === 'interview-referral' ? 'active' : ''} 
            onClick={() => setActiveSection('interview-referral')}
          >
            Interview Referral
          </button>
        </nav>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="main-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <h1>Admin Dashboard</h1>
            
            {firestoreError && (
              <div className="error-message" style={{ marginBottom: '20px' }}>
                <strong>Firestore Error:</strong> {firestoreError}
                <p style={{ marginTop: '10px', fontSize: '14px' }}>
                  Please configure Firestore security rules in Firebase Console. 
                  Go to Firestore Database → Rules and allow read/write access to the students collection.
                </p>
              </div>
            )}
            
            {loading && <p>Loading students from Firestore...</p>}
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Students</h3>
                <p className="stat-number">{students.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Tests</h3>
                <p className="stat-number">{tests.length}</p>
              </div>
              <div className="stat-card">
                <h3>Active Interns</h3>
                <p className="stat-number">{students.length}</p>
              </div>
            </div>
            
            <div className="recent-students">
              <h2>Recent Students</h2>
              {students.length === 0 ? (
                <p>No students created yet. Create your first student!</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(-10).reverse().map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>{student.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        
        {activeSection === 'create-student' && <CreateStudent />}
        {activeSection === 'bulk-create' && <BulkCreateStudent />}
        {activeSection === 'allocate-points' && <AllocatePoints />}
        {activeSection === 'create-test' && <CreateTest />}
        {activeSection === 'interview-referral' && <InterviewReferral />}
      </div>
    </div>
  );
};

export default AdminDashboard;
