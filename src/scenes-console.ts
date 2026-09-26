import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function setupConsole(): void {
  const section = document.querySelector<HTMLElement>('#consoleScene');
  const shell = document.querySelector<HTMLElement>('#consoleShell');
  const screen = document.querySelector<HTMLButtonElement>('#consoleScreen');
  const screenText = document.querySelector<HTMLElement>('#consoleScreenText');
  const status = document.querySelector<HTMLElement>('#consoleStatus');
  const portal = document.querySelector<HTMLElement>('#lettersPortal');
  const glow = document.querySelector<HTMLElement>('#consoleGlow');
  const openLettersButton = document.querySelector<HTMLButtonElement>('#openLettersButton');

  if (!section || !shell || !screen || !screenText || !status || !portal || !glow) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false;
  let animating = false;

  const idle = gsap.timeline({ repeat: -1, yoyo: true, paused: reducedMotion })
    .to(shell, { y: -10, rotateZ: -1.3, rotateX: 1.4, duration: 3.6, ease: 'sine.inOut' })
    .to(shell, { y: 6, rotateZ: 1.1, rotateX: -1.2, duration: 3.2, ease: 'sine.inOut' });

  if (reducedMotion) {
    gsap.set(shell, { y: 0, rotateZ: 0, rotateX: 0 });
  }

  if (!reducedMotion) {
    gsap.to('.console-thread-ball', {
      x: 'calc(100vw - 44px)',
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        end: 'bottom 28%',
        scrub: 1.1,
      },
      ease: 'none',
    });

    gsap.to('.console-sticker', {
      y: -14,
      rotate: 5,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.4,
    });

    gsap.from('.console-copy', {
      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
        toggleActions: 'play none none reverse',
      },
      x: -70,
      opacity: 0,
      duration: 0.95,
      ease: 'power3.out',
    });

    gsap.from('.console-stage', {
      scrollTrigger: {
        trigger: section,
        start: 'top 68%',
        toggleActions: 'play none none reverse',
      },
      x: 80,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'back.out(1.25)',
    });

    gsap.from('.console-side-note', {
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
      y: 35,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
    });
  }

  screen.addEventListener('pointerenter', () => {
    if (animating) return;
    gsap.to(shell, { rotateZ: -1.5, rotateY: -2.5, duration: 0.35, ease: 'power2.out' });
    gsap.to('.screen-glow', { opacity: 0.9, scale: 1.08, duration: 0.35, ease: 'power2.out' });
  });

  screen.addEventListener('pointerleave', () => {
    if (animating || reducedMotion) return;
    gsap.to(shell, { rotateZ: 0, rotateY: 0, duration: 0.55, ease: 'elastic.out(1, .45)' });
    gsap.to('.screen-glow', { opacity: 0.45, scale: 1, duration: 0.45, ease: 'power2.out' });
  });

  screen.addEventListener('pointerdown', () => {
    gsap.to(screen, { scale: 0.975, duration: 0.08, ease: 'power2.in' });
  });

  screen.addEventListener('pointerup', () => {
    gsap.to(screen, { scale: 1, duration: 0.22, ease: 'back.out(2)' });
  });

  screen.addEventListener('click', () => {
    if (opened || animating) return;
    animating = true;
    opened = true;
    screen.disabled = true;
    screen.setAttribute('aria-expanded', 'true');
    portal.setAttribute('aria-hidden', 'false');
    shell.classList.add('console-awake');
    status.textContent = 'SYSTEM ONLINE ✦';

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    tl.to('.console-bezel-light', { opacity: 1, duration: 0.3 })
      .to('.screen-static', { opacity: 0.55, duration: 0.12 })
      .to('.screen-static', { opacity: 0.08, duration: 0.16 })
      .to(screenText, { opacity: 0, y: 8, duration: 0.18 }, '<')
      .call(() => {
        screenText.textContent = 'MEMORY LOADED';
      })
      .to(screenText, { opacity: 1, y: 0, duration: 0.26, ease: 'back.out(1.5)' })
      .to('.screen-progress-bar span', { scaleX: 1, duration: 0.75, ease: 'power2.inOut' })
      .to('.console-button', { y: 3, scale: 0.96, duration: 0.09, stagger: 0.04 }, '-=0.55')
      .to('.console-button', { y: 0, scale: 1, duration: 0.18, stagger: 0.04, ease: 'back.out(2)' })
      .to('.console-screen', { boxShadow: '0 0 0 3px rgba(255,255,255,.4), 0 0 120px rgba(232,93,112,.44)', duration: 0.35 })
      .to(portal, {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.52,
        ease: 'power3.out',
      })
      .to('.portal-thread', { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, '-=0.3')
      .to('.portal-letter-stacks .stack', { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)' }, '-=0.28')
      .call(() => {
        status.textContent = 'NEXT MEMORY UNLOCKED ✉';
        animating = false;
      });
  });

  openLettersButton?.addEventListener('click', () => {
    const target = document.querySelector<HTMLElement>('#lettersScene');
    if (!target) return;
    portal.setAttribute('aria-hidden', 'true');
    gsap.to(portal, {
      opacity: 0,
      y: -18,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => {
        portal.style.pointerEvents = 'none';
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        window.setTimeout(() => {
          gsap.fromTo(target, { opacity: 0.86 }, { opacity: 1, duration: 0.7, ease: 'power2.out' });
        }, reducedMotion ? 0 : 380);
      },
    });
  });

  const parallax = (event: PointerEvent) => {
    if (reducedMotion || animating || window.matchMedia('(pointer: coarse)').matches) return;
    const bounds = section.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    gsap.to('.console-stage', {
      x: x * 10,
      y: y * -8,
      rotateY: x * -2,
      rotateX: y * 1.5,
      duration: 0.7,
      ease: 'power3.out',
      overwrite: true,
    });
    gsap.to('.console-copy, .console-side-note', {
      x: x * -4,
      duration: 1,
      ease: 'power3.out',
      overwrite: true,
    });
  };

  section.addEventListener('pointermove', parallax, { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        idle.play();
      } else {
        idle.pause();
      }
    });
  }, { threshold: 0.2 });
  io.observe(section);

  gsap.to(glow, {
    scale: 1.12,
    opacity: 0.72,
    duration: 3.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}
