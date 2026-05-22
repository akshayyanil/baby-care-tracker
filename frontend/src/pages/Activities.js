import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ACTIVITY_TYPES = ['feeding', 'sleep', 'diaper', 'medicine', 'vaccine', 'bath', 'play', 'other'];

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [babies, setBabies] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    baby: '', type: 'feeding', notes: '', timestamp: new Date().toISOString().slice(0, 16),
    feedingType: '', feedingAmount: '', feedingDuration: '',
    sleepStart: '', sleepEnd: '',
    diaperType: '',
    medicineName: '', medicineDose: ''
  });

  useEffect(() => {
    fetchBabies();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [selectedBaby]);

  const fetchBabies = async () => {
    const res = await axios.get('/api/babies');
    setBabies(res.data);
    if (res.data.length > 0) {
      setSelectedBaby(res.data[0]._id);
      setForm(f => ({ ...f, baby: res.data[0]._id }));
    }
  };

  const fetchActivities = async () => {
    const url = selectedBaby ? `/api/activities?baby=${selectedBaby}` : '/api/activities';
    const res = await axios.get(url);
    setActivities(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/activities', form);
      toast.success('Activity logged! ✅');
      setShowModal(false);
      fetchActivities();
    } catch (err) {
      toast.error('Error logging activity');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/activities/${id}`);
    toast.info('Activity deleted');
    fetchActivities();
  };

  const openModal = () => {
    setForm({
      baby: selectedBaby || (babies[0]?._id || ''),
      type: 'feeding', notes: '',
      timestamp: new Date().toISOString().slice(0, 16),
      feedingType: 'breast', feedingAmount: '', feedingDuration: '',
      sleepStart: '', sleepEnd: '',
      diaperType: 'wet',
      medicineName: '', medicineDose: ''
    });
    setShowModal(true);
  };

  return (
    <div className="main-content">
      <div className="page-title">
        📋 Activities
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={openModal}>+ Log Activity</button>
      </div>

      <div className="baby-selector">
        <label style={{ fontWeight: 700 }}>Filter by Baby:</label>
        <select value={selectedBaby} onChange={e => setSelectedBaby(e.target.value)}>
          <option value="">All Babies</option>
          {babies.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      <div className="card">
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
                  <th>Details</th>
                  <th>Notes</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(act => (
                  <tr key={act._id}>
                    <td><span className={`badge badge-${act.type}`}>{act.type}</span></td>
                    <td>{act.baby?.name}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {act.type === 'feeding' && act.feedingType && `${act.feedingType}${act.feedingAmount ? ` · ${act.feedingAmount}ml` : ''}`}
                      {act.type === 'sleep' && act.sleepDuration > 0 && `${act.sleepDuration} min`}
                      {act.type === 'diaper' && act.diaperType}
                      {act.type === 'medicine' && act.medicineName}
                    </td>
                    <td>{act.notes || '-'}</td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>
                      {new Date(act.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(act._id)}>🗑️</button>
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
            <div className="modal-title">➕ Log Activity</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Baby</label>
                <select value={form.baby} onChange={e => setForm({ ...form, baby: e.target.value })} required>
                  {babies.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Activity Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>

              {form.type === 'feeding' && (
                <>
                  <div className="form-group">
                    <label>Feeding Type</label>
                    <select value={form.feedingType} onChange={e => setForm({ ...form, feedingType: e.target.value })}>
                      <option value="breast">Breast</option>
                      <option value="bottle">Bottle</option>
                      <option value="solid">Solid Food</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Amount (ml)</label>
                    <input type="number" value={form.feedingAmount} onChange={e => setForm({ ...form, feedingAmount: e.target.value })} placeholder="Optional" />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input type="number" value={form.feedingDuration} onChange={e => setForm({ ...form, feedingDuration: e.target.value })} placeholder="Optional" />
                  </div>
                </>
              )}

              {form.type === 'sleep' && (
                <>
                  <div className="form-group">
                    <label>Sleep Start</label>
                    <input type="datetime-local" value={form.sleepStart} onChange={e => setForm({ ...form, sleepStart: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Sleep End</label>
                    <input type="datetime-local" value={form.sleepEnd} onChange={e => setForm({ ...form, sleepEnd: e.target.value })} />
                  </div>
                </>
              )}

              {form.type === 'diaper' && (
                <div className="form-group">
                  <label>Diaper Type</label>
                  <select value={form.diaperType} onChange={e => setForm({ ...form, diaperType: e.target.value })}>
                    <option value="wet">Wet</option>
                    <option value="dirty">Dirty</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              )}

              {form.type === 'medicine' && (
                <>
                  <div className="form-group">
                    <label>Medicine Name</label>
                    <input type="text" value={form.medicineName} onChange={e => setForm({ ...form, medicineName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Dose</label>
                    <input type="text" value={form.medicineDose} onChange={e => setForm({ ...form, medicineDose: e.target.value })} placeholder="e.g., 5ml" />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Timestamp</label>
                <input type="datetime-local" value={form.timestamp} onChange={e => setForm({ ...form, timestamp: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional notes..." />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Log Activity</button>
                <button type="button" className="btn" style={{ background: '#eee', flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
