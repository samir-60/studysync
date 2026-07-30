// MAIN APPLICATION CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  checkHashRoute();
});

window.addEventListener('hashchange', checkHashRoute);

function checkHashRoute() {
  const hash = window.location.hash;
  if (hash === '#admin' || hash === '#/admin') {
    if (typeof openAdminModal === 'function') {
      openAdminModal();
    }
  }
}

function renderApp() {
  // 0. Apply Dark/Light Theme
  if (typeof applyTheme === 'function') {
    applyTheme();
  }

  // 1. Navigation Price & Stats Displays
  const priceDisp = document.getElementById('statPriceDisplay');
  if (priceDisp) priceDisp.innerText = `৳${state.config.monthlyPrice}`;

  const monthlyPriceEl = document.getElementById('cardPriceMonthly');
  if (monthlyPriceEl) monthlyPriceEl.innerHTML = `৳${state.config.monthlyPrice} <span>/ month</span>`;

  const quarterlyPriceEl = document.getElementById('cardPriceQuarterly');
  if (quarterlyPriceEl) quarterlyPriceEl.innerHTML = `৳${state.config.quarterlyPrice} <span>/ 3 months</span>`;

  const yearlyPriceEl = document.getElementById('cardPriceYearly');
  if (yearlyPriceEl) yearlyPriceEl.innerHTML = `৳${state.config.monthlyPrice * 8} <span>/ year</span>`;

  // Active Subscribers count
  const approvedCount = state.transactions.filter(t => t.status === 'APPROVED').length;
  const activeSubsEl = document.getElementById('statActiveSubscribers');
  if (activeSubsEl) activeSubsEl.innerText = approvedCount;

  // User Subscription Badges
  const statusBadge = document.getElementById('userStatusBadge');
  const appLockBadge = document.getElementById('appLockBadge');
  const lockedBanner = document.getElementById('lockedBanner');

  if (state.userSub.isPremium) {
    if (statusBadge) {
      statusBadge.className = 'badge premium';
      statusBadge.innerText = `✨ Premium (${state.userSub.plan})`;
    }
    if (appLockBadge) {
      appLockBadge.className = 'badge premium';
      appLockBadge.innerText = '✨ Premium Unlocked';
    }
    if (lockedBanner) lockedBanner.style.display = 'none';
  } else {
    if (statusBadge) {
      statusBadge.className = 'badge free';
      statusBadge.innerText = 'Free Plan';
    }
    if (appLockBadge) {
      appLockBadge.className = 'badge free';
      appLockBadge.innerText = 'Free Mode (Limited)';
    }
    if (lockedBanner) {
      if (state.tasks.length >= 3) {
        lockedBanner.style.display = 'block';
      } else {
        lockedBanner.style.display = 'none';
      }
    }
  }

  // 2. Render Workspace Tasks
  if (typeof renderTasks === 'function') {
    renderTasks();
  }

  // 3. Render Admin Panel
  if (typeof renderAdminPanel === 'function') {
    renderAdminPanel();
  }
}

// GENERAL MODAL HELPERS
function openContactModal() {
  showToast(`📞 Support Helpline: ${state.config.bkashNumber} (bKash Line)`);
}
