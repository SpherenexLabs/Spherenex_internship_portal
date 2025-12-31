import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateStudent from './admin/CreateStudent';
import BulkCreateStudent from './admin/BulkCreateStudent';
import AllocatePoints from './admin/AllocatePoints';
import CreateTest from './admin/CreateTest';
import InterviewReferral from './admin/InterviewReferral';
import ManageQueries from './admin/ManageQueries';
import './Dashboard.css';
import spherenexLogo from '../assets/Logo-removebg-preview.png';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { currentUser, logout, students, tests, domains, firestoreError, loading, addDomain, deleteDomain } = useAuth();
  const navigate = useNavigate();
  const [newDomain, setNewDomain] = useState('');
  const [domainMessage, setDomainMessage] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomain.trim()) {
      setDomainMessage('Please enter a domain name');
      setTimeout(() => setDomainMessage(''), 2000);
      return;
    }

    try {
      await addDomain(newDomain.trim());
      setNewDomain('');
      setDomainMessage('Domain added successfully!');
      setTimeout(() => setDomainMessage(''), 2000);
    } catch (error) {
      setDomainMessage('Error adding domain');
      setTimeout(() => setDomainMessage(''), 2000);
    }
  };

  const handleDeleteDomain = async (domainId) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      try {
        await deleteDomain(domainId);
        setDomainMessage('Domain deleted successfully!');
        setTimeout(() => setDomainMessage(''), 2000);
      } catch (error) {
        setDomainMessage('Error deleting domain');
        setTimeout(() => setDomainMessage(''), 2000);
      }
    }
  };

  const handleExportStudents = async () => {
    try {
      const XLSX = await import('xlsx');
      
      // Prepare data for export
      const exportData = students.map(student => ({
        'Name': student.name || '',
        'Email': student.email || '',
        'Password': student.password || '',
        'Phone': student.phone || '',
        'Internship Domain': student.internshipDomain || '',
        'Department': student.department || '',
        'College': student.college || ''
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `students_export_${date}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting students:', error);
      alert('Error exporting students. Make sure xlsx package is installed.');
    }
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
            
            <div className="domain-management-section">
              <h2>Internship Domains</h2>
              <form onSubmit={handleAddDomain} className="domain-form">
                <div className="domain-input-group">
                  <label>Add New Domain</label>
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="e.g., AI and ML, Web Development, Data Science"
                  />
                </div>
                <button type="submit" className="btn-add-domain">
                  Add Domain
                </button>
              </form>

              {domainMessage && (
                <div className={domainMessage.includes('success') ? 'success-message' : 'error-message'}>
                  {domainMessage}
                </div>
              )}

              <div className="domains-list">
                {domains.length === 0 ? (
                  <p className="no-domains-message">No domains added yet. Add your first domain!</p>
                ) : (
                  domains.map(domain => (
                    <div key={domain.id} className="domain-badge">
                      <span>{domain.name}</span>
                      <button
                        onClick={() => handleDeleteDomain(domain.id)}
                        className="domain-delete-btn"
                        title="Delete domain"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="recent-students">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Recent Students</h2>
                {students.length > 0 && (
                  <button onClick={handleExportStudents} className="btn-export">
                    Export All Students
                  </button>
                )}
              </div>
              {students.length === 0 ? (
                <p>No students created yet. Create your first student!</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Internship Domain</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(-5).reverse().map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>{student.internshipDomain || 'N/A'}</td>
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
        {activeSection === 'queries' && <ManageQueries />}
      </div>
    </div>
  );
};

export default AdminDashboard;
