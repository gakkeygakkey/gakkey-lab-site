(() => {
  const hero = document.querySelector(".hero");
  const motionQuery = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  );

  if (!hero) return;

  let frameRequested = false;

  const updateZoom = () => {
    frameRequested = false;

    if (!motionQuery.matches) {
      hero.style.removeProperty("--hero-zoom");
      hero.style.removeProperty("--hero-shift");
      return;
    }

    const progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
    const zoom = 1.2 - progress * 0.2;
    const shift = progress * hero.offsetHeight * 0.9;
    hero.style.setProperty("--hero-zoom", zoom.toFixed(4));
    hero.style.setProperty("--hero-shift", `${shift.toFixed(2)}px`);
  };

  const requestZoomUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateZoom);
  };

  window.addEventListener("scroll", requestZoomUpdate, { passive: true });
  window.addEventListener("resize", requestZoomUpdate);
  motionQuery.addEventListener("change", requestZoomUpdate);
  requestZoomUpdate();
})();
