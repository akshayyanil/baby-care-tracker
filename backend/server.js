const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/babies', require('./routes/babies'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/growth', require('./routes/growth'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/vaccinations', require('./routes/vaccinations'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Baby Care Tracker API Running 🍼' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Cron job - check reminders every minute
cron.schedule('* * * * *', async () => {
  const Reminder = require('./models/Reminder');
  const now = new Date();
  const reminders = await Reminder.find({
    reminderTime: { $lte: now },
    isActive: true,
    notified: false
  });
  reminders.forEach(async (r) => {
    console.log(`🔔 Reminder: ${r.title} for baby at ${r.reminderTime}`);
    r.notified = true;
    await r.save();
  });
});
