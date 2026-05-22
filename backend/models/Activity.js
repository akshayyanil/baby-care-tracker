const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  baby: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['feeding', 'sleep', 'diaper', 'medicine', 'vaccine', 'bath', 'play', 'other'],
    required: true
  },
  // Feeding details
  feedingType: { type: String, enum: ['breast', 'bottle', 'solid', ''], default: '' },
  feedingAmount: { type: Number, default: 0 }, // ml
  feedingDuration: { type: Number, default: 0 }, // minutes

  // Sleep details
  sleepStart: { type: Date },
  sleepEnd: { type: Date },
  sleepDuration: { type: Number, default: 0 }, // minutes

  // Diaper details
  diaperType: { type: String, enum: ['wet', 'dirty', 'both', ''], default: '' },

  // Medicine details
  medicineName: { type: String, default: '' },
  medicineDose: { type: String, default: '' },

  notes: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
