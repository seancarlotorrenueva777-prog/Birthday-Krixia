import './styles/global.css';
import { gsap } from 'gsap';
import { setupBirthday } from './scenes-birthday';
import { setupConsole } from './scenes-console';
import { setupLetters } from './scenes-letters';
import { setupPhotobooth } from './scenes-photobooth';
import { setupTelevision } from './scenes-television';
import { setupEnding } from './scenes-ending';
import { setupDesignEffects } from './design-effects';


const page = document.body.dataset.page;

if (page !== 'entry') setupDesignEffects();

function setupEntry() {
  const yarnBall = document.querySelector<HTMLButtonElement>('#yarnBall');
  const yarnWrap = document.querySelector<HTMLElement>('#yarnWrap');
  const yarnTail = document.querySelector<HTMLElement>('#yarnTail');
  const tinyTag = document.querySelector<HTMLElement>('#tinyTag');
  const transitionWash = document.querySelector<HTMLElement>('#transitionWash');
  const secretStatus = document.querySelector<HTMLElement>('#secretStatus');
  const threadPath = document.querySelector<SVGPathElement>('#threadPath');
  const progress = document.querySelector<HTMLElement>('#chaseProgress');
  const instruction = document.querySelector<HTMLElement>('#chaseInstruction');
  const secretStrawberry = document.querySelector<HTMLElement>('#secretStrawberryArt');

  if (!yarnBall || !yarnWrap || !transitionWash || !secretStatus) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.querySelector<HTMLElement>('.secret-stage');
  const catchCountMax = 5;
  let catchCount = 0;
  let busy = false;
  let started = false;
  let points: Array<{ x: number; y: number }> = [];

  function updateProgress() {
    if (progress) progress.textContent = `THREAD ${catchCount} / ${catchCountMax}`;
    if (instruction && catchCount < catchCountMax) {
      const copy = [
        'catch the yarn before it rolls away',
        'it moved — follow the thread',
        'keep going… it is leading somewhere',
        'almost there… one more little chase',
        'you found the final loose end',
      ];
      instruction.textContent = copy[Math.min(catchCount, copy.length - 1)];
    }
  }

  function getTarget(index: number) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const edgeX = Math.min(270, Math.max(150, vw * 0.23));
    const edgeY = Math.min(180, Math.max(110, vh * 0.18));
    const patterns = [
      { x: -edgeX, y: -edgeY * 0.95 },
      { x: edgeX, y: -edgeY * 0.4 },
      { x: edgeX * 0.9, y: edgeY * 1.1 },
      { x: -edgeX * 0.95, y: edgeY * 0.85 },
      { x: -edgeX * 0.15, y: -edgeY * 0.05 },
    ];
    const fallback = patterns[index % patterns.length];
    return {
      x: Math.max(-vw * 0.34, Math.min(vw * 0.34, fallback.x)),
      y: Math.max(-vh * 0.3, Math.min(vh * 0.3, fallback.y)),
    };
  }

  function drawThread(nextX: number, nextY: number) {
    if (!threadPath) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const centerX = vw / 2;
    const centerY = vh / 2;
    points.push({ x: centerX + nextX, y: centerY + nextY });
    const visible = points.slice(-7);
    if (visible.length < 2) return;
    const d = visible
      .map((point, i) => {
        const x = (point.x / vw) * 100;
        const y = (point.y / vh) * 100;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
    threadPath.setAttribute('d', d);
  }

  function createThreadSpark(x: number, y: number) {
    const spark = document.createElement('span');
    spark.className = 'thread-spark';
    spark.textContent = ['✦', '✧', '·', '♡'][catchCount % 4];
    spark.style.left = `${50 + (x / window.innerWidth) * 100}%`;
    spark.style.top = `${50 + (y / window.innerHeight) * 100}%`;
    document.querySelector('.secret-stage')?.appendChild(spark);
    gsap.fromTo(spark,
      { opacity: 0, scale: 0.2, y: 8 },
      { opacity: 1, scale: 1, y: -10, duration: 0.35, ease: 'back.out(2)', onComplete: () => {
        gsap.to(spark, { opacity: 0, y: -28, duration: 0.65, ease: 'power2.in', onComplete: () => spark.remove() });
      } },
    );
  }

  function moveYarn() {
    if (busy || catchCount >= catchCountMax) return;
    busy = true;
    catchCount += 1;
    updateProgress();

    const target = getTarget(catchCount - 1);
    drawThread(target.x, target.y);
    createThreadSpark(target.x, target.y);

    const direction = target.x >= 0 ? 1 : -1;
    gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => { busy = false; },
    })
      .to(yarnBall, {
        scale: 0.86,
        rotate: direction * 22,
        duration: 0.12,
        ease: 'power2.in',
      })
      .to(yarnWrap, {
        x: target.x,
        y: target.y,
        rotate: direction * 5,
        duration: 0.9,
        ease: 'power3.inOut',
      })
      .to(yarnBall, {
        scale: 1,
        rotate: direction * -8,
        duration: 0.38,
        ease: 'back.out(1.9)',
      })
      .to('.yarn-gloss', { x: 8 * direction, y: -5, duration: 0.25 }, '<')
      .call(() => {
        if (tinyTag) {
          gsap.fromTo(tinyTag, { opacity: 0, y: 3 }, { opacity: 1, y: -4, duration: 0.25, ease: 'power2.out' });
        }
      });

    if (catchCount === catchCountMax) {
      window.setTimeout(startFinalRoll, 1000);
    }
  }

  function startFinalRoll() {
    if (!stage || document.body.classList.contains('transitioning')) return;
    document.body.classList.add('transitioning');
    yarnBall.disabled = true;
    busy = true;
    if (instruction) instruction.textContent = 'the secret is opening…';
    if (progress) progress.textContent = 'SECRET FOUND ✦';

    const flash = transitionWash;

    gsap.to('.entry-glow, .scrap, .secret-spark, .secret-orbit, .entry-footer', {
      opacity: 0,
      scale: 1.18,
      duration: 0.45,
      stagger: 0.02,
      ease: 'power2.in',
    });

    // The yarn still completes the interaction, but the page change itself is a
    // clean burst of light rather than another visible thread crossing the screen.
    gsap.to(yarnWrap, { opacity: 0, scale: 0.92, duration: 0.38, ease: 'power2.in' });
    if (yarnTail) gsap.to(yarnTail, { opacity: 0, duration: 0.25, ease: 'power2.in' });

    if (reducedMotion) {
      flash.style.opacity = '1';
      window.sessionStorage.setItem('fromEntry', 'true');
      window.location.href = 'birthday.html';
      return;
    }

    const flashTl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onStart: () => {
        secretStatus.textContent = 'A little flash opens the next memory.';
        window.sessionStorage.setItem('fromEntry', 'true');
      },
      onComplete: () => {
        window.location.href = 'birthday.html';
      },
    });

    flashTl
      .set(flash, { scale: 0.05, opacity: 0 })
      .to(flash, { scale: 0.45, opacity: 0.45, duration: 0.16, ease: 'power2.out' })
      .to(flash, { scale: 4.8, opacity: 1, duration: 0.46, ease: 'power4.in' })
      .to(flash, { opacity: 1, duration: 0.24 })
      .to(flash, { scale: 5.35, duration: 0.16, ease: 'power2.in' });
  }

  updateProgress();

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from('.secret-stage', { opacity: 0, scale: 0.98, duration: 0.95 })
    .from('.secret-copy', { opacity: 0, y: 22, duration: 0.7 }, '-=0.6')
    .from(yarnBall, { opacity: 0, scale: 0.55, rotate: -24, duration: 1.1, ease: 'back.out(1.5)' }, '-=0.45')
    .from(secretStrawberry || [], { opacity: 0, scale: 0.72, rotate: -10, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.82')
    .from('.secret-spark, .scrap', { opacity: 0, scale: 0, duration: 0.45, stagger: 0.07, ease: 'back.out(2)' }, '-=0.65');

  gsap.to(yarnBall, {
    y: -10,
    rotate: 2,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  if (secretStrawberry) {
    gsap.to(secretStrawberry, {
      y: -9,
      rotate: 4,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  gsap.to('.yarn-ground', {
    scaleX: 0.82,
    opacity: 0.5,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.secret-orbit', { rotate: 360, duration: 28, repeat: -1, ease: 'none' });
  gsap.to('.spark-one', { y: -13, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.spark-two', { y: 10, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.glow-one', { scale: 1.12, opacity: 0.62, duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.glow-two', { scale: 0.92, opacity: 0.45, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  yarnBall.addEventListener('pointerenter', () => {
    if (document.body.classList.contains('transitioning')) return;
    gsap.to(yarnBall, { scale: 1.07, rotate: -2, duration: 0.35, ease: 'power2.out' });
    gsap.to('.yarn-tail', { opacity: 1, duration: 0.25 });
    if (tinyTag) gsap.to(tinyTag, { opacity: 1, y: -4, duration: 0.35 });
  });

  yarnBall.addEventListener('pointerleave', () => {
    if (document.body.classList.contains('transitioning')) return;
    gsap.to(yarnBall, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1, .4)' });
    gsap.to('.yarn-tail', { opacity: 0.9, duration: 0.25 });
  });

  yarnBall.addEventListener('pointerdown', () => {
    gsap.to(yarnBall, { scale: 0.94, duration: 0.1 });
  });

  yarnBall.addEventListener('pointerup', () => {
    if (!document.body.classList.contains('transitioning')) {
      gsap.to(yarnBall, { scale: 1.04, duration: 0.22, ease: 'back.out(2)' });
    }
  });

  yarnBall.addEventListener('click', () => {
    if (document.body.classList.contains('transitioning') || busy) return;
    if (catchCount < catchCountMax) {
      moveYarn();
      return;
    }
    startFinalRoll();
  });

  window.addEventListener('pointermove', (event) => {
    if (document.body.classList.contains('transitioning') || busy) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 5;
    const damp = catchCount > 0 ? 0.45 : 1;
    gsap.to('.entry-glow', { x: x * 1.8, y: y * 1.8, duration: 1.1, ease: 'power3.out', overwrite: true });
    gsap.to('.scrap-three', { x: x * 0.7, y: y * 0.5, duration: 1.2, ease: 'power3.out', overwrite: true });
    if (secretStrawberry) {
      gsap.to(secretStrawberry, { x: x * 1.7, y: y * 0.9, rotate: x * 1.5 + 4, duration: 1.05, ease: 'power3.out', overwrite: true });
    }
    if (catchCount === 0) {
      gsap.to(yarnWrap, { x: x * damp, y: y * damp, duration: 0.8, ease: 'power3.out', overwrite: true });
    }
  });
}


if (page === 'entry') setupEntry();
if (page === 'birthday') {
  setupBirthday();
  setupConsole();
  setupLetters();
  setupPhotobooth();
  setupTelevision();
  setupEnding();
}
