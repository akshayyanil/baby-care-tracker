# 🍼 Baby Care Tracker — MERN Stack

A full-stack Baby Care Tracking application built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
baby-care-tracker/
├── backend/
│   ├── models/         → MongoDB schemas (User, Baby, Activity, Growth, Reminder)
│   ├── routes/         → API endpoints
│   ├── middleware/      → JWT auth middleware
│   ├── server.js       → Express server entry point
│   ├── .env            → Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/    → AuthContext (login state)
    │   ├── pages/      → Dashboard, BabyProfile, Activities, GrowthTracker, Reminders
    │   ├── components/ → Navbar
    │   ├── App.js      → Routes
    │   └── App.css     → Global styles
    └── package.json
```

---

## ⚙️ Prerequisites

- Node.js (v16+)
- MongoDB running locally on port 27017
- npm

---

## 🚀 Setup & Run

### 1. Start MongoDB
Make sure MongoDB is running locally:
```bash
# On Linux/Mac:
mongod

# On Windows (if installed as service):
net start MongoDB
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev        # runs with nodemon (auto-restart)
# OR
npm start          # production
```
Backend runs at: **http://localhost:5000**

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at: **http://localhost:3000**

---

## 🔑 Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/baby-care-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

---

## 📋 Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT-based secure login & registration |
| 👶 Baby Profiles | Add multiple babies with DOB, gender, blood group, allergies |
| 📋 Activity Tracking | Log feeding, sleep, diaper, medicine, vaccine, bath, play |
| 📈 Growth Tracking | Track weight, height, head circumference with line charts |
| 🔔 Reminders | Set reminders with cron-based automated notifications |
| 📊 Dashboard | Summary stats and recent activity overview |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Babies
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/babies | Get all babies |
| POST | /api/babies | Add baby |
| PUT | /api/babies/:id | Update baby |
| DELETE | /api/babies/:id | Delete baby |

### Activities
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/activities | Get activities (filter: ?baby=id&type=feeding) |
| POST | /api/activities | Log activity |
| DELETE | /api/activities/:id | Delete activity |
| GET | /api/activities/stats/:babyId | Get activity stats |

### Growth
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/growth/:babyId | Get growth records |
| POST | /api/growth | Add record |
| DELETE | /api/growth/:id | Delete record |

### Reminders
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/reminders | Get all reminders |
| POST | /api/reminders | Create reminder |
| PUT | /api/reminders/:id | Update/toggle reminder |
| DELETE | /api/reminders/:id | Delete reminder |

---

## 🛠 Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Chart.js, React Toastify
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, node-cron
- **Database**: MongoDB (local)
