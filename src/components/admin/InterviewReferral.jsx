import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const InterviewReferral = () => {
  const { students, addInterviewReferral, performancePoints } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    interviewDate: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [eligibleStudents, setEligibleStudents] = useState([]);

  const getStudentTotalPoints = (studentId) => {
    const studentPoints = performancePoints[studentId] || [];
    return studentPoints.reduce((sum, entry) => sum + entry.points, 0);
  };

  const checkEligibility = () => {
    const eligible = students.filter(student => getStudentTotalPoints(student.id) >= 70);
    setEligibleStudents(eligible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !formData.company || !formData.position) {
      setMessage('Please fill all required fields');
      return;
    }

    const student = students.find(s => s.id === selectedStudent);
    const totalPoints = getStudentTotalPoints(selectedStudent);

    if (totalPoints < 70) {
      setMessage('Student does not meet minimum points requirement (70 points)');
      return;
    }

    try {
      await addInterviewReferral({
        studentId: selectedStudent,
        studentName: student.name,
        studentEmail: student.email,
        ...formData,
        referredDate: new Date().toISOString()
      });

      setMessage('Interview referral created successfully in Firestore!');
      setSelectedStudent('');
      setFormData({
        company: '',
        position: '',
        interviewDate: '',
        notes: ''
      });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating referral. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="section-content">
      <h1>Interview Referral</h1>
      
      <div className="info-box">
        <p>Students need minimum 70 performance points for interview referral</p>
        <button type="button" onClick={checkEligibility} className="btn-secondary">
          Check Eligible Students
        </button>
      </div>

      {eligibleStudents.length > 0 && (
        <div className="eligible-students">
          <h3>Eligible Students ({eligibleStudents.length})</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {eligibleStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{getStudentTotalPoints(student.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                {student.name} - Points: {getStudentTotalPoints(student.id)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Company Name *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="Company name"
          />
        </div>
        
        <div className="form-group">
          <label>Position *</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            placeholder="Job position"
          />
        </div>
        
        <div className="form-group">
          <label>Interview Date</label>
          <input
            type="datetime-local"
            name="interviewDate"
            value={formData.interviewDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Additional notes or requirements"
          />
        </div>
        
        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <button type="submit" className="btn-primary">Create Referral</button>
      </form>
    </div>
  );
};

export default InterviewReferral;
