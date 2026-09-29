(() => {
  const BASE_W = 1600;
  const BASE_H = 900;
  const stage = document.getElementById('stage');
  const slides = [...document.querySelectorAll('.slide')];
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const currentLabel = document.getElementById('current');
  const dotsWrap = document.getElementById('dots');
  const fullscreen = document.getElementById('fullscreen');
  let current = 0;
  let touchStartX = null;

  function fit() {
    const safeW = window.innerWidth;
    const safeH = window.innerHeight;
    const scale = Math.min(safeW / BASE_W, safeH / BASE_H);
    stage.style.transform = `scale(${scale})`;
  }

  function indexFromHash() {
    const m = location.hash.match(/slide-(\d+)/);
    if (!m) return 0;
    return Math.max(0, Math.min(slides.length - 1, Number(m[1]) - 1));
  }

  function render(idx, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, idx));
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === current));
    currentLabel.textContent = String(current + 1).padStart(2, '0');
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (updateHash) history.replaceState(null, '', `#slide-${current + 1}`);
  }

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.type = 'button';
    b.title = `Ir para slide ${i + 1}`;
    b.setAttribute('aria-label', `Ir para slide ${i + 1}`);
    b.addEventListener('click', () => render(i));
    dotsWrap.appendChild(b);
  });

  prev.addEventListener('click', () => render(current - 1));
  next.addEventListener('click', () => render(current + 1));
  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => render(indexFromHash(), false));

  document.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); render(current + 1); }
    if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); render(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); render(0); }
    if (e.key === 'End') { e.preventDefault(); render(slides.length - 1); }
    if (e.key.toLowerCase() === 'f') toggleFullscreen();
  });

  document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, {passive:true});
  document.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 55) render(current + (dx < 0 ? 1 : -1));
  }, {passive:true});

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  }
  fullscreen.addEventListener('click', toggleFullscreen);

  fit();
  render(indexFromHash(), false);
})();
