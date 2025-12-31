import { useAuth } from '../../context/AuthContext';

const InterviewStatus = () => {
  const { currentUser, interviewReferrals, performancePoints } = useAuth();

  const myReferrals = interviewReferrals.filter(ref => ref.studentId === currentUser?.id);
  const myPoints = performancePoints[currentUser?.id] || [];
  const totalPoints = myPoints.reduce((sum, entry) => sum + entry.points, 0);

  const getInterviewStatus = (referral) => {
    if (referral.interviewDate) {
      const interviewDateTime = new Date(referral.interviewDate).getTime();
      const currentDateTime = new Date().getTime();
      
      if (currentDateTime > interviewDateTime) {
        return 'COMPLETED';
      }
    }
    return referral.status;
  };

  return (
    <div className="section-content">
      <h1>Interview Referral Status</h1>
      
      <div className="eligibility-card">
        <h2>Eligibility Status</h2>
        <div className="eligibility-info">
          <p>Your Points: <strong>{totalPoints}</strong></p>
          <p>Required Points: <strong>70</strong></p>
          {totalPoints >= 70 ? (
            <div className="eligible-badge">
              ✅ You are eligible for interview referrals!
            </div>
          ) : (
            <div className="not-eligible-badge">
              ⏳ Earn {70 - totalPoints} more points to be eligible
            </div>
          )}
        </div>
      </div>

      <div className="referrals-section">
        <h2>My Interview Referrals</h2>
        {myReferrals.length === 0 ? (
          <div className="no-referrals">
            <p>No interview referrals yet.</p>
            {totalPoints < 70 && (
              <p>Keep earning performance points to become eligible!</p>
            )}
          </div>
        ) : (
          <div className="referrals-list">
            {myReferrals.map(referral => {
              const displayStatus = getInterviewStatus(referral);
              return (
              <div key={referral.id} className="referral-card">
                <div className="referral-header">
                  <h3>{referral.company}</h3>
                  <span className={`status-badge ${displayStatus.toLowerCase()}`}>
                    {displayStatus}
                  </span>
                </div>
                <div className="referral-details">
                  <p><strong>Position:</strong> {referral.position}</p>
                  {referral.interviewDate && (
                    <p><strong>Interview Date:</strong> {new Date(referral.interviewDate).toLocaleString()}</p>
                  )}
                  <p><strong>Referred On:</strong> {new Date(referral.referredDate).toLocaleDateString()}</p>
                  {referral.notes && (
                    <div className="referral-notes">
                      <strong>Notes:</strong>
                      <p>{referral.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewStatus;
