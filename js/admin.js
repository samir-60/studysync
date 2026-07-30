// ADMIN CONTROL PANEL & AUTHENTICATION CONTROLLER

function openAdminModal() {
  const adminModal = document.getElementById('adminModal');
  if (!adminModal) return;

  if (state.isAdminLoggedIn) {
    showAdminDashboard();
  } else {
    showAdminLoginForm();
  }

  adminModal.classList.add('active');
}

function closeAdminModal() {
  const adminModal = document.getElementById('adminModal');
  if (adminModal) adminModal.classList.remove('active');
}

function showAdminLoginForm() {
  const loginView = document.getElementById('adminLoginView');
  const dashboardView = document.getElementById('adminDashboardView');
  const modalCard = document.getElementById('adminModalCard');

  if (loginView) loginView.style.display = 'block';
  if (dashboardView) dashboardView.style.display = 'none';
  if (modalCard) {
    modalCard.classList.remove('wide');
  }

  // Clear previous error
  const errEl = document.getElementById('adminLoginError');
  if (errEl) errEl.style.display = 'none';
}

function showAdminDashboard() {
  const loginView = document.getElementById('adminLoginView');
  const dashboardView = document.getElementById('adminDashboardView');
  const modalCard = document.getElementById('adminModalCard');

  if (loginView) loginView.style.display = 'none';
  if (dashboardView) dashboardView.style.display = 'block';
  if (modalCard) {
    modalCard.classList.add('wide');
  }

  // Populate Admin Form Values
  document.getElementById('adminBkashNumberInput').value = state.config.bkashNumber;
  document.getElementById('adminBkashTypeInput').value = state.config.accountType;
  document.getElementById('adminPriceInput').value = state.config.monthlyPrice;
  document.getElementById('adminInstructionsInput').value = state.config.instructions.join('\n');
  document.getElementById('adminAutoApproveToggle').checked = state.config.autoApprove;

  renderAdminPanel();
}

function handleAdminLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById('adminEmailInput').value.trim();
  const passInput = document.getElementById('adminPassInput').value.trim();
  const errEl = document.getElementById('adminLoginError');

  if (emailInput === state.adminCredentials.email && passInput === state.adminCredentials.password) {
    state.isAdminLoggedIn = true;
    saveState();
    showToast('🔑 Welcome Admin! Logged in successfully.');
    showAdminDashboard();
    document.getElementById('adminLoginForm').reset();
  } else {
    if (errEl) {
      errEl.style.display = 'block';
      errEl.innerText = '❌ Invalid email or password! Please check credentials.';
    }
    showToast('❌ Incorrect admin credentials!', 'error');
  }
}

function handleAdminLogout() {
  state.isAdminLoggedIn = false;
  saveState();
  showToast('🔒 Admin logged out.');
  showAdminLoginForm();
}

function switchAdminTab(tabName, evt) {
  const e = evt || (typeof window !== 'undefined' ? window.event : null);
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  if (e && e.currentTarget) {
    e.currentTarget.classList.add('active');
  } else {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.getAttribute('onclick')?.includes(tabName)) {
        btn.classList.add('active');
      }
    });
  }
  const targetTab = document.getElementById(`tab-${tabName}`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

function filterTransactions(filter) {
  state.transactionFilter = filter;
  renderAdminPanel();
}

function renderAdminPanel() {
  if (!state.isAdminLoggedIn) return;

  // 1. Pending count
  const pendingCount = state.transactions.filter(t => t.status === 'PENDING').length;
  const adminPendingCount = document.getElementById('adminPendingCount');
  if (adminPendingCount) adminPendingCount.innerText = pendingCount;

  // 2. Populate Transactions Table
  const tbody = document.getElementById('adminTransactionTableBody');
  if (tbody) {
    tbody.innerHTML = '';

    let filtered = state.transactions;
    if (state.transactionFilter === 'PENDING') filtered = filtered.filter(t => t.status === 'PENDING');
    if (state.transactionFilter === 'APPROVED') filtered = filtered.filter(t => t.status === 'APPROVED');

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--muted); padding:20px;">No transactions found</td></tr>`;
    } else {
      filtered.forEach(tx => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${tx.date}</td>
          <td><b>${escapeHtml(tx.customer)}</b></td>
          <td><code>${tx.phone}</code></td>
          <td>${tx.plan}</td>
          <td><b>৳${tx.amount}</b></td>
          <td><code style="color:var(--bkash); font-weight:700;">${tx.trxId}</code></td>
          <td><span class="badge ${tx.status.toLowerCase()}">${tx.status}</span></td>
          <td>
            ${tx.status === 'PENDING' ? `
              <button class="btn sm success" onclick="updateTxStatus('${tx.id}', 'APPROVED')">Approve</button>
              <button class="btn sm danger" onclick="updateTxStatus('${tx.id}', 'REJECTED')">Reject</button>
            ` : `
              <button class="btn sm ghost" onclick="deleteTx('${tx.id}')">Delete</button>
            `}
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // 3. Analytics
  const totalRev = state.transactions.filter(t => t.status === 'APPROVED').reduce((sum, t) => sum + t.amount, 0);
  const totalRevEl = document.getElementById('statTotalRevenue');
  if (totalRevEl) totalRevEl.innerText = `৳${totalRev}`;
  
  const totalOrdersEl = document.getElementById('statTotalOrders');
  if (totalOrdersEl) totalOrdersEl.innerText = state.transactions.length;

  const approvedOrdersEl = document.getElementById('statApprovedOrders');
  if (approvedOrdersEl) approvedOrdersEl.innerText = state.transactions.filter(t => t.status === 'APPROVED').length;

  const pendingOrdersEl = document.getElementById('statPendingOrders');
  if (pendingOrdersEl) pendingOrdersEl.innerText = pendingCount;
}

function updateTxStatus(txId, newStatus) {
  state.transactions = state.transactions.map(t => {
    if (t.id === txId) {
      return { ...t, status: newStatus };
    }
    return t;
  });

  const targetTx = state.transactions.find(t => t.id === txId);
  if (newStatus === 'APPROVED' && targetTx) {
    state.userSub = { isPremium: true, plan: targetTx.plan, activeTrxId: targetTx.trxId };
    showToast(`Approved transaction ${targetTx.trxId}! User upgraded to Premium.`);
  } else {
    showToast(`Transaction updated to ${newStatus}`);
  }

  saveState();
}

function deleteTx(txId) {
  state.transactions = state.transactions.filter(t => t.id !== txId);
  saveState();
  showToast('Transaction log deleted.');
}

function saveBkashSettings(e) {
  e.preventDefault();
  const newNumber = document.getElementById('adminBkashNumberInput').value.trim();
  const newType = document.getElementById('adminBkashTypeInput').value;
  const newPrice = parseInt(document.getElementById('adminPriceInput').value) || 150;
  const instText = document.getElementById('adminInstructionsInput').value.trim();
  const autoApprove = document.getElementById('adminAutoApproveToggle').checked;

  state.config = {
    bkashNumber: newNumber,
    accountType: newType,
    monthlyPrice: newPrice,
    quarterlyPrice: Math.round(newPrice * 2.66),
    autoApprove: autoApprove,
    instructions: instText ? instText.split('\n').filter(i => i.trim()) : DEFAULT_CONFIG.instructions
  };

  saveState();
  showToast('✅ bKash Gateway Settings Updated Live!');
  closeAdminModal();
}
