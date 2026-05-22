const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { protect } = require('../middleware/auth');

// GET all reminders for user
router.get('/', protect, async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.baby) filter.baby = req.query.baby;
    const reminders = await Reminder.find(filter)
      .populate('baby', 'name')
      .sort({ reminderTime: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create reminder
router.post('/', protect, async (req, res) => {
  try {
    const reminder = await Reminder.create({ ...req.body, user: req.user._id });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update/toggle reminder
router.put('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE reminder
router.delete('/:id', protect, async (req, res) => {
  try {
    await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
