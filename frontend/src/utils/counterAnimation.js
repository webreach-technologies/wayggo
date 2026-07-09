export function initCounters(selector = '[data-counter]') {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  function parseValue(raw) {
    // Matches optional prefix, a number (with optional decimal), then any suffix
    // e.g. "500+" → prefix:"", num:500, suffix:"+"
    //      "98.7%" → prefix:"", num:98.7, suffix:"%"
    //      "12-Point" → prefix:"", num:12, suffix:"-Point"
    const match = raw.match(/^(\D*)([\d.]+)(.*)$/);
    if (!match) return { prefix: '', end: 0, suffix: raw, decimals: 0 };
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
    return { prefix: match[1], end: parseFloat(match[2]), suffix: match[3], decimals };
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const { prefix, end, suffix, decimals } = parseValue(el.dataset.counter);
    const duration = 1800;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = prefix + (easeOut(progress) * end).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  elements.forEach((el) => observer.observe(el));
}
