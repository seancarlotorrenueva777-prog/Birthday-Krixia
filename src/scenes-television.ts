import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SOURCE = 'videos/birthday-video.mp4';

export function setupTelevision(): void {
  const scene = document.querySelector<HTMLElement>('#televisionScene');
  const shell = document.querySelector<HTMLElement>('#televisionShell');
  const remote = document.querySelector<HTMLElement>('#remoteCard');
  const powerButton = document.querySelector<HTMLButtonElement>('#remotePowerButton');
  const screen = document.querySelector<HTMLElement>('#tvScreen');
  const staticLayer = document.querySelector<HTMLElement>('#tvStatic');
  const message = document.querySelector<HTMLElement>('#tvMessage');
  const video = document.querySelector<HTMLVideoElement>('#birthdayVideo');
  const fallback = document.querySelector<HTMLElement>('#videoFallback');
  const skipToFinalButton = document.querySelector<HTMLButtonElement>('#skipToFinalButton');
  const status = document.querySelector<HTMLElement>('#televisionStatus');
  const after = document.querySelector<HTMLElement>('#televisionAfter');
  const led = document.querySelector<HTMLElement>('#tvLed');
  const threadBall = document.querySelector<HTMLElement>('#televisionThreadBall');

  if (!scene || !shell || !remote || !powerButton || !screen || !staticLayer || !message || !video || !fallback || !skipToFinalButton || !status || !after || !led || !threadBall) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let powered = false;
  let powering = false;
  let fallbackShown = false;

  const showFallback = () => {
    if (fallbackShown) return;
    fallbackShown = true;
    fallback.setAttribute('aria-hidden', 'false');
    gsap.set(fallback, { opacity: 1 });
    gsap.to(message, { opacity: 0, duration: 0.24, ease: 'power2.out' });
    status.textContent = 'TV READY · ADD YOUR VIDEO FILE ✦';
  };

  const showVideo = () => {
    fallbackShown = false;
    fallback.setAttribute('aria-hidden', 'true');
    gsap.to(fallback, { opacity: 0, duration: 0.22, ease: 'power2.out' });
    gsap.to(message, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(video, { opacity: 1, duration: 0.45, ease: 'power3.out' });
  };

  const revealAfter = () => {
    if (after.getAttribute('aria-hidden') === 'false') return;
    after.setAttribute('aria-hidden', 'false');
    status.textContent = 'THE MEMORY FINISHED · FOLLOW THE THREAD ✦';

    const tl = gsap.timeline();
    tl.to(video, { opacity: 0, duration: 0.45, ease: 'power2.inOut' })
      .to(screen, { filter: 'brightness(.45)', duration: 0.35, ease: 'power2.inOut' }, '-=0.18')
      .to(led, { opacity: 0.35, duration: 0.25 }, '<')
      .to(after, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.72, ease: 'power3.out' }, '+=0.18')
      .call(() => window.dispatchEvent(new Event('krisha:video-ended')));
  };

  const powerOn = () => {
    if (powered || powering) return;
    powering = true;
    powered = true;
    powerButton.disabled = true;
    shell.classList.add('is-on');
    status.textContent = 'POWERING UP… ✦';

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    tl.to(powerButton, { scale: 0.9, y: 3, duration: 0.1, ease: 'power2.in' })
      .to(powerButton, { scale: 1, y: 0, duration: 0.2, ease: 'back.out(2)' })
      .to(led, { opacity: 1, scale: 1.35, duration: 0.2 })
      .to(staticLayer, { opacity: 0.85, duration: 0.09 })
      .to(staticLayer, { opacity: 0.2, duration: 0.13 })
      .to(staticLayer, { opacity: 0.68, duration: 0.08 })
      .to(staticLayer, { opacity: 0.04, duration: 0.24 })
      .to(message, { opacity: 0.5, y: -4, duration: 0.16 })
      .call(() => {
        status.textContent = 'SIGNAL FOUND ✦';
        video.src = VIDEO_SOURCE;
        video.currentTime = 0;
        video.muted = false;
        showVideo();

        const playPromise = video.play();
        if (playPromise) {
          playPromise.catch(() => {
            video.controls = true;
            status.textContent = 'PRESS PLAY ON THE VIDEO ✦';
          });
        }
      })
      .to(shell, { y: -5, duration: 0.5, ease: 'sine.out' })
      .to(shell, { y: 0, duration: 0.6, ease: 'sine.inOut' })
      .call(() => { powering = false; });
  };

  powerButton.addEventListener('click', powerOn);
  skipToFinalButton.addEventListener('click', () => {
    window.dispatchEvent(new Event('krisha:skip-final'));
  });

  video.addEventListener('ended', revealAfter);
  video.addEventListener('error', showFallback);
  video.addEventListener('loadeddata', () => {
    if (powered && video.readyState >= 2) {
      fallback.setAttribute('aria-hidden', 'true');
    }
  });

  if (!reducedMotion) {
    gsap.from('.television-header > *', {
      y: 26,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: scene,
        start: 'top 76%',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.from('.television-stage', {
      y: 80,
      opacity: 0,
      scale: 0.92,
      duration: 1,
      ease: 'back.out(1.22)',
      scrollTrigger: {
        trigger: scene,
        start: 'top 68%',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.from('.remote-area', {
      x: 70,
      opacity: 0,
      rotate: 5,
      duration: 0.8,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: scene,
        start: 'top 62%',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.to(threadBall, {
      x: 'calc(100vw - 44px)',
      scrollTrigger: {
        trigger: scene,
        start: 'top 82%',
        end: 'bottom 22%',
        scrub: 1.1,
      },
      ease: 'none',
    });

    gsap.to('.room-shelf, .tv-floor-shadow', {
      y: -8,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    scene.addEventListener('pointermove', (event) => {
      if (reducedMotion || powering || powered) return;
      const bounds = scene.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      gsap.to('.television-stage', {
        x: x * 8,
        y: y * -5,
        rotateY: x * -1.4,
        rotateX: y * 1.1,
        duration: 0.75,
        ease: 'power3.out',
        overwrite: true,
      });
      gsap.to(remote, {
        x: x * -5,
        y: y * -3,
        rotate: x * 2.4,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: true,
      });
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    if (!powered) gsap.set('.television-stage, #remoteCard', { clearProps: 'transform' });
  });

  fallback.setAttribute('aria-hidden', 'true');
  gsap.set(video, { opacity: 0 });
  gsap.set(after, { opacity: 0, y: 24, pointerEvents: 'none' });
}
