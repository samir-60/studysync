// STUDY PLANNER WORKSPACE ENGINE & FREE PLAN CONTROLLER

function activateFreePlan() {
  state.userSub = { isPremium: false, plan: "Free Plan", activeTrxId: null };
  saveState();
  showToast('Starter Free Plan Active! Enjoy up to 3 study tasks.');
  const appSection = document.getElementById('app');
  if (appSection) appSection.scrollIntoView({ behavior: 'smooth' });
}

function renderTasks() {
  const taskGrid = document.getElementById('taskGrid');
  if (!taskGrid) return;
  taskGrid.innerHTML = '';

  state.tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    card.innerHTML = `
      <button class="btn-check" onclick="toggleTask(${task.id})">${task.completed ? '☑' : '☐'}</button>
      <span class="tag-sub">${task.day} · ${task.priority} Priority</span>
      <h4>${escapeHtml(task.title)}</h4>
      <div class="meta">
        <span>Status: ${task.completed ? 'Done' : 'Pending'}</span>
        <button class="btn sm danger" style="padding:2px 8px; font-size:11px;" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskGrid.appendChild(card);
  });
}

function addNewTask() {
  const titleInput = document.getElementById('newTaskTitle');
  const dayInput = document.getElementById('newTaskDay');
  const priorityInput = document.getElementById('newTaskPriority');

  const title = titleInput.value.trim();
  if (!title) {
    showToast('Please enter a task title!', 'error');
    return;
  }

  if (!state.userSub.isPremium && state.tasks.length >= 3) {
    showToast('Free tier limited to 3 tasks! Upgrade with bKash for unlimited tasks.', 'warning');
    if (typeof openPlanSlider === 'function') {
      openPlanSlider();
    } else {
      const lockedBanner = document.getElementById('lockedBanner');
      if (lockedBanner) lockedBanner.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  const newTask = {
    id: Date.now(),
    title: title,
    day: dayInput.value,
    priority: priorityInput.value,
    completed: false
  };

  state.tasks.push(newTask);
  titleInput.value = '';
  saveState();
  showToast(`Task "${title}" added to your schedule!`);
}

function toggleTask(id) {
  state.tasks = state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveState();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  showToast('Task removed.');
}

function generateAISchedule() {
  if (!state.userSub.isPremium) {
    showToast('AI Auto-Planning requires Premium! Pay ৳150 with bKash to unlock.', 'warning');
    const lockedBanner = document.getElementById('lockedBanner');
    if (lockedBanner) lockedBanner.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  showToast('🤖 AI is reorganizing your study schedule for maximum focus...');
  setTimeout(() => {
    state.tasks = [
      { id: Date.now() + 1, title: "Revise Chapter 4 Data Structures", day: "MON", priority: "High", completed: false },
      { id: Date.now() + 2, title: "Compiler Design Quiz Practice", day: "WED", priority: "High", completed: false },
      { id: Date.now() + 3, title: "Lab Experiment Simulation", day: "FRI", priority: "Medium", completed: false }
    ];
    saveState();
    showToast('✨ AI Schedule generated successfully!');
  }, 800);
}
