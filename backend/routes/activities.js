const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

// GET all activities (optionally filter by baby)
router.get('/', protect, async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.baby) filter.baby = req.query.baby;
    if (req.query.type) filter.type = req.query.type;

    const activities = await Activity.find(filter)
      .populate('baby', 'name')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create activity
router.post('/', protect, async (req, res) => {
  try {
    const activity = await Activity.create({ ...req.body, user: req.user._id });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE activity
router.delete('/:id', protect, async (req, res) => {
  try {
    await Activity.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET activity stats for a baby
router.get('/stats/:babyId', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Activity.aggregate([
      { $match: { baby: require('mongoose').Types.ObjectId.createFromHexString(req.params.babyId), user: require('mongoose').Types.ObjectId.createFromHexString(req.user._id.toString()) } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
