const mongoose = require('mongoose');

const GrowthSchema = new mongoose.Schema({
  baby: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true }, // kg
  height: { type: Number, required: true }, // cm
  headCircumference: { type: Number, default: 0 }, // cm
  notes: { type: String, default: '' },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Growth', GrowthSchema);
