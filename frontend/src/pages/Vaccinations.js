import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const COMMON_VACCINES = [
  'BCG', 'Hepatitis B', 'OPV (Polio)', 'DTP (Diphtheria, Tetanus, Pertussis)',
  'Hib (Haemophilus influenzae)', 'PCV (Pneumococcal)', 'Rotavirus',
  'MMR (Measles, Mumps, Rubella)', 'Varicella (Chickenpox)', 'Hepatitis A',
  'Typhoid', 'Meningococcal', 'HPV', 'Influenza (Flu)', 'COVID-19', 'Other'
];

const emptyForm = {
  baby: '', vaccineName: '', doseNumber: '1', administeredBy: '',
  clinic: '', batchNumber: '', administeredDate: new Date().toISOString().slice(0, 10),
  nextDueDate: '', sideEffects: '', notes: '', status: 'completed'
};

const Vaccinations = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [babies, setBabies] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState('');
  const [upcoming, setUpcoming] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState('all'); // all | upcoming

  useEffect(() => { fetchBabies(); fetchUpcoming(); }, []);
  useEffect(() => { fetchVaccinations(); }, [selectedBaby]);

  const fetchBabies = async () => {
    const res = await axios.get('/api/babies');
    setBabies(res.data);
    if (res.data.length > 0) {
      setSelectedBaby(res.data[0]._id);
      setForm(f => ({ ...f, baby: res.data[0]._id }));
    }
  };

  const fetchVaccinations = async () => {
    const url = selectedBaby ? `/api/vaccinations?baby=${selectedBaby}` : '/api/vaccinations';
    const res = await axios.get(url);
    setVaccinations(res.data);
  };

  const fetchUpcoming = async () => {
    const res = await axios.get('/api/vaccinations/upcoming');
    setUpcoming(res.data);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...emptyForm, baby: selectedBaby || babies[0]?._id || '' });
    setShowModal(true);
  };

  const openEdit = (v) => {
    setEditItem(v);
    setForm({
      baby: v.baby?._id || v.baby,
      vaccineName: v.vaccineName,
      doseNumber: v.doseNumber,
      administeredBy: v.administeredBy || '',
      clinic: v.clinic || '',
      batchNumber: v.batchNumber || '',
      administeredDate: v.administeredDate?.slice(0, 10) || '',
      nextDueDate: v.nextDueDate?.slice(0, 10) || '',
      sideEffects: v.sideEffects || '',
      notes: v.notes || '',
      status: v.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await axios.put(`/api/vaccinations/${editItem._id}`, form);
        toast.success('Vaccination updated! ✅');
      } else {
        await axios.post('/api/vaccinations', form);
        toast.success('Vaccination recorded! 💉');
      }
      setShowModal(false);
      fetchVaccinations();
      fetchUpcoming();
    } catch (err) {
      toast.error('Error saving vaccination');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vaccination record?')) return;
    await axios.delete(`/api/vaccinations/${id}`);
    toast.info('Record deleted');
    fetchVaccinations();
    fetchUpcoming();
  };

  const statusColor = { completed: 'var(--success)', scheduled: 'var(--secondary)', missed: 'var(--danger)' };
  const statusEmoji = { completed: '✅', scheduled: '📅', missed: '❌' };

  const isDueSoon = (date) => {
    if (!date) return false;
    const diff = new Date(date) - new Date();
    return diff > 0 && diff < 1000 * 60 * 60 * 24 * 7; // within 7 days
  };

  return (
    <div className="main-content">
      <div className="page-title">
        💉 Vaccinations
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={openAdd}>+ Add Vaccination</button>
      </div>

      {/* Upcoming alert */}
      {upcoming.length > 0 && (
        <div style={{ background: '#FFF3CD', border: '1px solid #FFD93D', borderRadius: 16, padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>⚠️ Upcoming Vaccinations Due</div>
          {upcoming.slice(0, 3).map(v => (
            <div key={v._id} style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
              <strong>{v.baby?.name}</strong> — {v.vaccineName} (Dose {v.doseNumber}) due on{' '}
              <span style={{ color: isDueSoon(v.nextDueDate) ? 'var(--danger)' : 'inherit', fontWeight: 700 }}>
                {new Date(v.nextDueDate).toLocaleDateString()}
                {isDueSoon(v.nextDueDate) && ' 🔴 Due Soon!'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'upcoming'].map(tab => (
          <button key={tab} className="btn" onClick={() => setActiveTab(tab)}
            style={{ background: activeTab === tab ? 'var(--primary)' : '#eee', color: activeTab === tab ? 'white' : 'var(--text)', width: 'auto' }}>
            {tab === 'all' ? '📋 All Records' : `⏰ Upcoming (${upcoming.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'all' && (
        <>
          <div className="baby-selector">
            <label style={{ fontWeight: 700 }}>Filter by Baby:</label>
            <select value={selectedBaby} onChange={e => setSelectedBaby(e.target.value)}>
              <option value="">All Babies</option>
              {babies.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>

          <div className="card">
            {vaccinations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💉</div>
                <p>No vaccination records yet. Add the first one!</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Vaccine</th>
                      <th>Baby</th>
                      <th>Dose</th>
                      <th>Given On</th>
                      <th>Next Due</th>
                      <th>Clinic / Doctor</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinations.map(v => (
                      <tr key={v._id}>
                        <td><strong>{v.vaccineName}</strong>
                          {v.sideEffects && <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>⚠️ {v.sideEffects}</div>}
                        </td>
                        <td>{v.baby?.name}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 8, padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem' }}>
                            Dose {v.doseNumber}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{new Date(v.administeredDate).toLocaleDateString()}</td>
                        <td style={{ fontSize: '0.85rem' }}>
                          {v.nextDueDate ? (
                            <span style={{ color: isDueSoon(v.nextDueDate) ? 'var(--danger)' : 'inherit', fontWeight: isDueSoon(v.nextDueDate) ? 700 : 400 }}>
                              {new Date(v.nextDueDate).toLocaleDateString()}
                              {isDueSoon(v.nextDueDate) && ' 🔴'}
                            </span>
                          ) : '—'}
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          {v.clinic && <div>{v.clinic}</div>}
                          {v.administeredBy && <div style={{ color: 'var(--text-light)' }}>Dr. {v.administeredBy}</div>}
                        </td>
                        <td>
                          <span style={{ color: statusColor[v.status], fontWeight: 700, fontSize: '0.85rem' }}>
                            {statusEmoji[v.status]} {v.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(v)}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v._id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'upcoming' && (
        <div className="card">
          <div className="card-title">⏰ Upcoming / Scheduled Vaccinations</div>
          {upcoming.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <p>No upcoming vaccinations! All up to date.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Vaccine</th>
                    <th>Baby</th>
                    <th>Dose</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map(v => (
                    <tr key={v._id}>
                      <td><strong>{v.vaccineName}</strong></td>
                      <td>{v.baby?.name}</td>
                      <td>Dose {v.doseNumber}</td>
                      <td style={{ color: isDueSoon(v.nextDueDate) ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                        {new Date(v.nextDueDate).toLocaleDateString()}
                        {isDueSoon(v.nextDueDate) && ' 🔴 Due Soon!'}
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(v)}>✏️ Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editItem ? '✏️ Edit Vaccination' : '💉 Add Vaccination'}</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Baby</label>
                <select value={form.baby} onChange={e => setForm({ ...form, baby: e.target.value })} required>
                  {babies.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Vaccine Name</label>
                <select value={form.vaccineName} onChange={e => setForm({ ...form, vaccineName: e.target.value })} required>
                  <option value="">-- Select Vaccine --</option>
                  {COMMON_VACCINES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {form.vaccineName === 'Other' && (
                <div className="form-group">
                  <label>Custom Vaccine Name</label>
                  <input type="text" placeholder="Enter vaccine name" onChange={e => setForm({ ...form, vaccineName: e.target.value })} required />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Dose Number</label>
                  <select value={form.doseNumber} onChange={e => setForm({ ...form, doseNumber: e.target.value })}>
                    {['1', '2', '3', '4', 'Booster', 'Annual'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="completed">✅ Completed</option>
                    <option value="scheduled">📅 Scheduled</option>
                    <option value="missed">❌ Missed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Date Administered</label>
                  <input type="date" value={form.administeredDate} onChange={e => setForm({ ...form, administeredDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Next Due Date</label>
                  <input type="date" value={form.nextDueDate} onChange={e => setForm({ ...form, nextDueDate: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Clinic / Hospital</label>
                <input type="text" value={form.clinic} onChange={e => setForm({ ...form, clinic: e.target.value })} placeholder="e.g., City Children's Hospital" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Administered By (Doctor)</label>
                  <input type="text" value={form.administeredBy} onChange={e => setForm({ ...form, administeredBy: e.target.value })} placeholder="Doctor name" />
                </div>
                <div className="form-group">
                  <label>Batch Number</label>
                  <input type="text" value={form.batchNumber} onChange={e => setForm({ ...form, batchNumber: e.target.value })} placeholder="Optional" />
                </div>
              </div>

              <div className="form-group">
                <label>Side Effects Observed</label>
                <input type="text" value={form.sideEffects} onChange={e => setForm({ ...form, sideEffects: e.target.value })} placeholder="e.g., mild fever, redness" />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Any additional notes..." />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editItem ? 'Update Record' : 'Save Vaccination'}
                </button>
                <button type="button" className="btn" style={{ background: '#eee', flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaccinations;
