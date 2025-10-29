document.addEventListener('DOMContentLoaded', () => {
  let seconds = 5;
  const el = document.getElementById('countdown');

  if (el) el.textContent = `Redirecting in ${seconds} seconds...`;

  const t = setInterval(() => {
    seconds--;
    if (el) el.textContent = `Redirecting in ${seconds} second${seconds !== 1 ? 's' : ''}...`;
    if (seconds <= 0) {
     clearInterval(t);
      window.location.href = 'index.html';
    }
  }, 1000);
});