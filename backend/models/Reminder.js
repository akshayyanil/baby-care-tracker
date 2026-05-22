const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  baby: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: {
    type: String,
    enum: ['feeding', 'medicine', 'vaccine', 'appointment', 'other'],
    default: 'other'
  },
  reminderTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
