import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [babies, setBabies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [upcomingVaccines, setUpcomingVaccines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, a, r, v] = await Promise.all([
          axios.get('/api/babies'),
          axios.get('/api/activities'),
          axios.get('/api/reminders'),
          axios.get('/api/vaccinations/upcoming')
        ]);
        setBabies(b.data);
        setActivities(a.data.slice(0, 5));
        setReminders(r.data.filter(rem => rem.isActive).slice(0, 3));
        setUpcomingVaccines(v.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    if (months < 1) return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days`;
    if (months < 24) return `${months} months`;
    return `${Math.floor(months / 12)} years`;
  };

  if (loading) return <div className="loading">Loading... 🍼</div>;

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h1>👋 Hello, {user?.name}!</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '0.3rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👶</div>
          <div className="stat-value">{babies.length}</div>
          <div className="stat-label">Total Babies</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'var(--secondary)' }}>
          <div className="stat-icon">📋</div>
          <div className="stat-value">{activities.length}</div>
          <div className="stat-label">Recent Activities</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'var(--accent)' }}>
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{reminders.length}</div>
          <div className="stat-label">Active Reminders</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'var(--success)' }}>
          <div className="stat-icon">❤️</div>
          <div className="stat-value">100%</div>
          <div className="stat-label">Care Score</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#FF9800' }}>
          <div className="stat-icon">💉</div>
          <div className="stat-value">{upcomingVaccines.length}</div>
          <div className="stat-label">Vaccines Due</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Babies */}
        <div className="card">
          <div className="card-title">👶 Your Babies
            <Link to="/babies" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, float: 'right' }}>View all →</Link>
           
          </div>
          
          {babies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👶</div>
              <p>No babies added yet.</p>
              <Link to="/babies" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem', width: 'auto' }}>Add Baby</Link>
            </div>
          ) : (
            babies.slice(0, 3).map(baby => (
              <div key={baby._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '2rem' }}>{baby.gender === 'male' ? '👦' : '👧'}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{baby.name}</div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{getAge(baby.dateOfBirth)} old</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reminders */}
        <div className="card">
          <div className="card-title">🔔 Upcoming Reminders
            <Link to="/reminders" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, float: 'right' }}>View all →</Link>
          </div>
          {reminders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <p>No reminders set.</p>
            </div>
          ) : (
            reminders.map(rem => (
              <div key={rem._id} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700 }}>{rem.title}</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                  {new Date(rem.reminderTime).toLocaleString()} · {rem.baby?.name}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upcoming Vaccines */}
        <div className="card">
          <div className="card-title">💉 Vaccines Due
            <Link to="/vaccinations" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, float: 'right' }}>View all →</Link>
          </div>
          {upcomingVaccines.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <p>All vaccines up to date!</p>
            </div>
          ) : (
            upcomingVaccines.map(v => (
              <div key={v._id} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700 }}>{v.vaccineName} <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Dose {v.doseNumber}</span></div>
                <div style={{ color: new Date(v.nextDueDate) - new Date() < 1000*60*60*24*7 ? 'var(--danger)' : 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                  Due: {new Date(v.nextDueDate).toLocaleDateString()} · {v.baby?.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="card-title">📋 Recent Activities
          <Link to="/activities" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, float: 'right' }}>View all →</Link>
        </div>
        {activities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No activities logged yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Baby</th>
                  <th>Notes</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(act => (
                  <tr key={act._id}>
                    <td><span className={`badge badge-${act.type}`}>{act.type}</span></td>
                    <td>{act.baby?.name}</td>
                    <td>{act.notes || '-'}</td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      {new Date(act.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
