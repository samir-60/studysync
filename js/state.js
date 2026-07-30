// DEFAULT INITIAL STATE & LOCALSTORAGE MANAGER
const DEFAULT_CONFIG = {
  bkashNumber: "01712345678",
  accountType: "Personal (Send Money)",
  monthlyPrice: 150,
  quarterlyPrice: 400,
  autoApprove: false,
  instructions: [
    "Open your bKash Mobile App or dial *247#",
    "Select Send Money option",
    "Enter the bKash number shown above",
    "Enter exact plan amount",
    "Enter reference: STUDYSYNC",
    "Enter your PIN to complete transfer",
    "Copy the 10-digit TrxID from the confirmation SMS"
  ]
};

const SAMPLE_TRANSACTIONS = [
  { id: "TX101", date: "2026-07-29 18:30", customer: "Rafiq Islam", phone: "01711223344", plan: "Monthly Premium", amount: 150, trxId: "9A8B7C6D5E", status: "APPROVED" },
  { id: "TX102", date: "2026-07-29 19:15", customer: "Nadia Jahan", phone: "01855667788", plan: "Semester Pass", amount: 400, trxId: "8X7Y6Z5W4V", status: "PENDING" }
];

const INITIAL_TASKS = [
  { id: 1, title: "DBMS Midterm Preparation", day: "MON", priority: "High", completed: false },
  { id: 2, title: "Algorithm Lab Report 3", day: "TUE", priority: "Medium", completed: false },
  { id: 3, title: "AI Project Proposal Draft", day: "FRI", priority: "High", completed: true }
];

// CENTRAL APPLICATION STATE
let state = {
  config: JSON.parse(localStorage.getItem('study_bkash_config')) || DEFAULT_CONFIG,
  transactions: JSON.parse(localStorage.getItem('study_transactions')) || SAMPLE_TRANSACTIONS,
  tasks: JSON.parse(localStorage.getItem('study_tasks')) || INITIAL_TASKS,
  userSub: JSON.parse(localStorage.getItem('study_user_sub')) || { isPremium: false, plan: "Free Plan", activeTrxId: null },
  darkMode: localStorage.getItem('study_dark_mode') === 'true',
  isAdminLoggedIn: localStorage.getItem('study_admin_logged_in') === 'true',
  adminCredentials: {
    email: "admin@gmail.com",
    password: "1234"
  },
  currentCheckoutPlan: null,
  currentCheckoutAmount: 0,
  transactionFilter: "ALL"
};

function saveState() {
  localStorage.setItem('study_bkash_config', JSON.stringify(state.config));
  localStorage.setItem('study_transactions', JSON.stringify(state.transactions));
  localStorage.setItem('study_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('study_user_sub', JSON.stringify(state.userSub));
  localStorage.setItem('study_dark_mode', state.darkMode);
  localStorage.setItem('study_admin_logged_in', state.isAdminLoggedIn);
  if (typeof renderApp === 'function') {
    renderApp();
  }
}

function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  saveState();
  showToast(state.darkMode ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
}

function applyTheme() {
  if (state.darkMode) {
    document.body.classList.add('dark-mode');
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.innerText = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.innerText = '🌙';
  }
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🇧🇩</span> <span>${escapeHtml(msg)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
