// BKASH CHECKOUT MODAL ENGINE
function openBkashCheckout(planName, amount) {
  state.currentCheckoutPlan = planName;
  state.currentCheckoutAmount = amount;

  document.getElementById('checkoutPlanName').value = `${planName} (৳${amount})`;
  document.getElementById('modalAmountDisplay').innerText = `৳${amount}`;
  document.getElementById('modalBkashNumber').innerText = state.config.bkashNumber;
  document.getElementById('modalBkashTypeBadge').innerText = state.config.accountType;

  // Populate instruction list dynamically based on admin config
  const instOl = document.getElementById('modalBkashInstructions');
  if (instOl) {
    instOl.innerHTML = '';
    state.config.instructions.forEach(inst => {
      const li = document.createElement('li');
      li.innerHTML = inst.replace(`৳150`, `<b>৳${amount}</b>`);
      instOl.appendChild(li);
    });
  }

  document.getElementById('bkashModal').classList.add('active');
}

function closeBkashModal() {
  document.getElementById('bkashModal').classList.remove('active');
}

function copyBkashNumber() {
  const num = state.config.bkashNumber;
  navigator.clipboard.writeText(num);
  const btn = document.getElementById('copyBkashBtn');
  if (btn) {
    btn.innerText = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerText = '📋 Copy Number';
      btn.classList.remove('copied');
    }, 2000);
  }
  showToast(`bKash number ${num} copied to clipboard!`);
}

function handleBkashSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const trxId = document.getElementById('custTrxId').value.trim().toUpperCase();

  if (!name) {
    showToast('Please enter your name!', 'error');
    return;
  }
  if (!phone || !/^01[3-9][0-9]{8}$/.test(phone)) {
    showToast('Please enter a valid 11-digit bKash phone number (e.g. 017XXXXXXXX)!', 'error');
    return;
  }
  if (!trxId || trxId.length < 8) {
    showToast('Please enter a valid 8-10 character bKash TrxID!', 'error');
    return;
  }

  // Auto-approve check or manual admin verification
  const status = state.config.autoApprove ? 'APPROVED' : 'PENDING';

  const newTransaction = {
    id: "TX" + Math.floor(10000 + Math.random() * 90000),
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    customer: name,
    phone: phone,
    plan: state.currentCheckoutPlan,
    amount: state.currentCheckoutAmount,
    trxId: trxId,
    status: status
  };

  state.transactions.unshift(newTransaction);

  if (status === 'APPROVED') {
    state.userSub = { isPremium: true, plan: state.currentCheckoutPlan, activeTrxId: trxId };
    showToast('🎉 bKash Payment Auto-Approved! Premium Activated!');
  } else {
    showToast('📩 Payment submitted! Pending admin verification.');
  }

  saveState();
  closeBkashModal();
  document.getElementById('bkashPaymentForm').reset();
}
