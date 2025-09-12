# Savings Module Prototype

## Overview

This MERN stack prototype implements a savings flow for parents with analytics dashboard. Features include registration, goal creation, deposits/withdrawals, ledger, and admin dashboard with charts (using Recharts), funnel, trends, top savers, and nudge list.

## How to Run

### Backend:

- `cd backend`
- `npm install`
- Create `.env` with `MONGO_URI=mongodb://localhost:27017/savingsdb` and `JWT_SECRET=secret`
- Start MongoDB locally.
- `npm run dev`

### Frontend:

- `cd frontend`
- `npm install`
- `npm start`

Access at http://localhost:3000. Login as admin (register with role 'admin') to see dashboard.

## Sample Dataset

Seed data via backend (add to index.js for dev). This populates the database with sample users, goals, and transactions (events). Events are tracked via the Transaction model, simulating real user interactions like registrations (as 'registration' events), goal creations, deposits, and withdrawals.

### DB Seed Script (MongoDB)

Add this to your backend's `index.js` after `connectDB()` and call `seedData()` once for initialization. It creates:

- 10 users (including admin).
- 7 goals linked to users.
- 10 registration events, 7 goal creation events, 5 deposit events, 2 withdrawal events.

```javascript
// Example seed in index.js after connectDB
const seedData = async () => {
  try {
    // Clear existing data (optional for dev)
    await User.deleteMany({});
    await Goal.deleteMany({});
    await Transaction.deleteMany({});

    // Create 10 sample users (parents + admin)
    const users = await User.insertMany([
      { name: 'Admin', email: 'admin@test.com', password: 'password', role: 'admin' }, // Hashed in model
      { name: 'Parent A', email: 'parenta@test.com', password: 'password', role: 'parent' },
      { name: 'Parent B', email: 'parentb@test.com', password: 'password', role: 'parent' },
      { name: 'Parent C', email: 'parentc@test.com', password: 'password', role: 'parent' },
      { name: 'Parent D', email: 'parentd@test.com', password: 'password', role: 'parent' },
      { name: 'Parent E', email: 'parente@test.com', password: 'password', role: 'parent' },
      { name: 'Parent F', email: 'parentf@test.com', password: 'password', role: 'parent' },
      { name: 'Parent G', email: 'parentg@test.com', password: 'password', role: 'parent' },
      { name: 'Parent H', email: 'parenth@test.com', password: 'password', role: 'parent' },
      { name: 'Parent I', email: 'parenti@test.com', password: 'password', role: 'parent' }
    ]);

    // Create 7 sample goals
    const goals = await Goal.insertMany([
      { userId: users[1]._id, name: 'College Fund', targetAmount: 5000, currentAmount: 0 },
      { userId: users[2]._id, name: 'Vacation Savings', targetAmount: 2000, currentAmount: 0 },
      { userId: users[3]._id, name: 'Emergency Fund', targetAmount: 1000, currentAmount: 0 },
      { userId: users[4]._id, name: 'Toy Fund', targetAmount: 500, currentAmount: 0 },
      { userId: users[5]._id, name: 'Education', targetAmount: 3000, currentAmount: 0 },
      { userId: users[6]._id, name: 'Car Savings', targetAmount: 4000, currentAmount: 0 },
      { userId: users[7]._id, name: 'Home Improvements', targetAmount: 1500, currentAmount: 0 }
    ]);

    // Create sample transactions (events): 10 registrations, 7 goals, 5 deposits, 2 withdrawals
    // Assuming Transaction model has fields: type, userId, goalId (optional), amount, status, date
    const transactions = await Transaction.insertMany([
      // 10 Registration events (one per user, including admin)
      { type: 'registration', userId: users[0]._id, amount: 0, status: 'completed', date: new Date('2025-08-01') },
      { type: 'registration', userId: users[1]._id, amount: 0, status: 'completed', date: new Date('2025-08-02') },
      { type: 'registration', userId: users[2]._id, amount: 0, status: 'completed', date: new Date('2025-08-03') },
      { type: 'registration', userId: users[3]._id, amount: 0, status: 'completed', date: new Date('2025-08-04') },
      { type: 'registration', userId: users[4]._id, amount: 0, status: 'completed', date: new Date('2025-08-05') },
      { type: 'registration', userId: users[5]._id, amount: 0, status: 'completed', date: new Date('2025-08-06') },
      { type: 'registration', userId: users[6]._id, amount: 0, status: 'completed', date: new Date('2025-08-07') },
      { type: 'registration', userId: users[7]._id, amount: 0, status: 'completed', date: new Date('2025-08-08') },
      { type: 'registration', userId: users[8]._id, amount: 0, status: 'completed', date: new Date('2025-08-09') },
      { type: 'registration', userId: users[9]._id, amount: 0, status: 'completed', date: new Date('2025-08-10') },
      // 7 Goal creation events
      { type: 'goal_created', userId: users[1]._id, goalId: goals[0]._id, amount: 0, status: 'completed', date: new Date('2025-08-11') },
      { type: 'goal_created', userId: users[2]._id, goalId: goals[1]._id, amount: 0, status: 'completed', date: new Date('2025-08-12') },
      { type: 'goal_created', userId: users[3]._id, goalId: goals[2]._id, amount: 0, status: 'completed', date: new Date('2025-08-13') },
      { type: 'goal_created', userId: users[4]._id, goalId: goals[3]._id, amount: 0, status: 'completed', date: new Date('2025-08-14') },
      { type: 'goal_created', userId: users[5]._id, goalId: goals[4]._id, amount: 0, status: 'completed', date: new Date('2025-08-15') },
      { type: 'goal_created', userId: users[6]._id, goalId: goals[5]._id, amount: 0, status: 'completed', date: new Date('2025-08-16') },
      { type: 'goal_created', userId: users[7]._id, goalId: goals[6]._id, amount: 0, status: 'completed', date: new Date('2025-08-17') },
      // 5 Deposit events
      { type: 'deposit', userId: users[1]._id, goalId: goals[0]._id, amount: 100, status: 'completed', date: new Date('2025-09-01') },
      { type: 'deposit', userId: users[2]._id, goalId: goals[1]._id, amount: 200, status: 'completed', date: new Date('2025-09-02') },
      { type: 'deposit', userId: users[3]._id, goalId: goals[2]._id, amount: 50, status: 'completed', date: new Date('2025-09-03') },
      { type: 'deposit', userId: users[4]._id, goalId: goals[3]._id, amount: 150, status: 'completed', date: new Date('2025-09-04') },
      { type: 'deposit', userId: users[5]._id, goalId: goals[4]._id, amount: 300, status: 'completed', date: new Date('2025-09-05') },
      // 2 Withdrawal events (one pending, one approved)
      { type: 'withdrawal', userId: users[1]._id, goalId: goals[0]._id, amount: 50, status: 'pending', date: new Date('2025-09-10') },
      { type: 'withdrawal', userId: users[2]._id, goalId: goals[1]._id, amount: 100, status: 'approved', date: new Date('2025-09-11') }
    ]);

    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Call once: seedData();
```

**Notes on Seed Script**:
- Assumes your models (`User`, `Goal`, `Transaction`) have the fields used (e.g., `userId` as ObjectId ref, `password` will be hashed by the model).
- Dates are in 2025 for relevance to current date (Sep 12, 2025); adjust as needed.
- Run only in dev; remove or comment out in production.

### Sample Dataset with Events (CSV)

This CSV represents the same events as above, exportable from MongoDB or importable via `mongoimport --type csv -c transactions --headerline --file sample-events.csv`. It includes all 24 events (10 reg + 7 goals + 5 dep + 2 wd). Save as `sample-events.csv`:

```
_id,type,userId,goalId,amount,status,date
1,registration,admin@test.com,,0,completed,2025-08-01T00:00:00Z
2,registration,parenta@test.com,,0,completed,2025-08-02T00:00:00Z
3,registration,parentb@test.com,,0,completed,2025-08-03T00:00:00Z
4,registration,parentc@test.com,,0,completed,2025-08-04T00:00:00Z
5,registration,parentd@test.com,,0,completed,2025-08-05T00:00:00Z
6,registration,parente@test.com,,0,completed,2025-08-06T00:00:00Z
7,registration,parentf@test.com,,0,completed,2025-08-07T00:00:00Z
8,registration,parentg@test.com,,0,completed,2025-08-08T00:00:00Z
9,registration,parenth@test.com,,0,completed,2025-08-09T00:00:00Z
10,registration,parenti@test.com,,0,completed,2025-08-10T00:00:00Z
11,goal_created,parenta@test.com,goal1,0,completed,2025-08-11T00:00:00Z
12,goal_created,parentb@test.com,goal2,0,completed,2025-08-12T00:00:00Z
13,goal_created,parentc@test.com,goal3,0,completed,2025-08-13T00:00:00Z
14,goal_created,parentd@test.com,goal4,0,completed,2025-08-14T00:00:00Z
15,goal_created,parente@test.com,goal5,0,completed,2025-08-15T00:00:00Z
16,goal_created,parentf@test.com,goal6,0,completed,2025-08-16T00:00:00Z
17,goal_created,parentg@test.com,goal7,0,completed,2025-08-17T00:00:00Z
18,deposit,parenta@test.com,goal1,100,completed,2025-09-01T00:00:00Z
19,deposit,parentb@test.com,goal2,200,completed,2025-09-02T00:00:00Z
20,deposit,parentc@test.com,goal3,50,completed,2025-09-03T00:00:00Z
21,deposit,parentd@test.com,goal4,150,completed,2025-09-04T00:00:00Z
22,deposit,parente@test.com,goal5,300,completed,2025-09-05T00:00:00Z
23,withdrawal,parenta@test.com,goal1,50,pending,2025-09-10T00:00:00Z
24,withdrawal,parentb@test.com,goal2,100,approved,2025-09-11T00:00:00Z
```

**Notes on CSV**:
- `_id` is a simple sequential ID (replace with ObjectIds in DB).
- `userId` and `goalId` use email/slug for simplicity; map to actual IDs in import script.
- Timestamps in ISO format for easy import.
- This dataset enables testing analytics (e.g., 5 active parents with deposits in Sep, avg deposit ~160, etc.).

## Analytics Calculations

- **Active Parents**: Users with ≥1 deposit this month.
- **Deposit Success Rate**: (Successful deposits / Total attempts) * 100 (mock 10% fail).
- **Avg Deposit Size/Frequency**: Mean amount and deposits per user this month.
- **Withdrawal Ratio**: Total approved withdrawals / Total deposits.
- **Funnel**: Counts of events this month.
- **Daily Trend**: Aggregated deposits by date (last 30 days).
- **Top Savers**: Top 5 users by deposit frequency this month.
- **Nudge List**: Parents with no deposits in 21 days.

## Screenshots

### Dashboard
Shows totals, funnel bar chart (drop-offs visible), line chart for trends, tables for top savers/nudges, pending withdrawals with approve/reject.

![Dashboard Screenshot](screenshots/dashboard.png)

### Pending Withdrawals
Shows pending withdrawals with approve/reject buttons.

![Pending Withdrawals Screenshot](screenshots/pendingWIthdrawal.png)

### Registration Form
Simple form for user registration.

![Registration Screenshot](screenshots/Register1.png)

### Login Form
Simple form for user login.

![Login Screenshot](screenshots/login.png)

### Goal Creation Form
Form for creating a savings goal.

![Goal Creation Screenshot](screenshots/createGoal.png)

### Deposit Form
Form for making a deposit.

![Deposit Screenshot](screenshots/deposit.png)

### Withdrawal Form
Form for requesting a withdrawal, including pending withdrawals table with modal confirmation.

![Withdrawal Screenshot](screenshots/withdraw.png)

### Ledger Table
Table showing transaction history.

![Ledger Screenshot](screenshots/ledger.png)

## Scalability Notes

- Use aggregation pipelines for analytics (efficient for MongoDB).
- Add pagination for large datasets.
- Real M-Pesa integration via API.
- Email/SMS via Twilio/SendGrid for nudges.

---

This completes the prototype documentation. If you need help implementing the seed script, adjusting models, or generating more data, let me know!