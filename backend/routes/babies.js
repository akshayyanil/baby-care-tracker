const express = require('express');
const router = express.Router();
const Baby = require('../models/Baby');
const { protect } = require('../middleware/auth');

// GET all babies for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const babies = await Baby.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(babies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single baby
router.get('/:id', protect, async (req, res) => {
  try {
    const baby = await Baby.findOne({ _id: req.params.id, user: req.user._id });
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    res.json(baby);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create baby
router.post('/', protect, async (req, res) => {
  try {
    const baby = await Baby.create({ ...req.body, user: req.user._id });
    res.status(201).json(baby);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update baby
router.put('/:id', protect, async (req, res) => {
  try {
    const baby = await Baby.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    res.json(baby);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE baby
router.delete('/:id', protect, async (req, res) => {
  try {
    const baby = await Baby.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    res.json({ message: 'Baby deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
