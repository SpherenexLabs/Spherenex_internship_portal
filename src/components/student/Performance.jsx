import { useAuth } from '../../context/AuthContext';

const Performance = () => {
  const { currentUser, performancePoints } = useAuth();

  const myPoints = performancePoints[currentUser?.id] || [];
  const totalPoints = myPoints.reduce((sum, entry) => sum + entry.points, 0);

  return (
    <div className="section-content">
      <h1>Performance Points</h1>
      
      <div className="performance-summary">
        <div className="total-points-card">
          <h2>Total Points</h2>
          <p className="points-number">{totalPoints}</p>
          <div className="progress-info">
            <p>Target for Interview Referral: 70 points</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min((totalPoints / 70) * 100, 100)}%` }}
              ></div>
            </div>
            <p>{totalPoints >= 70 ? 'Eligible for referral! 🎉' : `${70 - totalPoints} points to go`}</p>
          </div>
        </div>
      </div>

      <div className="points-history">
        <h2>Points History</h2>
        {myPoints.length === 0 ? (
          <p>No points allocated yet. Keep working hard!</p>
        ) : (
          <div className="history-list">
            {myPoints.slice().reverse().map((entry, index) => (
              <div key={index} className="history-item">
                <div className="history-points">
                  <span className={entry.points > 0 ? 'points-positive' : 'points-negative'}>
                    {entry.points > 0 ? '+' : ''}{entry.points}
                  </span>
                </div>
                <div className="history-details">
                  <p className="history-reason">{entry.reason}</p>
                  <small>{new Date(entry.date).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
