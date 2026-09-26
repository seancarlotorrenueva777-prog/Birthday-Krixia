import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { letters } from './data/letters';

gsap.registerPlugin(ScrollTrigger);

export function setupLetters(): void {
  const scene = document.querySelector<HTMLElement>('#lettersScene');
  const desk = document.querySelector<HTMLElement>('#letterDesk');
  const reader = document.querySelector<HTMLElement>('#letterReader');
  const paper = document.querySelector<HTMLElement>('#letterPaper');
  const closeButton = document.querySelector<HTMLButtonElement>('#closeLetterButton');
  const progress = document.querySelector<HTMLElement>('#lettersProgress');
  const next = document.querySelector<HTMLElement>('#lettersNext');
  const nextButton = document.querySelector<HTMLButtonElement>('#openPhotoboothButton');
  const paperKicker = document.querySelector<HTMLElement>('#letterPaperKicker');
  const paperTitle = document.querySelector<HTMLElement>('#letterPaperTitle');
  const paperMessage = document.querySelector<HTMLElement>('#letterPaperMessage');
  const specialReveal = document.querySelector<HTMLElement>('#specialReveal');
  const threadBall = document.querySelector<HTMLElement>('#lettersThreadBall');

  if (!scene || !desk || !reader || !paper || !closeButton || !progress || !next || !nextButton || !paperKicker || !paperTitle || !paperMessage || !specialReveal || !threadBall) return;

  const envelopeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.envelope'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const openedIds = new Set<number>();
  let activeId: number | null = null;
  let opening = false;

  const updateProgress = () => {
    const count = openedIds.size;
    progress.textContent = `${count} / 5 LETTERS OPENED`;
    if (count === 5) {
      gsap.to(next, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' });
      next.setAttribute('aria-hidden', 'false');
    }
  };

  const openReader = (id: number, button: HTMLButtonElement) => {
    if (opening) return;
    const item = letters.find((letter) => letter.id === id);
    if (!item) return;

    opening = true;
    activeId = id;
    openedIds.add(id);
    updateProgress();

    envelopeButtons.forEach((envelope) => {
      envelope.setAttribute('aria-disabled', 'true');
    });

    button.classList.add('is-opening');
    desk.classList.add('is-reading');
    reader.setAttribute('aria-hidden', 'false');

    paperKicker.textContent = item.special ? `A SECRET THREAD · ${item.friendName.toUpperCase()}` : `${item.title.toUpperCase()} · ${item.friendName.toUpperCase()}`;
    paperTitle.textContent = item.special ? 'You found the little secret, Krixia.' : `For Krixia · From ${item.friendName}`;
    paperMessage.textContent = item.message;
    specialReveal.setAttribute('aria-hidden', String(!item.special));
    specialReveal.classList.toggle('is-special', Boolean(item.special));

    gsap.set(reader, { opacity: 0, pointerEvents: 'none' });
    gsap.set(paper, { y: 90, scale: 0.78, rotate: id % 2 === 0 ? -3 : 3, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        opening = false;
        envelopeButtons.forEach((envelope) => envelope.removeAttribute('aria-disabled'));
      },
    });

    tl.to(button, { y: -28, scale: 1.06, rotate: id % 2 === 0 ? -2 : 2, duration: 0.25, ease: 'power2.out' })
      .to(button.querySelector('.envelope-flap'), { rotateX: 168, transformOrigin: '50% 100%', duration: 0.46, ease: 'power3.inOut' }, '-=0.08')
      .to(reader, { opacity: 1, pointerEvents: 'auto', duration: 0.3 }, '-=0.2')
      .to(paper, { y: 0, scale: 1, rotate: 0, opacity: 1, duration: 0.72, ease: 'back.out(1.2)' }, '-=0.14')
      .fromTo('.letter-paper-kicker, #letterPaperTitle, .letter-paper-rule, #letterPaperMessage, .paper-signature',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.38, stagger: 0.08, ease: 'power3.out' },
        '-=0.42',
      );

    if (item.special) {
      tl.fromTo(specialReveal,
        { y: 16, scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.52, ease: 'back.out(1.4)' },
        '-=0.06',
      );
    }

    if (!reducedMotion && item.special) {
      tl.to('.special-spark', { opacity: 1, scale: 1.2, yoyo: true, repeat: 1, duration: 0.23, stagger: 0.08 }, '-=0.28');
    }
  };

  const closeReader = () => {
    if (opening || activeId === null) return;
    opening = true;

    const currentButton = document.querySelector<HTMLButtonElement>(`.envelope[data-letter-id="${activeId}"]`);
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        reader.setAttribute('aria-hidden', 'true');
        reader.style.pointerEvents = 'none';
        desk.classList.remove('is-reading');
        currentButton?.classList.remove('is-opening');
        envelopeButtons.forEach((envelope) => envelope.removeAttribute('aria-disabled'));
        opening = false;
        activeId = null;
      },
    });

    tl.to('.letter-paper-kicker, #letterPaperTitle, .letter-paper-rule, #letterPaperMessage, .special-reveal, .paper-signature', {
      y: -10,
      opacity: 0,
      duration: 0.2,
      stagger: 0.03,
    })
      .to(paper, { y: 30, scale: 0.92, rotate: -2, opacity: 0, duration: 0.38 }, '-=0.05')
      .to(reader, { opacity: 0, duration: 0.25 }, '-=0.16')
      .to(currentButton, { y: 0, scale: 1, rotate: 0, duration: 0.28, ease: 'back.out(1.5)' }, '-=0.1');
  };

  envelopeButtons.forEach((button) => {
    const id = Number(button.dataset.letterId);
    button.addEventListener('pointerenter', () => {
      if (opening || window.matchMedia('(pointer: coarse)').matches) return;
      gsap.to(button, { y: -8, rotate: id % 2 === 0 ? -2.5 : 2.5, scale: 1.025, duration: 0.28, ease: 'power2.out' });
    });
    button.addEventListener('pointerleave', () => {
      if (opening || button.classList.contains('is-opening')) return;
      gsap.to(button, { y: 0, rotate: 0, scale: 1, duration: 0.38, ease: 'power2.out' });
    });
    button.addEventListener('click', () => openReader(id, button));
  });

  nextButton.addEventListener('click', () => {
    const target = document.querySelector<HTMLElement>('#photoboothScene');
    if (!target) return;
    nextButton.disabled = true;
    gsap.to(next, { opacity: 0, y: -18, duration: 0.35, ease: 'power2.in', onComplete: () => {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => {
        gsap.fromTo(target, { opacity: 0.88, y: 18 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' });
      }, reducedMotion ? 0 : 420);
    }});
  });

  closeButton.addEventListener('click', closeReader);
  reader.addEventListener('click', (event) => {
    if (event.target === reader.querySelector('.reader-backdrop')) closeReader();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && reader.getAttribute('aria-hidden') === 'false') closeReader();
  });

  if (!reducedMotion) {
    gsap.from('.letters-header > *', {
      scrollTrigger: { trigger: scene, start: 'top 78%', toggleActions: 'play none none reverse' },
      y: 24,
      opacity: 0,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power3.out',
    });

    gsap.from('.letter-desk', {
      scrollTrigger: { trigger: desk, start: 'top 80%', toggleActions: 'play none none reverse' },
      y: 70,
      opacity: 0,
      scale: 0.94,
      duration: 0.9,
      ease: 'back.out(1.25)',
    });

    gsap.from('.envelope', {
      scrollTrigger: { trigger: desk, start: 'top 72%', toggleActions: 'play none none reverse' },
      y: 40,
      opacity: 0,
      rotate: (index) => (index % 2 === 0 ? -4 : 4),
      duration: 0.65,
      stagger: 0.11,
      ease: 'back.out(1.4)',
    });

    gsap.to(threadBall, {
      x: 'calc(100vw - 42px)',
      scrollTrigger: { trigger: scene, start: 'top 75%', end: 'bottom 26%', scrub: 1.1 },
      ease: 'none',
    });

    gsap.to('.desk-yarn-loop', { rotate: 8, y: -8, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.desk-sticker', { y: -10, rotate: 5, duration: 3.8, repeat: -1, yoyo: true, stagger: 0.35, ease: 'sine.inOut' });
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    scene.addEventListener('pointermove', (event) => {
      if (reducedMotion || opening) return;
      const rect = desk.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to('.desk-sticker, .desk-yarn-loop', { x: x * 5, y: y * -4, duration: 0.8, ease: 'power3.out', overwrite: true });
    }, { passive: true });
  }

  updateProgress();
}
