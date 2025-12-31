import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Queries = () => {
  const { currentUser, queries, addQuery } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      await addQuery({
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        ...formData
      });

      setMessage('Query submitted successfully to Firestore! Admin will respond soon.');
      setFormData({ subject: '', description: '' });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error submitting query. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const myQueries = queries.filter(q => q.studentId === currentUser?.id);

  return (
    <div className="section-content">
      <h1>Submit Query</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Query subject"
          />
        </div>
        
        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe your query in detail"
          />
        </div>
        
        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <button type="submit" className="btn-primary">Submit Query</button>
      </form>

      <div className="queries-list">
        <h2>My Queries</h2>
        {myQueries.length === 0 ? (
          <p>No queries submitted yet</p>
        ) : (
          <div className="query-items">
            {myQueries.map(query => (
              <div key={query.id} className="query-card">
                <div className="query-header">
                  <h3>{query.subject}</h3>
                  <span className={`status-badge ${query.status.toLowerCase()}`}>
                    {query.status}
                  </span>
                </div>
                <p><strong>Your Query:</strong></p>
                <p>{query.description}</p>
                <small>Submitted: {new Date(query.createdAt).toLocaleString()}</small>
                
                {query.reply && (
                  <div className="admin-reply">
                    <p><strong>Admin Reply:</strong></p>
                    <p className="reply-text">{query.reply}</p>
                    <small>Replied: {new Date(query.repliedAt).toLocaleString()}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queries;
