import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const CreateStudent = () => {
  const { addStudent } = useAuth();
  const [domains, setDomains] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    internshipDomain: '',
    department: '',
    college: ''
  });
  const [message, setMessage] = useState('');

  // Fetch domains from Firestore
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Please fill all required fields');
      return;
    }

    try {
      await addStudent(formData);
      setMessage('Student created successfully in Firestore!');
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        internshipDomain: '',
        department: '',
        college: ''
      });

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating student. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="section-content">
      <h1>Create Student Account</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Student full name"
          />
        </div>
        
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="student@example.com"
          />
        </div>
        
        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create password"
          />
        </div>
        
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>
        
        <div className="form-group">
          <label>Internship Domain *</label>
          <select
            name="internshipDomain"
            value={formData.internshipDomain}
            onChange={handleChange}
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
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Computer Science"
          />
        </div>
        
        <div className="form-group">
          <label>College</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="College name"
          />
        </div>
        
        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <button type="submit" className="btn-primary">Create Student</button>
      </form>
    </div>
  );
};

export default CreateStudent;
