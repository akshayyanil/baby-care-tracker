import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GrowthTracker = () => {
  const [babies, setBabies] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState('');
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ baby: '', weight: '', height: '', headCircumference: '', notes: '', recordedAt: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    axios.get('/api/babies').then(res => {
      setBabies(res.data);
      if (res.data.length > 0) setSelectedBaby(res.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (selectedBaby) fetchGrowth();
  }, [selectedBaby]);

  const fetchGrowth = async () => {
    const res = await axios.get(`/api/growth/${selectedBaby}`);
    setRecords(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/growth', { ...form, baby: selectedBaby });
      toast.success('Growth record added! 📈');
      setShowModal(false);
      fetchGrowth();
    } catch (err) {
      toast.error('Error saving record');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/growth/${id}`);
    toast.info('Record deleted');
    fetchGrowth();
  };

  const chartLabels = records.map(r => new Date(r.recordedAt).toLocaleDateString());

  const weightChart = {
    labels: chartLabels,
    datasets: [{
      label: 'Weight (kg)',
      data: records.map(r => r.weight),
      borderColor: '#FF6B9D',
      backgroundColor: '#FF6B9D33',
      tension: 0.4,
      fill: true
    }]
  };

  const heightChart = {
    labels: chartLabels,
    datasets: [{
      label: 'Height (cm)',
      data: records.map(r => r.height),
      borderColor: '#6C63FF',
      backgroundColor: '#6C63FF33',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = { responsive: true, plugins: { legend: { position: 'top' } } };

  return (
    <div className="main-content">
      <div className="page-title">
        📈 Growth Tracker
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => {
          setForm({ baby: selectedBaby, weight: '', height: '', headCircumference: '', notes: '', recordedAt: new Date().toISOString().slice(0, 10) });
          setShowModal(true);
        }}>+ Add Record</button>
      </div>

      <div className="baby-selector">
        <label style={{ fontWeight: 700 }}>Select Baby:</label>
        <select value={selectedBaby} onChange={e => setSelectedBaby(e.target.value)}>
          {babies.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      {records.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="card">
            <div className="card-title">⚖️ Weight (kg)</div>
            <Line data={weightChart} options={chartOptions} />
          </div>
          <div className="card">
            <div className="card-title">📏 Height (cm)</div>
            <Line data={heightChart} options={chartOptions} />
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">📊 Growth Records</div>
        {records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <p>No growth records yet. Add the first one!</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Height (cm)</th>
                  <th>Head (cm)</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[...records].reverse().map(r => (
                  <tr key={r._id}>
                    <td>{new Date(r.recordedAt).toLocaleDateString()}</td>
                    <td><strong>{r.weight}</strong></td>
                    <td><strong>{r.height}</strong></td>
                    <td>{r.headCircumference || '-'}</td>
                    <td>{r.notes || '-'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>🗑️</button>
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
            <div className="modal-title">➕ Add Growth Record</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.recordedAt} onChange={e => setForm({ ...form, recordedAt: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" step="0.01" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required placeholder="e.g., 5.2" />
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" step="0.1" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} required placeholder="e.g., 60.5" />
              </div>
              <div className="form-group">
                <label>Head Circumference (cm)</label>
                <input type="number" step="0.1" value={form.headCircumference} onChange={e => setForm({ ...form, headCircumference: e.target.value })} placeholder="Optional" />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional..." />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Record</button>
                <button type="button" className="btn" style={{ background: '#eee', flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthTracker;
