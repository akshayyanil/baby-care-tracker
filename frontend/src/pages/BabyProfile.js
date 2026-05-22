import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BabyProfile = () => {
  const [babies, setBabies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editBaby, setEditBaby] = useState(null);
  const [form, setForm] = useState({ name: '', dateOfBirth: '', gender: 'male', bloodGroup: '', allergies: '', notes: '' });

  useEffect(() => { fetchBabies(); }, []);

  const fetchBabies = async () => {
    const res = await axios.get('/api/babies');
    setBabies(res.data);
  };

  const getAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    if (months < 1) return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days old`;
    if (months < 24) return `${months} months old`;
    return `${Math.floor(months / 12)} years old`;
  };

  const openAdd = () => {
    setEditBaby(null);
    setForm({ name: '', dateOfBirth: '', gender: 'male', bloodGroup: '', allergies: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (baby) => {
    setEditBaby(baby);
    setForm({
      name: baby.name,
      dateOfBirth: baby.dateOfBirth.split('T')[0],
      gender: baby.gender,
      bloodGroup: baby.bloodGroup || '',
      allergies: baby.allergies || '',
      notes: baby.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBaby) {
        await axios.put(`/api/babies/${editBaby._id}`, form);
        toast.success('Baby profile updated!');
      } else {
        await axios.post('/api/babies', form);
        toast.success('Baby added! 🎉');
      }
      setShowModal(false);
      fetchBabies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving baby');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this baby profile?')) return;
    await axios.delete(`/api/babies/${id}`);
    toast.info('Baby profile removed');
    fetchBabies();
  };

  return (
    <div className="main-content">
      <div className="page-title">
        👶 Baby Profiles
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={openAdd}>+ Add Baby</button>
      </div>

      {babies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👶</div>
          <p>No babies added yet. Add your first baby!</p>
        </div>
      ) : (
        <div className="babies-grid">
          {babies.map(baby => (
            <div key={baby._id} className="baby-card">
              <div className="baby-avatar">{baby.gender === 'male' ? '👦' : '👧'}</div>
              <div className="baby-name">{baby.name}</div>
              <div className="baby-info">{getAge(baby.dateOfBirth)}</div>
              <div className="baby-info">DOB: {new Date(baby.dateOfBirth).toLocaleDateString()}</div>
              {baby.bloodGroup && <div className="baby-info">Blood: {baby.bloodGroup}</div>}
              {baby.allergies && <div className="baby-info" style={{ color: 'var(--danger)' }}>⚠️ {baby.allergies}</div>}
              {baby.notes && <div className="baby-info" style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{baby.notes}</div>}
              <div className="baby-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(baby)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(baby._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editBaby ? '✏️ Edit Baby' : '➕ Add Baby'}</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Baby's Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                  <option value="">Unknown</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Allergies</label>
                <input type="text" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="e.g., peanuts, dairy" />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editBaby ? 'Update' : 'Add Baby'}
                </button>
                <button type="button" className="btn" style={{ background: '#eee', flex: 1 }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BabyProfile;
