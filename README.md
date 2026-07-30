# StudySync AI — Web Application with Live Admin bKash Payment System

A web application built for students with an integrated **Live Admin Payment System for bKash** where administrators can edit bKash account numbers, payment types, prices, and approve/reject transactions live.

---

## 🔑 Admin Credentials

- **Admin Login Email**: `admin@gmail.com`
- **Admin Password**: `1234`

---

## 📂 Project Directory Structure

```
studysync/
├── index.html            # Main HTML document linking modular CSS & JS
├── css/
│   ├── style.css         # Base design system, variables, hero, cards & toast styles
│   ├── bkash-modal.css   # bKash checkout payment modal styling
│   └── admin.css         # Admin control panel, dashboard tabs, tables & toggle switches
├── js/
│   ├── state.js         # Centralized state controller & localStorage persistence
│   ├── bkash.js         # bKash checkout modal logic & TrxID submission
│   ├── admin.js         # Admin panel controller (edit bKash settings & approve payments)
│   ├── planner.js       # Interactive AI study workspace engine
│   └── app.js           # Main application renderer & initializer
└── README.md             # Project documentation & usage guide
```

---

## ⚡ Features & Admin Capabilities

1. **Admin Security Gate**:
   - Access via `⚙️ Admin Panel` button or `Edit bKash Number & Settings` top bar link.
   - Requires login with `admin@gmail.com` and password `1234`.
   - Includes `🔒 Logout Admin` button inside dashboard.

2. **Editable bKash Gateway**:
   - Change Admin bKash Number dynamically (e.g. `01712345678`).
   - Select Account Type: `Personal (Send Money)`, `Agent (Cash Out)`, `Merchant (Payment)`, `Gateway API`.
   - Update monthly price (৳150) and custom step instructions.
   - Toggle **Instant Auto-Approval** vs **Manual Verification**.

3. **Real-Time Transaction Approval**:
   - Admin can view customer payment requests with customer name, phone, plan, amount, and bKash `TrxID`.
   - Clicking **Approve** instantly grants customer `✨ Premium Active` status.

---

## 🚀 How to Run

1. Open `index.html` directly in any web browser.
2. Click `⚙️ Admin Panel` and enter `admin@gmail.com` / `1234` to access the admin dashboard.
