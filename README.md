#  IT Prep Hub — Interview Preparation Platform

> A web app where IT students can practice interview questions 
> topic-wise with custom timer, difficulty filter, leaderboard and level system.

---

##  About This Project

I built this project as part of my MCA curriculum to strengthen my 
full-stack development skills. The idea came from the fact that most 
interview prep platforms are either too expensive or don't cover all 
IT topics in one place.

**IT Prep Hub solves this by providing:**
- Free topic-wise quiz practice
- Custom quiz settings (questions count + timer + difficulty)
- Weekly competition with leaderboard
- Level up system with rewards

---

##  What Can a User Do?

**Step 1 — Register/Login**
- User creates an account with name, email and password
- Password is encrypted using Bcrypt before storing in database
- After login, a JWT token is generated for secure access

**Step 2 — Choose a Topic**
- User sees all available topics like DSA, DBMS, OS, React, Node.js etc
- Topics are filtered by category (Frontend, Backend, CS Fundamentals etc)

**Step 3 — Customize the Quiz**
- How many questions? (5, 10, 20, 30 or 50)
- What difficulty? (Easy, Medium, Hard or Mixed)
- How much time per question? (15s, 30s, 1min, 2min or No Timer)

**Step 4 — Attempt the Quiz**
- Questions appear one by one with 4 options
- Timer counts down per question
- After answering, explanation is shown
- Score is tracked in real time

**Step 5 — See Result**
- Score, percentage and grade shown
- Grades: Excellent / Good Job / Average / Keep Practicing

**Step 6 — Check Leaderboard**
- Weekly leaderboard shows top performers
- Top 5 users every week LEVEL UP
- Weekly points reset every Sunday

**Step 7 — View Profile**
- Total points, weekly points, current level
- Level progress bar
- All rewards earned
- Complete quiz history

---

##  Level System

| Level | Name | How to Achieve |
|---|---|---|
| 1 | 🌱 Beginner | Starting level |
| 2 | 🧭 Explorer | Top 5 in Week 1 |
| 3 | ⚔️ Challenger | Top 5 in Week 2 |
| 4 | 🎯 Expert | Top 5 in Week 3 |
| 5 | 🧠 Master | Top 5 in Week 4 |
| 6 | 👑 Elite | Top 5 in Week 5 |
| 7 | 🏆 Legend | Top 5 in Week 6 |

### Rewards on Level Up
- Level 2 → Explorer Badge + 100 Bonus Points
- Level 3 → Challenger Badge + 200 Bonus Points
- Level 4 → Expert Badge + Special Topics Unlocked
- Level 5 → Master Badge + Mock Interview Questions
- Level 6 → Elite Badge + Resume Tips
- Level 7 → Legend Badge + Certificate

---

## Tech Stack Used

### Frontend
- **HTML5** — Page structure
- **CSS3** — Styling with dark theme
- **JavaScript (Vanilla)** — Quiz logic, timer, API calls

### Backend
- **Node.js** — Server runtime
- **Express.js** — REST API framework
- **JWT** — Secure authentication tokens
- **Bcrypt** — Password encryption

### Database
- **MySQL** — Relational database
- **8 Tables** — users, topics, questions, options, results, weekly_leaderboard, rewards

*Deployment*
- **Railway** — Backend + MySQL database hosting
- **GitHub** — Version control

---

## Points System

Action | Points Earned |
Each correct answer | +10 points |
Completing a quiz | +20 points |
Getting 100% accuracy | +50 bonus points |
Answering in under 10 seconds | +5 per question |

---

## Database Design
users
└── id, name, email, password, points, level, badge, weekly_points
topics
└── id, name, category, icon
questions
└── id, topic_id, question_text, explanation, difficulty, language
options
└── id, question_id, option_text, is_correct
results
└── id, user_id, topic_id, score, total_questions, time_taken
weekly_leaderboard
└── id, user_id, week_start, week_end, weekly_points, rank_position
rewards
└── id, user_id, reward_type, reward_description, achieved_at

---

## 📂 Project Structure
IT-Prep-Hub/
│
├── backend/                  ← Node.js server
│   ├── database/
│   │   └── db.js             ← MySQL connection setup
│   ├── routes/
│   │   ├── auth.js           ← Register & Login APIs
│   │   ├── questions.js      ← Topics & Questions APIs
│   │   └── results.js        ← Results, Leaderboard & Profile APIs
│   ├── server.js             ← Main Express server
│   ├── .env                  ← Environment variables (secret)
│   └── package.json          ← Dependencies list
│
└── frontend/                 ← HTML/CSS/JS pages
├── index.html            ← Home/Landing page
├── register.html         ← Registration page
├── login.html            ← Login page
├── topics.html           ← Topic selection + Quiz settings
├── quiz.html             ← Quiz attempt page
├── result.html           ← Result display page
├── leaderboard.html      ← Weekly leaderboard
├── profile.html          ← User profile + history
└── style.css             ← Complete styling

---

## 🔗 API Endpoints

| Method | Endpoint | What it does |
|---|---|---|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login and get JWT token |
| GET | /questions/topics | Get all topics |
| GET | /questions/:topicId | Get questions by topic |
| POST | /questions/add | Add new question |
| POST | /results/save | Save quiz result |
| GET | /results/leaderboard | Get weekly leaderboard |
| GET | /results/profile/:id | Get user profile |
| GET | /results/history/:id | Get quiz history |

---

## ⚙️ How to Run This Project Locally

**Step 1 — Clone the repo**
```bash
git clone https://github.com/skp051205/IT-PREP-HUB.git
cd IT-PREP-HUB
```

**Step 2 — Install backend dependencies**
```bash
cd backend
npm install
```

**Step 3 — Create .env file inside backend folder**
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=itprephub
JWT_SECRET=itprephub_secret_2024

**Step 4 — Create MySQL database**
```sql
CREATE DATABASE itprephub;
```

**Step 5 — Start the server**
```bash
node server.js
```
You should see:
Server running on port 5000
MySQL Connected!

**Step 6 — Open frontend**
- Open 'frontend/index.html' with Live Server in VS Code

---

## Live Backend

Backend is deployed on Railway:
https://it-prep-hub-production.up.railway.app

---

## Built By

**Saurav Kumar Prasad**
MCA Student | Full Stack Developer
GitHub: [@skp051205](https://github.com/skp051205)

---

## License
MIT License — Free to use and modify
