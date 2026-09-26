import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function setupBirthday(): void {
  const transition = document.querySelector<HTMLElement>('#birthdayTransition');
  const fromEntry = window.sessionStorage.getItem('fromEntry') === 'true';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.querySelector<HTMLElement>('#birthdayPage');

  if (!page) return;
  if (fromEntry) window.sessionStorage.removeItem('fromEntry');

  const hero = document.querySelector<HTMLElement>('#birthdayHero');
  const object = document.querySelector<HTMLElement>('#birthdayObject');
  const cakeArt = document.querySelector<HTMLElement>('#birthdayCakeArt');
  const cinnaArt = document.querySelector<HTMLElement>('.hero-cinna-design');

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (fromEntry && transition && !reducedMotion) {
    gsap.set(transition, { opacity: 1, scale: 1.12 });
    gsap.timeline({ delay: 0.02 })
      .to(transition, { scale: 0.56, opacity: 0.78, duration: 0.18, ease: 'power2.out' })
      .to(transition, { scale: 0, opacity: 0, duration: 0.66, ease: 'power4.out' });
  } else {
    if (transition) gsap.set(transition, { opacity: 0, scale: 0 });
  }

  intro
    .from('.birthday-topbar', { y: -18, opacity: 0, duration: 0.6 })
    .from('.birthday-eyebrow', { y: 18, opacity: 0, duration: 0.45 }, '-=0.28')
    .from('.title-kicker', { y: 12, opacity: 0, duration: 0.35 }, '-=0.22')
    .from('.line-happy', { y: 70, opacity: 0, rotateX: -25, duration: 0.72 }, '-=0.08')
    .from('.line-birthday', { y: 70, opacity: 0, rotateX: -25, duration: 0.72 }, '-=0.48')
    .from('.line-krisha', { y: 72, opacity: 0, rotateX: -25, duration: 0.82, ease: 'back.out(1.3)' }, '-=0.5')
    .from('.birthday-subtitle', { y: 22, opacity: 0, duration: 0.55 }, '-=0.28')
    .from('.birthday-meta-row .meta-chip', { y: 10, opacity: 0, duration: 0.35, stagger: 0.08 }, '-=0.28')
    .from('.birthday-object', { scale: 0.74, opacity: 0, rotate: 7, duration: 1.05, ease: 'back.out(1.4)' }, '-=0.7')
    .from('.object-caption', { y: 12, opacity: 0, duration: 0.38 }, '-=0.44')
    .from('#birthdayScrollHint', { y: 12, opacity: 0, duration: 0.4 }, '-=0.3');

  if (reducedMotion) return;

  // Soft object life: the cake settles into the scene while the character breathes beside it.
  if (cakeArt) {
    gsap.to(cakeArt, {
      y: -12,
      rotate: -2,
      duration: 2.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }
  if (cinnaArt) {
    gsap.to(cinnaArt, {
      y: -10,
      rotate: 2,
      duration: 3.35,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }
  gsap.to('.flower-a', { y: -11, rotate: 5, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.flower-b', { y: 10, rotate: -7, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.heart-a', { y: -12, rotate: -4, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.heart-b', { y: 9, rotate: 4, duration: 3.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.paper-loop.loop-left', { rotate: 8, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.paper-loop.loop-right', { rotate: -7, duration: 5.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  if (hero) {
    gsap.to('.birthday-copy', {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: -110,
      opacity: 0.16,
      ease: 'none',
    });

    gsap.to(object, {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: 110,
      x: 35,
      rotate: 6,
      scale: 0.88,
      ease: 'none',
    });

    gsap.to('.hero-thread-line', {
      scrollTrigger: {
        trigger: hero,
        start: 'top 10%',
        end: 'bottom top',
        scrub: 0.8,
      },
      scaleY: 1,
      opacity: 1,
      ease: 'none',
    });

    gsap.to('.birthday-glow', {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: 100,
      scale: 1.18,
      ease: 'none',
    });
  }

  gsap.from('.bridge-card.card-left', {
    scrollTrigger: {
      trigger: '.memory-bridge',
      start: 'top 78%',
      toggleActions: 'play none none reverse',
    },
    x: -70,
    opacity: 0,
    rotate: -4,
    duration: 0.9,
    ease: 'power3.out',
  });

  gsap.from('.bridge-card.card-right', {
    scrollTrigger: {
      trigger: '.memory-bridge',
      start: 'top 78%',
      toggleActions: 'play none none reverse',
    },
    x: 70,
    opacity: 0,
    rotate: 4,
    duration: 0.9,
    ease: 'power3.out',
  });

  gsap.from('.bridge-center', {
    scrollTrigger: {
      trigger: '.memory-bridge',
      start: 'top 72%',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  });

  gsap.fromTo('.bridge-thread-ball',
    { xPercent: -50, x: '-6vw', y: 0 },
    {
      x: '112vw',
      scrollTrigger: {
        trigger: '.memory-bridge',
        start: 'top 80%',
        end: 'bottom 28%',
        scrub: 1.2,
      },
      ease: 'none',
    },
  );

  gsap.from('.next-note', {
    scrollTrigger: {
      trigger: '.birthday-next',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 55,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  });

  gsap.to('.next-thread span', {
    x: 'calc(100% - 38px)',
    scrollTrigger: {
      trigger: '.birthday-next',
      start: 'top 82%',
      end: 'bottom 45%',
      scrub: 1,
    },
    ease: 'none',
  });


}
