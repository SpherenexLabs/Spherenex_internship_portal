import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Tests = () => {
  const { tests } = useAuth();
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartTest = (test) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    selectedTest.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    const percentage = (correctAnswers / selectedTest.questions.length) * 100;
    setScore(percentage);
    setShowResults(true);
  };

  const handleBackToTests = () => {
    setSelectedTest(null);
    setShowResults(false);
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
        <h1>{selectedTest.title}</h1>
        <div className="test-progress">
          <p>Question {currentQuestion + 1} of {selectedTest.questions.length}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / selectedTest.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="question-card">
          <h3>{question.question}</h3>
          <div className="options-list">
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className={`option-item ${answers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerSelect(currentQuestion, index)}
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="test-navigation">
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            className="btn-secondary"
          >
            Previous
          </button>
          
          {currentQuestion === selectedTest.questions.length - 1 ? (
            <button onClick={handleSubmit} className="btn-primary">
              Submit Test
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary">
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="section-content">
      <h1>Available Tests</h1>
      
      {tests.length === 0 ? (
        <p>No tests available at the moment. Check back later!</p>
      ) : (
        <div className="tests-grid">
          {tests.map(test => (
            <div key={test.id} className="test-card">
              <h3>{test.title}</h3>
              <p>{test.description}</p>
              <div className="test-info">
                <span>Duration: {test.duration} minutes</span>
                <span>Total Marks: {test.totalMarks}</span>
                <span>Questions: {test.questions.length}</span>
              </div>
              {test.scheduledDate && (
                <p className="test-date">
                  Scheduled: {new Date(test.scheduledDate).toLocaleString()}
                </p>
              )}
              <button onClick={() => handleStartTest(test)} className="btn-primary">
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tests;
