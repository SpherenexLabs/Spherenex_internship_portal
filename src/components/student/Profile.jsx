import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { currentUser, updateStudentProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || '',
    college: currentUser?.college || '',
    internshipDomain: currentUser?.internshipDomain || '',
    skills: currentUser?.skills || '',
    interests: currentUser?.interests || '',
    linkedIn: currentUser?.linkedIn || '',
    github: currentUser?.github || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      department: currentUser?.department || '',
      college: currentUser?.college || '',
      internshipDomain: currentUser?.internshipDomain || '',
      skills: currentUser?.skills || '',
      interests: currentUser?.interests || '',
      linkedIn: currentUser?.linkedIn || '',
      github: currentUser?.github || '',
    });
    setErrorMessage('');
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateStudentProfile(currentUser.id, formData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const domains = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Game Development',
    'Blockchain',
    'IoT',
    'Other'
  ];

  return (
    <div className="section-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Profile</h1>
        {!isEditing && (
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          borderRadius: '5px', 
          marginBottom: '15px',
          border: '1px solid #c3e6cb'
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '5px', 
          marginBottom: '15px',
          border: '1px solid #f5c6cb'
        }}>
          {errorMessage}
        </div>
      )}
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {(isEditing ? formData.name : currentUser?.name)?.charAt(0).toUpperCase()}
          </div>
          <h2>{isEditing ? formData.name : currentUser?.name}</h2>
        </div>
        
        <div className="profile-details">
          <div className="detail-row">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>{currentUser?.name}</span>
            )}
          </div>

          <div className="detail-row">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>{currentUser?.email}</span>
            )}
          </div>
          
          <div className="detail-row">
            <label>Phone:</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter phone number"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>{currentUser?.phone || 'Not provided'}</span>
            )}
          </div>
          
          <div className="detail-row">
            <label>Department:</label>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Computer Science"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>{currentUser?.department || 'Not provided'}</span>
            )}
          </div>
          
          <div className="detail-row">
            <label>College:</label>
            {isEditing ? (
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter college name"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>{currentUser?.college || 'Not provided'}</span>
            )}
          </div>

          <div className="detail-row">
            <label>Internship Domain:</label>
            {isEditing ? (
              <input
                type="text"
                name="internshipDomain"
                value={formData.internshipDomain}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Web Development, AI, Data Science"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>{currentUser?.internshipDomain || 'Not selected'}</span>
            )}
          </div>

          <div className="detail-row">
            <label>Skills:</label>
            {isEditing ? (
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., JavaScript, Python, React"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>{currentUser?.skills || 'Not provided'}</span>
            )}
          </div>

          <div className="detail-row">
            <label>Interests:</label>
            {isEditing ? (
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., AI, Web Development, Data Science"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>{currentUser?.interests || 'Not provided'}</span>
            )}
          </div>

          <div className="detail-row">
            <label>LinkedIn:</label>
            {isEditing ? (
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://linkedin.com/in/yourprofile"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>
                {currentUser?.linkedIn ? (
                  <a href={currentUser.linkedIn} target="_blank" rel="noopener noreferrer">
                    {currentUser.linkedIn}
                  </a>
                ) : (
                  'Not provided'
                )}
              </span>
            )}
          </div>

          <div className="detail-row">
            <label>GitHub:</label>
            {isEditing ? (
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://github.com/yourusername"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            ) : (
              <span>
                {currentUser?.github ? (
                  <a href={currentUser.github} target="_blank" rel="noopener noreferrer">
                    {currentUser.github}
                  </a>
                ) : (
                  'Not provided'
                )}
              </span>
            )}
          </div>
          
          <div className="detail-row">
            <label>Student ID:</label>
            <span>{currentUser?.id}</span>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
