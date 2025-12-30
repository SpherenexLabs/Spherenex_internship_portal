const Videos = () => {
  const videoLibrary = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      url: 'https://www.youtube.com/embed/UB1O30fR-EE',
      duration: '45 min'
    },
    {
      id: 2,
      title: 'React.js Fundamentals',
      description: 'Complete React tutorial for beginners',
      url: 'https://www.youtube.com/embed/SqcY0GlETPk',
      duration: '2 hours'
    },
    {
      id: 3,
      title: 'JavaScript ES6+ Features',
      description: 'Modern JavaScript features and best practices',
      url: 'https://www.youtube.com/embed/NCwa_xi0Uuc',
      duration: '1 hour'
    },
    {
      id: 4,
      title: 'Git and GitHub Tutorial',
      description: 'Version control and collaboration',
      url: 'https://www.youtube.com/embed/RGOj5yH7evk',
      duration: '30 min'
    },
    {
      id: 5,
      title: 'Node.js Backend Development',
      description: 'Building RESTful APIs with Node.js',
      url: 'https://www.youtube.com/embed/Oe421EPjeBE',
      duration: '1.5 hours'
    },
    {
      id: 6,
      title: 'Database Design Basics',
      description: 'SQL and database fundamentals',
      url: 'https://www.youtube.com/embed/HXV3zeQKqGY',
      duration: '1 hour'
    }
  ];

  return (
    <div className="section-content">
      <h1>Learning Videos</h1>
      <p>Enhance your skills with these curated learning resources</p>
      
      <div className="videos-grid">
        {videoLibrary.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-wrapper">
              <iframe
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <span className="video-duration">Duration: {video.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
