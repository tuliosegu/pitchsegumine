(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const currentLabel = document.getElementById('current');
  const dotsWrap = document.getElementById('dots');
  const fullscreen = document.getElementById('fullscreen');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = -1;
  let touchStart = null;
  let exitTimer = null;

  function indexFromHash() {
    const match = location.hash.match(/slide-(\d+)/);
    if (!match) return 0;
    return Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1));
  }

  function render(index, { updateHash = true, direction } = {}) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    if (target === current) return;

    const previous = current;
    const travel = direction || (target >= previous ? 'next' : 'prev');
    if (exitTimer) window.clearTimeout(exitTimer);

    slides.forEach((slide, i) => {
      slide.classList.remove('is-active', 'is-exiting', 'exit-next', 'exit-prev', 'enter-next', 'enter-prev');
      slide.inert = i !== target;
      slide.setAttribute('aria-hidden', String(i !== target));
    });

    if (!reducedMotion.matches && previous >= 0 && previous !== target) {
      slides[previous].classList.add('is-exiting', `exit-${travel}`);
      slides[target].classList.add('is-active', `enter-${travel}`);
      exitTimer = window.setTimeout(() => {
        slides[previous].classList.remove('is-exiting', 'exit-next', 'exit-prev');
        slides[target].classList.remove('enter-next', 'enter-prev');
      }, 600);
    } else {
      slides[target].classList.add('is-active');
    }

    current = target;
    [...dotsWrap.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      if (i === current) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    currentLabel.textContent = String(current + 1).padStart(2, '0');
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (updateHash) history.replaceState(null, '', `#slide-${current + 1}`);
  }

  slides.forEach((slide, i) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.inert = i !== 0;
    slide.setAttribute('aria-hidden', String(i !== 0));
  });

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.title = `Ir para o slide ${i + 1}`;
    dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
    dot.addEventListener('click', () => render(i));
    dotsWrap.appendChild(dot);
  });

  prev.addEventListener('click', () => render(current - 1));
  next.addEventListener('click', () => render(current + 1));
  window.addEventListener('hashchange', () => render(indexFromHash(), { updateHash: false }));

  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof Element && target.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;

    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      render(current + 1);
    } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      render(current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      render(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      render(slides.length - 1);
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  document.addEventListener('touchstart', (event) => {
    if (event.target instanceof Element && event.target.closest('a, button')) return;
    touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
  }, { passive: true });
  document.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.2) render(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      // Fullscreen can be unavailable in embedded browsers; the deck remains usable.
    }
  }

  fullscreen.addEventListener('click', toggleFullscreen);
  render(indexFromHash(), { updateHash: false, direction: 'next' });
})();
