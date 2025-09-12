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

Seed data via backend (add to index.js for dev):

```javascript
// Example seed in index.js after connectDB
const seedUser = async () => {
  await User.create({ name: 'Admin', email: 'admin@test.com', password: 'password', role: 'admin' });
  // Add more users, goals, transactions for testing
};
seedUser();
```

Events are tracked via Transaction model. Sample: 10 registrations, 7 goals, 5 deposits, 2 withdrawals.

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

### Registration Form
Simple form for user registration.

![Registration Screenshot](screenshots/registration.png)

### Login Form
Simple form for user login.

![Login Screenshot](screenshots/login.png)

### Goal Creation Form
Form for creating a savings goal.

![Goal Creation Screenshot](screenshots/goal-creation.png)

### Deposit Form
Form for making a deposit.

![Deposit Screenshot](screenshots/deposit.png)

### Withdrawal Form
Form for requesting a withdrawal, including pending withdrawals table with modal confirmation.

![Withdrawal Screenshot](screenshots/withdrawal.png)

### Ledger Table
Table showing transaction history.

![Ledger Screenshot](screenshots/ledger.png)

## Scalability Notes

- Use aggregation pipelines for analytics (efficient for MongoDB).
- Add pagination for large datasets.
- Real M-Pesa integration via API.
- Email/SMS via Twilio/SendGrid for nudges.