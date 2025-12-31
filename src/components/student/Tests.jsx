import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Tests = () => {
  const { tests = [], currentUser, saveTestScore, testScores = [] } = useAuth();
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testEnded, setTestEnded] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Filter tests by student's domain
  const availableTests = tests.filter(test => 
    test.domain === currentUser?.internshipDomain
  );

  // Check if student has already taken a test
  const hasCompletedTest = (testId) => {
    return testScores.some(score => 
      score.studentId === currentUser?.id && score.testId === testId
    );
  };

  // Get student's previous score for a test
  const getPreviousScore = (testId) => {
    return testScores.find(score => 
      score.studentId === currentUser?.id && score.testId === testId
    );
  };

  const handleTimeUp = () => {
    setTestEnded(true);
    handleSubmit();
  };

  const handleSubmit = async () => {
    setTestEnded(true);
    let correctCount = 0;
    selectedTest.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    const percentage = (correctCount / selectedTest.questions.length) * 100;
    setScore(percentage);
    setCorrectAnswers(correctCount);
    setShowResults(true);
    
    // Save score to Firestore
    if (currentUser && saveTestScore) {
      try {
        await saveTestScore(
          currentUser.id,
          selectedTest.id,
          selectedTest.title,
          percentage,
          selectedTest.questions.length,
          correctCount
        );
        console.log('Test score saved successfully!');
      } catch (error) {
        console.error('Error saving test score:', error);
        alert('Failed to save test score. Please contact administrator.');
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (testStarted && timeRemaining > 0 && !testEnded) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setTestEnded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [testStarted, timeRemaining, testEnded]);

  // Auto-submit when time ends
  useEffect(() => {
    if (testEnded && selectedTest && !showResults) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testEnded]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = (test) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setTestStarted(true);
    setTimeRemaining(test.duration * 60); // Convert minutes to seconds
    setTestEnded(false);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    // Allow changing answers multiple times
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleBackToTests = () => {
    setSelectedTest(null);
    setShowResults(false);
    setTestStarted(false);
    setTestEnded(false);
  };

  if (showResults) {
    return (
      <div className="section-content">
        <h1>Test Results</h1>
        <div className="results-card">
          <h2>{selectedTest.title}</h2>
          <div className="score-display">
            <p className="score-label">Your Score</p>
            <p className="score-value">{score.toFixed(1)}%</p>
            <p className="score-feedback">
              {score >= 70 ? 'Excellent! You passed!' : 'Keep practicing!'}
            </p>
          </div>
          <button onClick={handleBackToTests} className="btn-primary">
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  if (selectedTest) {
    const question = selectedTest.questions[currentQuestion];
    
    return (
      <div className="section-content">
        <div className="test-header">
          <h1>{selectedTest.title}</h1>
          <div className={`timer ${timeRemaining <= 60 ? 'timer-warning' : ''}`}>
            <span>⏱️ Time Remaining: {formatTime(timeRemaining)}</span>
          </div>
        </div>

        <div className="question-container">
          <h2 className="question-title">{question.question}</h2>
          
          <div className="options-container">
            {question.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              return (
                <div
                  key={index}
                  className={`option-box ${isSelected ? 'option-selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                >
                  <div className="option-radio">
                    {isSelected && <div className="option-radio-inner"></div>}
                  </div>
                  <span className="option-text">{option}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="test-footer">
          <div className="question-navigation">
            {selectedTest.questions.map((_, index) => (
              <button
                key={index}
                className={`question-number ${index === currentQuestion ? 'current' : ''} ${answers[index] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleSubmit} 
            className="btn-submit-test"
            disabled={Object.keys(answers).length !== selectedTest.questions.length}
          >
            Submit Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content">
      <h1>Available Tests</h1>
      
      {currentUser?.internshipDomain ? (
        <p className="domain-info">Showing tests for: <strong>{currentUser.internshipDomain}</strong></p>
      ) : (
        <p className="warning-message">Please update your internship domain in your profile to see available tests.</p>
      )}
      
      {availableTests.length === 0 ? (
        <p>No tests available for your domain at the moment. Check back later!</p>
      ) : (
        <div className="tests-grid">
          {availableTests.map(test => {
            const completed = hasCompletedTest(test.id);
            const previousScore = getPreviousScore(test.id);
            
            return (
              <div key={test.id} className="test-card">
                <h3>{test.title}</h3>
                <p>{test.description}</p>
                <div className="test-info">
                  <span>⏱️ Duration: {test.duration} minutes</span>
                  <span>📝 Total Marks: {test.totalMarks}</span>
                  <span>❓ Questions: {test.questions.length}</span>
                </div>
                <div className="test-domain">
                  <span>🎯 Domain: {test.domain}</span>
                </div>
                {test.scheduledDate && (
                  <p className="test-date">
                    📅 Scheduled: {new Date(test.scheduledDate).toLocaleString()}
                  </p>
                )}
                
                {completed ? (
                  <div className="test-completed">
                    <div className="completed-badge">✓ Completed</div>
                    <p className="previous-score">
                      Your Score: <strong>{previousScore?.score.toFixed(1)}%</strong>
                    </p>
                    <p className="completed-message">
                      You have already taken this test. You cannot retake it.
                    </p>
                  </div>
                ) : (
                  <button onClick={() => handleStartTest(test)} className="btn-primary">
                    Start Test
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tests;
