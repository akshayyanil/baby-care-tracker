const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  baby: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vaccineName: { type: String, required: true },
  doseNumber: { type: String, default: '1' }, // e.g. 1, 2, 3, Booster
  administeredBy: { type: String, default: '' }, // doctor/nurse name
  clinic: { type: String, default: '' },
  batchNumber: { type: String, default: '' },
  administeredDate: { type: Date, required: true },
  nextDueDate: { type: Date },
  sideEffects: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'scheduled', 'missed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vaccination', VaccinationSchema);
