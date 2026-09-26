import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type DesignEl = HTMLElement & {
  dataset: DOMStringMap;
};

function setupDesignEntrance(design: DesignEl, immediate = false): void {
  const floatScale = Number(design.dataset.float ?? '1');
  const startY = immediate ? 10 : 34;
  const startScale = immediate ? 0.98 : 0.76;

  gsap.set(design, {
    opacity: immediate ? 0.94 : 0,
    '--float-y': 0,
    '--entry-y': startY,
    '--px': 0,
    '--py': 0,
    '--design-scale': startScale,
  });

  const reveal = () => {
    gsap.to(design, {
      opacity: 0.96,
      duration: 0.85,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to(design, {
      '--entry-y': 0,
      '--design-scale': 1,
      duration: 1,
      ease: 'back.out(1.35)',
      overwrite: 'auto',
    });

    const halo = design.querySelector<HTMLElement>('.design-halo');
    if (halo) {
      gsap.fromTo(halo,
        { opacity: 0, scale: 0.7 },
        { opacity: 0.8, scale: 1, duration: 1.15, ease: 'power2.out', overwrite: 'auto' },
      );
    }
  };

  if (immediate) {
    reveal();
  } else {
    ScrollTrigger.create({
      trigger: design,
      start: 'top 92%',
      once: true,
      onEnter: reveal,
    });
  }

  if (floatScale > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to(design, {
      '--float-y': 9 * floatScale,
      duration: 3.8 + floatScale,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.25,
      overwrite: false,
    });
  }

  const sheen = design.querySelector<HTMLElement>('.design-sheen');
  if (sheen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(sheen,
      { xPercent: -150, opacity: 0 },
      {
        xPercent: 150,
        opacity: 0.55,
        duration: 1.35,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 4.6 + floatScale,
        delay: 1.4,
      },
    );
  }
}

function setupSceneParallax(scene: HTMLElement): void {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer = scene.querySelector<HTMLElement>('.design-layer');
  if (!layer) return;
  const designs = Array.from(layer.querySelectorAll<DesignEl>('.birthday-design'));
  if (!designs.length) return;

  let raf = 0;
  let targetX = 0;
  let targetY = 0;

  const render = () => {
    raf = 0;
    designs.forEach((design) => {
      const depth = Math.min(28, Math.max(5, Number(design.dataset.depth ?? '12')));
      gsap.to(design, {
        '--px': targetX * depth,
        '--py': targetY * depth * 0.62,
        duration: 0.75,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  };

  scene.addEventListener('pointermove', (event) => {
    const rect = scene.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });

  scene.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });
}

function addSparkles(layer: HTMLElement): void {
  if (layer.querySelector('.design-sparkles')) return;

  const wrap = document.createElement('div');
  wrap.className = 'design-sparkles';
  wrap.setAttribute('aria-hidden', 'true');

  const symbols = ['✦', '✧', '·', '♡', '✦'];
  const positions = [
    ['13%', '22%', '18px'],
    ['86%', '24%', '14px'],
    ['74%', '70%', '11px'],
    ['23%', '78%', '13px'],
    ['52%', '16%', '10px'],
  ];

  positions.forEach(([left, top, size], index) => {
    const spark = document.createElement('span');
    spark.textContent = symbols[index];
    spark.style.left = left;
    spark.style.top = top;
    spark.style.fontSize = size;
    wrap.appendChild(spark);

    gsap.fromTo(spark,
      { opacity: 0, scale: 0.5, y: 5 },
      {
        opacity: index % 2 ? 0.4 : 0.55,
        scale: 1,
        y: -7,
        duration: 1.4 + index * 0.2,
        repeat: -1,
        yoyo: true,
        delay: index * 0.45,
        ease: 'sine.inOut',
      },
    );
  });

  layer.appendChild(wrap);
}

export function setupDesignEffects(): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const designs = Array.from(document.querySelectorAll<DesignEl>('.birthday-design'));
  if (!designs.length) return;

  designs.forEach((design) => {
    setupDesignEntrance(design, reducedMotion || !!design.closest('.design-layer--page00'));
  });

  const sceneSelectors = [
    '.entry-page',
    '.birthday-hero',
    '.memory-bridge',
    '.console-scene',
    '.letters-scene',
    '.photobooth-scene',
    '.television-scene',
    '.ending-scene',
  ];

  sceneSelectors.forEach((selector) => {
    const scene = document.querySelector<HTMLElement>(selector);
    if (scene) setupSceneParallax(scene);
  });

  document.querySelectorAll<HTMLElement>('.design-layer').forEach(addSparkles);
}
