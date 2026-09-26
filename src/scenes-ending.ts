import { gsap } from 'gsap';

export function setupEnding(): void {
  const scene = document.querySelector<HTMLElement>('#endingScene');
  const yarnBall = document.querySelector<HTMLElement>('#endingYarnBall');
  const replay = document.querySelector<HTMLButtonElement>('#replayMemoriesButton');

  if (!scene || !yarnBall || !replay) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealed = false;

  const reveal = () => {
    if (revealed) return;
    revealed = true;

    scene.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ending-active');

    const start = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (reducedMotion) {
        gsap.set(scene, { opacity: 1 });
        gsap.set('.ending-content, .ending-title span, .ending-title em, .ending-message, .ending-note, .ending-replay, .ending-footer', { opacity: 1, clearProps: 'transform' });
        return;
      }

      tl.set(scene, { opacity: 1 })
        .from('.ending-wash', { scale: 0.2, opacity: 0, duration: 1.05, ease: 'power4.inOut' })
        .from('.ending-content', { y: 34, opacity: 0, duration: 0.72 }, '-=0.35')
        .from('.ending-kicker, .ending-stamp', { y: 12, opacity: 0, duration: 0.42, stagger: 0.08 }, '-=0.36')
        .from('.ending-title span, .ending-title em', { y: 38, opacity: 0, rotate: 2, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.14')
        .from('.ending-message', { y: 16, opacity: 0, duration: 0.55 }, '-=0.38')
        .from('.ending-note, .ending-replay, .ending-footer', { y: 12, opacity: 0, duration: 0.45, stagger: 0.08 }, '-=0.25')
        .from('.ending-decor', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(2)' }, '-=0.45')
        .from('.ending-yarn-ball', { scale: 0.55, opacity: 0, rotate: -90, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.45');

      gsap.to(yarnBall, { y: -9, x: 5, rotate: 5, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.ending-thread-top span', { x: '72vw', duration: 7.5, repeat: -1, ease: 'none' });
      gsap.to('.ending-thread-bottom span', { x: '-74vw', duration: 9, repeat: -1, ease: 'none' });
      gsap.to('.ending-heart, .ending-flower', { y: -8, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.28 });
      gsap.to('.ending-berry-a', { rotate: 4, y: -6, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.ending-berry-b', { rotate: -4, y: 7, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    };

    requestAnimationFrame(() => {
      scene.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(start, reducedMotion ? 80 : 460);
    });
  };

  window.addEventListener('krisha:video-ended', reveal);
  window.addEventListener('krisha:skip-final', reveal);

  replay.addEventListener('click', () => {
    replay.disabled = true;
    document.body.classList.add('ending-replaying');

    if (reducedMotion) {
      window.sessionStorage.removeItem('fromEntry');
      window.location.href = 'index.html';
      return;
    }

    gsap.timeline({
      onComplete: () => {
        window.sessionStorage.removeItem('fromEntry');
        window.location.href = 'index.html';
      },
    })
      .to('.ending-content', { opacity: 0, y: 18, duration: 0.35, ease: 'power2.in' })
      .to('.ending-wash', { scale: 12, opacity: 1, duration: 0.95, ease: 'power4.inOut' }, '-=0.12');
  });
}
