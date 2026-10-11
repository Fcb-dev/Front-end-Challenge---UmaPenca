let frame: number | undefined;

export function smoothScrollTo(targetY: number, duration = 700) {
  if (frame) cancelAnimationFrame(frame);
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startedAt = performance.now();

  function step(now: number) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) frame = requestAnimationFrame(step);
    else frame = undefined;
  }

  frame = requestAnimationFrame(step);
}
