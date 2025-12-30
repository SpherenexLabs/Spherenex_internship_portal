import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AllocatePoints = () => {
  const { students, allocatePoints, performancePoints } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

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
        <h2>Student Points Overview</h2>
        {students.length === 0 ? (
          <p>No students available</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td className="points-cell">{getStudentTotalPoints(student.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllocatePoints;
