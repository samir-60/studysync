// StudySync AI - Root Application Script (Delegates to modular js/ components if loaded)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof renderApp === 'function') {
    renderApp();
  }
  if (typeof checkHashRoute === 'function') {
    checkHashRoute();
  }
});
