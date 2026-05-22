const express = require('express');
const router = express.Router();
const Growth = require('../models/Growth');
const { protect } = require('../middleware/auth');

// GET all growth records for a baby
router.get('/:babyId', protect, async (req, res) => {
  try {
    const records = await Growth.find({ baby: req.params.babyId, user: req.user._id })
      .sort({ recordedAt: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add growth record
router.post('/', protect, async (req, res) => {
  try {
    const record = await Growth.create({ ...req.body, user: req.user._id });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE growth record
router.delete('/:id', protect, async (req, res) => {
  try {
    await Growth.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
