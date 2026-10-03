(() => {
  const openLinkedSection = () => {
    try {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      const section = target?.closest('details');
      if (section) section.open = true;
    } catch {}
  };
  openLinkedSection();
  window.addEventListener('hashchange', openLinkedSection);
  const button = document.querySelector('[data-menu-open]');
  const closeButton = document.querySelector('[data-menu-close]');
  const drawer = document.getElementById('mobile-menu');
  if (!button || !drawer) return;
  let previousOverflow = '';
  button.addEventListener('click', () => {
    if (drawer.open) return;
    previousOverflow = document.body.style.overflow;
    drawer.showModal();
    button.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  });
  closeButton.addEventListener('click', () => drawer.close());
  drawer.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || event.ctrlKey || event.altKey || event.metaKey) return;
    const links = [...drawer.querySelectorAll('a[href], button:not([disabled])')];
    const first = links[0];
    const last = links.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  drawer.addEventListener('click', event => {
    if (event.target !== drawer) return;
    const bounds = drawer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) drawer.close();
  });
  drawer.addEventListener('close', () => {
    button.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = previousOverflow;
    if (window.matchMedia('(max-width: 820px)').matches) button.focus();
  });
  window.matchMedia('(max-width: 820px)').addEventListener('change', event => { if (!event.matches && drawer.open) drawer.close(); });
})();
