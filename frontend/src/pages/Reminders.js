import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [babies, setBabies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    baby: '', title: '', description: '', type: 'other',
    reminderTime: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [b, r] = await Promise.all([axios.get('/api/babies'), axios.get('/api/reminders')]);
    setBabies(b.data);
    setReminders(r.data);
    if (b.data.length > 0) setForm(f => ({ ...f, baby: b.data[0]._id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reminders', form);
      toast.success('Reminder set! 🔔');
      setShowModal(false);
      fetchAll();
    } catch (err) {
      toast.error('Error saving reminder');
    }
  };

  const toggleReminder = async (rem) => {
    await axios.put(`/api/reminders/${rem._id}`, { isActive: !rem.isActive });
    fetchAll();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/reminders/${id}`);
    toast.info('Reminder deleted');
    fetchAll();
  };

  const isPast = (time) => new Date(time) < new Date();

  return (
    <div className="main-content">
      <div className="page-title">
        🔔 Reminders
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => {
          setForm({ baby: babies[0]?._id || '', title: '', description: '', type: 'other', reminderTime: new Date().toISOString().slice(0, 16) });
          setShowModal(true);
        }}>+ Add Reminder</button>
      </div>

      <div className="card">
        {reminders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <p>No reminders set yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Baby</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map(rem => (
                  <tr key={rem._id} style={{ opacity: !rem.isActive ? 0.5 : 1 }}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{rem.title}</div>
                      {rem.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{rem.description}</div>}
                    </td>
                    <td>{rem.baby?.name}</td>
                    <td><span className={`badge badge-${rem.type}`}>{rem.type}</span></td>
                    <td style={{ color: isPast(rem.reminderTime) ? 'var(--danger)' : 'var(--success)', fontSize: '0.85rem' }}>
                      {new Date(rem.reminderTime).toLocaleString()}
                      {isPast(rem.reminderTime) && ' ⚠️'}
                    </td>
                    <td>
                      <span style={{ color: rem.isActive ? 'var(--success)' : 'var(--text-light)', fontWeight: 700 }}>
                        {rem.isActive ? '✅ Active' : '⏸ Paused'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => toggleReminder(rem)}>
                          {rem.isActive ? '⏸' : '▶️'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rem._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🔔 Set Reminder</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Baby</label>
                <select value={form.baby} onChange={e => setForm({ ...form, baby: e.target.value })} required>
                  {babies.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g., Give medicine" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Optional details..." />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {['feeding', 'medicine', 'vaccine', 'appointment', 'other'].map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Reminder Time</label>
                <input type="datetime-local" value={form.reminderTime} onChange={e => setForm({ ...form, reminderTime: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Set Reminder</button>
                <button type="button" className="btn" style={{ background: '#eee', flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
