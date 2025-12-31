import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const CreateTest = () => {
  const { addTest } = useAuth();
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    totalMarks: '',
    scheduledDate: '',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
  const [message, setMessage] = useState('');

  // Fetch unique internship domains from internshipDomains collection
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const domainsRef = collection(db, 'internshipDomains');
        const snapshot = await getDocs(domainsRef);
        const domainsData = snapshot.docs.map(doc => doc.data().name).sort();
        
        setDomains(domainsData);
      } catch (error) {
        console.error('Error fetching domains:', error);
        setMessage('Error loading domains');
      }
    };
    
    fetchDomains();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      setMessage('Please fill all fields for the question');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, currentQuestion]
    });
    setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
    setMessage('Question added!');
    setTimeout(() => setMessage(''), 2000);
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDomain) {
      setMessage('Please select a domain for this test');
      return;
    }
    
    if (!formData.title || !formData.duration || !formData.totalMarks || formData.questions.length === 0) {
      setMessage('Please fill all required fields and add at least one question');
      return;
    }

    try {
      const testData = {
        ...formData,
        domain: selectedDomain
      };
      await addTest(testData);
      setMessage('Test created successfully in Firestore!');
      setSelectedDomain('');
      setFormData({
        title: '',
        description: '',
        duration: '',
        totalMarks: '',
        scheduledDate: '',
        questions: []
      });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating test. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="section-content">
      <h1>Create Test</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Select Domain *</label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            required
          >
            <option value="">-- Select Internship Domain --</option>
            {domains.map((domain, index) => (
              <option key={index} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Test Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., JavaScript Fundamentals Test"
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Test description"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="0"
              placeholder="60"
            />
          </div>
          
          <div className="form-group">
            <label>Total Marks *</label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
              min="0"
              placeholder="100"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Scheduled Date</label>
          <input
            type="datetime-local"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
          />
        </div>

        <div className="questions-section">
          <h3>Add Questions</h3>
          
          <div className="question-form">
            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                placeholder="Enter question"
              />
            </div>
            
            {currentQuestion.options.map((option, index) => (
              <div className="form-group" key={index}>
                <label>Option {index + 1}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
            
            <div className="form-group">
              <label>Correct Answer</label>
              <select
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) })}
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>
            
            <button type="button" onClick={addQuestion} className="btn-secondary">
              Add Question
            </button>
          </div>

          <div className="questions-list">
            <h4>Questions Added: {formData.questions.length}</h4>
            {formData.questions.map((q, index) => (
              <div key={index} className="question-item">
                <p><strong>Q{index + 1}:</strong> {q.question}</p>
                <button type="button" onClick={() => removeQuestion(index)} className="btn-danger">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <button type="submit" className="btn-primary">Create Test</button>
      </form>
    </div>
  );
};

export default CreateTest;
