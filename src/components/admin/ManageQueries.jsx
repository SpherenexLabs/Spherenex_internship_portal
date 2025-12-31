import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ManageQueries = () => {
  const { queries, replyToQuery } = useAuth();
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [reply, setReply] = useState('');
  const [message, setMessage] = useState('');

  console.log('Queries in admin:', queries);

  const handleReply = async (queryId) => {
    if (!reply.trim()) {
      setMessage('Please enter a reply');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      await replyToQuery(queryId, reply);
      setMessage('Reply sent successfully!');
      setReply('');
      setSelectedQuery(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error sending reply. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="section-content">
      <h1>Student Queries</h1>
      
      {message && (
        <div className={message.includes('success') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      {queries.length === 0 ? (
        <p>No queries from students yet</p>
      ) : (
        <div className="queries-admin-list">
          {queries.map(query => (
            <div key={query.id} className="admin-query-card">
              <div className="query-header">
                <div>
                  <h3>{query.subject}</h3>
                  <p className="student-info">
                    <strong>{query.studentName}</strong> ({query.studentEmail})
                  </p>
                </div>
                <span className={`status-badge ${query.status.toLowerCase()}`}>
                  {query.status}
                </span>
              </div>
              
              <div className="query-body">
                <p><strong>Query:</strong></p>
                <p>{query.description}</p>
                <small>Submitted: {new Date(query.createdAt).toLocaleString()}</small>
              </div>

              {query.reply && (
                <div className="query-reply">
                  <p><strong>Your Reply:</strong></p>
                  <p>{query.reply}</p>
                  <small>Replied: {new Date(query.repliedAt).toLocaleString()}</small>
                </div>
              )}

              {selectedQuery === query.id ? (
                <div className="reply-form">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows="4"
                    placeholder="Type your reply here..."
                    className="reply-textarea"
                  />
                  <div className="reply-actions">
                    <button 
                      onClick={() => handleReply(query.id)} 
                      className="btn-primary"
                    >
                      Send Reply
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedQuery(null);
                        setReply('');
                      }} 
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedQuery(query.id)}
                  className="btn-reply"
                  disabled={query.status === 'Resolved'}
                >
                  {query.reply ? 'Update Reply' : 'Reply to Query'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageQueries;
