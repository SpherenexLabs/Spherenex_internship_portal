import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const BulkCreateStudent = () => {
  const { addBulkStudents } = useAuth();
  const [csvData, setCsvData] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!csvData.trim()) {
      setMessage('Please enter student data');
      return;
    }

    try {
      const lines = csvData.trim().split('\n');
      const students = lines.map(line => {
        const [name, email, password, phone, internshipDomain, department, college] = line.split(',').map(s => s.trim());
        return { name, email, password, phone, internshipDomain, department, college };
      });

      const validStudents = students.filter(s => s.name && s.email && s.password);
      
      if (validStudents.length === 0) {
        setMessage('No valid students found. Check format.');
        return;
      }

      await addBulkStudents(validStudents);
      setMessage(`Successfully created ${validStudents.length} students in Firestore!`);
      setCsvData('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating students. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Handle Excel files
      try {
        const XLSX = await import('xlsx');
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const csvText = XLSX.utils.sheet_to_csv(firstSheet);
          setCsvData(csvText);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        setMessage('Error reading Excel file. Please install xlsx package or use CSV format.');
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      // Handle CSV/TXT files
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvData(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="section-content">
      <h1>Bulk Create Students</h1>
      
      <div className="info-box">
        <h3>Format Instructions:</h3>
        <p>Enter one student per line in CSV format:</p>
        <code>Name, Email, Password, Phone, Internship Domain, Department, College</code>
        <p style={{ marginTop: '10px' }}>Example:</p>
        <code>John Doe, john@example.com, pass123, 1234567890, Web Development, CS, XYZ College</code>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Upload CSV/Excel File (optional)</label>
          <input
            type="file"
            accept=".csv,.txt,.xlsx,.xls"
            onChange={handleFileUpload}
          />
        </div>

        <div className="form-group">
          <label>Or Paste Data Below:</label>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            rows="10"
            placeholder="John Doe, john@example.com, pass123, 1234567890, Web Development, CS, XYZ College&#10;Jane Smith, jane@example.com, pass456, 0987654321, Data Science, IT, ABC College"
          />
        </div>
        
        {message && (
          <div className={message.includes('Success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <button type="submit" className="btn-primary">Create All Students</button>
      </form>
    </div>
  );
};

export default BulkCreateStudent;
