const Schedules = () => {
  const scheduleData = [
    {
      id: 1,
      day: 'Monday',
      events: [
        { time: '09:00 AM', activity: 'Team Standup Meeting', type: 'meeting' },
        { time: '10:00 AM', activity: 'Development Tasks', type: 'work' },
        { time: '02:00 PM', activity: 'Code Review Session', type: 'meeting' }
      ]
    },
    {
      id: 2,
      day: 'Tuesday',
      events: [
        { time: '09:00 AM', activity: 'Technical Training', type: 'training' },
        { time: '11:00 AM', activity: 'Project Work', type: 'work' },
        { time: '03:00 PM', activity: 'Mentor Session', type: 'meeting' }
      ]
    },
    {
      id: 3,
      day: 'Wednesday',
      events: [
        { time: '09:00 AM', activity: 'Development Tasks', type: 'work' },
        { time: '01:00 PM', activity: 'Testing & QA', type: 'work' },
        { time: '04:00 PM', activity: 'Team Sync', type: 'meeting' }
      ]
    },
    {
      id: 4,
      day: 'Thursday',
      events: [
        { time: '09:00 AM', activity: 'Sprint Planning', type: 'meeting' },
        { time: '10:30 AM', activity: 'Development Tasks', type: 'work' },
        { time: '03:00 PM', activity: 'Learning Session', type: 'training' }
      ]
    },
    {
      id: 5,
      day: 'Friday',
      events: [
        { time: '09:00 AM', activity: 'Project Work', type: 'work' },
        { time: '02:00 PM', activity: 'Sprint Review', type: 'meeting' },
        { time: '04:00 PM', activity: 'Weekly Retrospective', type: 'meeting' }
      ]
    }
  ];

  const getEventClass = (type) => {
    switch(type) {
      case 'meeting': return 'event-meeting';
      case 'training': return 'event-training';
      case 'work': return 'event-work';
      default: return '';
    }
  };

  return (
    <div className="section-content">
      <h1>Weekly Schedule</h1>
      <p>Your internship schedule for this week</p>
      
      <div className="schedule-container">
        {scheduleData.map(day => (
          <div key={day.id} className="schedule-day">
            <h3 className="day-header">{day.day}</h3>
            <div className="events-list">
              {day.events.map((event, index) => (
                <div key={index} className={`event-item ${getEventClass(event.type)}`}>
                  <span className="event-time">{event.time}</span>
                  <span className="event-activity">{event.activity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="schedule-legend">
        <h3>Legend:</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color event-meeting"></span>
            <span>Meetings</span>
          </div>
          <div className="legend-item">
            <span className="legend-color event-training"></span>
            <span>Training/Learning</span>
          </div>
          <div className="legend-item">
            <span className="legend-color event-work"></span>
            <span>Development Work</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
