import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AllocatePoints = () => {
  const { students = [], allocatePoints, performancePoints = {}, testScores = [] } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');

  // Fetch domains
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const domainsRef = collection(db, 'internshipDomains');
        const snapshot = await getDocs(domainsRef);
        const domainsData = snapshot.docs.map(doc => doc.data().name).sort();
        setDomains(domainsData);
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };
    
    fetchDomains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !points || !reason) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      // Pass studentId as string (no parseInt)
      await allocatePoints(selectedStudent, parseInt(points), reason);
      setMessage('Points allocated successfully in Firestore!');
      setSelectedStudent('');
      setPoints('');
      setReason('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error allocating points. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStudentTotalPoints = (studentId) => {
    const studentPoints = performancePoints[studentId] || [];
    return studentPoints.reduce((sum, entry) => sum + entry.points, 0);
  };

  const getStudentTestScores = (studentId) => {
    return testScores.filter(score => score.studentId === studentId);
  };

  const getStudentAvgScore = (studentId) => {
    const scores = getStudentTestScores(studentId);
    if (scores.length === 0) return 'N/A';
    const avg = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    return avg.toFixed(1) + '%';
  };

  // Filter students by domain
  const filteredStudents = selectedDomain
    ? students.filter(student => student.internshipDomain === selectedDomain)
    : students;

  return (
    <div className="section-content">
      <h1>Allocate Performance Points</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Select Student *</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
          >
            <option value="">-- Select Student --</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Points *</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            required
            placeholder="Enter points (can be negative)"
          />
        </div>
        
        <div className="form-group">
          <label>Reason *</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows="4"
            placeholder="Reason for points allocation"
          />
        </div>
        
        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <button type="submit" className="btn-primary">Allocate Points</button>
      </form>

      <div className="points-overview">
        <h2>Student Test Scores & Performance Points</h2>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Filter by Domain</label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <option value="">-- All Domains --</option>
            {domains.map((domain, index) => (
              <option key={index} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <p>No students available for the selected domain</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Domain</th>
                <th>Avg Test Score</th>
                <th>Tests Taken</th>
                <th>Performance Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const studentScores = getStudentTestScores(student.id);
                return (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.internshipDomain || 'N/A'}</td>
                    <td className="points-cell">{getStudentAvgScore(student.id)}</td>
                    <td>{studentScores.length}</td>
                    <td className="points-cell">{getStudentTotalPoints(student.id)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllocatePoints;
