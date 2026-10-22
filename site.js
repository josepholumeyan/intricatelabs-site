/* Small progressive enhancements. The site is fully readable without this file. */
(() => {
  // 1. A soft light that follows the cursor on interactive cards
  document.querySelectorAll('.card.interactive').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--x', e.clientX - r.left + 'px');
      card.style.setProperty('--y', e.clientY - r.top + 'px');
    });
  });

  // 2. Feature explorer: choosing a feature swaps the phone screenshot (desktop) or opens it inline (touch)
  const explorer = document.querySelector('.explorer');
  if (explorer) {
    const features = [...explorer.querySelectorAll('.feature')];
    const shots = [...explorer.querySelectorAll('.phone img')];
    const hoverMode = window.matchMedia('(hover: hover) and (min-width: 860px)');
    let timer;
    const select = (feature) => {
      features.forEach((f) => {
        const on = f === feature;
        f.classList.toggle('is-active', on);
        f.setAttribute('aria-pressed', String(on));
      });
      shots.forEach((s) => s.classList.toggle('is-active', s.dataset.key === feature.dataset.shot));
    };
    features.forEach((f) => {
      f.addEventListener('click', () => select(f));
      f.addEventListener('focus', () => select(f));
      // Hover only on devices that can hover, with a short delay so sweeping the mouse across the list doesn't flicker
      f.addEventListener('mouseenter', () => {
        if (!hoverMode.matches) return;
        clearTimeout(timer);
        timer = setTimeout(() => select(f), 120);
      });
      f.addEventListener('mouseleave', () => clearTimeout(timer));
    });
  }

  // 3. Document pages: contents list open on wide screens, current section highlighted
  const toc = document.querySelector('.doc-toc details');
  if (toc) {
    const wide = window.matchMedia('(min-width: 900px)');
    const sync = () => { toc.open = wide.matches; };
    sync();
    wide.addEventListener('change', sync);

    const links = [...toc.querySelectorAll('a')];
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-current'));
        const link = byId.get(entry.target.id);
        if (link) link.classList.add('is-current');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.doc-body section[id]').forEach((s) => observer.observe(s));
  }
})();