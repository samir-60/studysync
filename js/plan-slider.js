// PLAN COMPARISON SLIDER MODAL
// Shows when user clicks "Try Free Planner" or "Get Started Free"

const PLAN_DATA = [
  {
    id: 'free',
    name: 'Starter',
    price: '৳0',
    period: '/ forever',
    isFree: true,
    features: [
      { icon: 'limit', text: 'Up to 3 study tasks only' },
      { icon: 'yes',   text: 'Basic task add & delete' },
      { icon: 'yes',   text: 'Toggle task complete/pending' },
      { icon: 'yes',   text: 'Day & priority selection' },
      { icon: 'no',    text: 'AI Auto-Plan (locked)' },
      { icon: 'no',    text: 'Unlimited tasks (locked)' },
      { icon: 'no',    text: 'Exam revision planner (locked)' },
      { icon: 'no',    text: 'Priority bKash support (locked)' },
    ],
    cta: 'Currently Active',
    action: null,
  },
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: '৳150',
    period: '/ month',
    isPopular: true,
    features: [
      { icon: 'yes', text: 'Unlimited study tasks' },
      { icon: 'yes', text: 'AI Auto-Plan scheduling' },
      { icon: 'yes', text: 'Exam revision planner' },
      { icon: 'yes', text: 'Priority bKash support' },
      { icon: 'yes', text: 'Smart deadline balancing' },
      { icon: 'yes', text: 'Progress tracking per subject' },
      { icon: 'yes', text: 'Instant premium activation' },
      { icon: 'no',  text: '1-on-1 AI coaching (VIP only)' },
    ],
    cta: 'Pay ৳150 with bKash',
    amount: 150,
  },
  {
    id: 'semester',
    name: 'Semester Pass',
    price: '৳400',
    period: '/ 3 months',
    features: [
      { icon: 'yes', text: 'Unlimited study tasks' },
      { icon: 'yes', text: 'AI Auto-Plan scheduling' },
      { icon: 'yes', text: 'Exam revision planner' },
      { icon: 'yes', text: 'Priority bKash support' },
      { icon: 'yes', text: 'Smart deadline balancing' },
      { icon: 'yes', text: 'Progress tracking per subject' },
      { icon: 'yes', text: 'Custom course schedule importer' },
      { icon: 'no',  text: '1-on-1 AI coaching (VIP only)' },
    ],
    cta: 'Pay ৳400 with bKash',
    amount: 400,
  },
  {
    id: 'vip',
    name: 'Annual VIP Pass',
    price: '৳1200',
    period: '/ year',
    features: [
      { icon: 'yes', text: 'Unlimited study tasks' },
      { icon: 'yes', text: 'AI Auto-Plan scheduling' },
      { icon: 'yes', text: 'Exam revision planner' },
      { icon: 'yes', text: 'Priority bKash support' },
      { icon: 'yes', text: 'Smart deadline balancing' },
      { icon: 'yes', text: 'Progress tracking per subject' },
      { icon: 'yes', text: 'Custom course schedule importer' },
      { icon: 'yes', text: '1-on-1 AI exam coaching' },
    ],
    cta: 'Pay ৳1200 with bKash',
    amount: 1200,
  }
];

function openPlanSlider() {
  let overlay = document.getElementById('planSliderOverlay');
  if (!overlay) {
    overlay = buildPlanSlider();
    document.body.appendChild(overlay);
  }
  // Update free plan "Currently Active" button state
  const freeBtn = document.getElementById('planSliderFreeBtn');
  if (freeBtn && !state.userSub.isPremium) {
    freeBtn.textContent = '✅ Currently Active';
    freeBtn.disabled = true;
    freeBtn.className = 'btn ghost';
  }

  requestAnimationFrame(() => {
    overlay.classList.add('open');
  });
}

function closePlanSlider() {
  const overlay = document.getElementById('planSliderOverlay');
  if (overlay) overlay.classList.remove('open');
}

function buildPlanSlider() {
  const overlay = document.createElement('div');
  overlay.id = 'planSliderOverlay';
  overlay.className = 'plan-slide-overlay';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePlanSlider();
  });

  const panel = document.createElement('div');
  panel.className = 'plan-slide-panel';

  // Header
  panel.innerHTML = `
    <div class="plan-slide-header">
      <div class="slide-title">
        <h2>📚 Compare All Plans</h2>
        <p>See exactly what each plan unlocks for your study journey</p>
      </div>
      <button class="plan-slide-close" onclick="closePlanSlider()">✕</button>
    </div>

    <div class="active-plan-banner">
      <span class="plan-icon">🎓</span>
      <div>
        <div>You are on the <b>Starter (Free) Plan</b></div>
        <div class="plan-detail">Add up to 3 tasks · Upgrade anytime via bKash below</div>
      </div>
    </div>

    <div class="plan-compare-grid" id="planCompareGrid"></div>
  `;

  // Build plan cards
  const grid = panel.querySelector('#planCompareGrid');
  PLAN_DATA.forEach(plan => {
    const card = document.createElement('div');
    card.className = `plan-compare-card${plan.isFree ? ' is-free' : ''}${plan.isPopular ? ' is-premium' : ''}`;

    const featuresHtml = plan.features.map(f => `
      <div class="plan-feat${f.icon === 'no' ? ' locked' : ''}">
        <span class="feat-icon ${f.icon}">${f.icon === 'yes' ? '✓' : f.icon === 'no' ? '✕' : '!'}</span>
        <span class="feat-text">${f.text}</span>
      </div>
    `).join('');

    const ctaBtn = plan.isFree
      ? `<button id="planSliderFreeBtn" class="btn ghost" disabled>✅ Currently Active</button>`
      : `<button class="btn bkash-btn" onclick="closePlanSlider(); openBkashCheckout('${plan.name}', ${plan.amount});">${plan.cta}</button>`;

    card.innerHTML = `
      ${plan.isPopular ? '<div class="plan-popular-tag">⭐ Most Popular</div>' : ''}
      <div class="plan-card-top">
        <div class="plan-compare-name">${plan.name}</div>
        <div class="plan-compare-price">${plan.price} <span>${plan.period}</span></div>
        ${plan.isFree ? '<div class="plan-current-tag">✓ Your Current Plan</div>' : ''}
      </div>
      <div class="plan-features-list">${featuresHtml}</div>
      <div class="plan-card-cta">${ctaBtn}</div>
    `;

    grid.appendChild(card);
  });

  overlay.appendChild(panel);
  return overlay;
}
