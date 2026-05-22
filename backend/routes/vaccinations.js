const express = require('express');
const router = express.Router();
const Vaccination = require('../models/Vaccination');
const { protect } = require('../middleware/auth');

// GET all vaccinations (filter by baby)
router.get('/', protect, async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.baby) filter.baby = req.query.baby;
    const vaccinations = await Vaccination.find(filter)
      .populate('baby', 'name')
      .sort({ administeredDate: -1 });
    res.json(vaccinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET upcoming/due vaccinations
router.get('/upcoming', protect, async (req, res) => {
  try {
    const vaccinations = await Vaccination.find({
      user: req.user._id,
      nextDueDate: { $gte: new Date() },
      status: { $ne: 'missed' }
    }).populate('baby', 'name').sort({ nextDueDate: 1 });
    res.json(vaccinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add vaccination
router.post('/', protect, async (req, res) => {
  try {
    const vaccination = await Vaccination.create({ ...req.body, user: req.user._id });
    res.status(201).json(vaccination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update vaccination
router.put('/:id', protect, async (req, res) => {
  try {
    const vaccination = await Vaccination.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!vaccination) return res.status(404).json({ message: 'Vaccination not found' });
    res.json(vaccination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE vaccination
router.delete('/:id', protect, async (req, res) => {
  try {
    await Vaccination.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Vaccination record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
