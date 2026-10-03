(() => {
  const settings = JSON.parse(document.getElementById('hero-settings').textContent);
  const heroImages = JSON.parse(document.getElementById('hero-image-data').textContent);
  const photo = document.querySelector('[data-hero-photo]');
  const credit = document.querySelector('[data-photo-credit]');
  const lifetime = settings.stableMinutes * 60 * 1000;
  const now = Date.now();
  let selected = heroImages.find(item => item.id === settings.fallbackImage);
  // Use one shared record across reloads, pages and tabs. Never rotate while reading.
  for (const storageName of ['localStorage', 'sessionStorage']) {
    try {
      const storage = window[storageName];
      let remembered = null;
      try { remembered = JSON.parse(storage.getItem(settings.storageKey) || 'null'); } catch {}
      const saved = heroImages.find(item => item.id === remembered?.id);
      if (saved && Number.isFinite(remembered.expiresAt) && remembered.expiresAt > now && remembered.expiresAt <= now + lifetime) {
        selected = saved;
      } else {
        const candidates = heroImages.filter(item => item.id !== remembered?.id);
        const pool = candidates.length ? candidates : heroImages;
        const next = pool[Math.floor(Math.random() * pool.length)];
        storage.setItem(settings.storageKey, JSON.stringify({ id: next.id, expiresAt: now + lifetime }));
        selected = next;
      }
      break;
    } catch {
      // A blocked storage area falls back to the next one or the signature photograph.
    }
  }
  const layout = document.body.classList.contains('page-article') ? 'article'
    : document.querySelector('.hero').dataset.page === 'home' ? 'home' : 'page';
  const modes = selected.presentation.variants[layout];
  const srcset = mode => mode.sources.map(source => '/' + source.src + ' ' + source.width + 'w').join(', ');
  // Set only the selected picture's candidates in one synchronous task. The
  // browser chooses one device/density source; the image pool is never preloaded.
  for (const device of ['mobile', 'tablet']) {
    const source = document.querySelector('[data-hero-source="' + device + '"]');
    source.sizes = '100vw';
    source.srcset = srcset(modes[device]);
  }
  photo.setAttribute('data-photo-id', selected.id);
  photo.width = modes.desktop.width;
  photo.height = modes.desktop.height;
  photo.style.setProperty('--focal-desktop', selected.focal.desktop);
  photo.style.setProperty('--focal-tablet', selected.focal.tablet);
  photo.style.setProperty('--focal-mobile', selected.focal.mobile);
  photo.setAttribute('fetchpriority', 'high');
  photo.decoding = 'async';
  photo.sizes = '100vw';
  photo.srcset = srcset(modes.desktop);
  photo.src = '/' + modes.desktop.sources.at(-1).src;
  credit.href = '/credits.html#' + selected.id;
  credit.title = selected.credit;
  credit.setAttribute('aria-label', 'Image credit: ' + selected.credit);
})();
