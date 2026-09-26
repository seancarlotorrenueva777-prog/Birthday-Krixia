import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { photos, type MemoryPhoto } from './data/photos';

gsap.registerPlugin(ScrollTrigger);

export function setupPhotobooth(): void {
  const scene = document.querySelector<HTMLElement>('#photoboothScene');
  const booth = document.querySelector<HTMLElement>('#photobooth');
  const takeButton = document.querySelector<HTMLButtonElement>('#takePhotoButton');
  const boothFlash = document.querySelector<HTMLElement>('#boothFlash');
  const status = document.querySelector<HTMLElement>('#photoboothStatus');
  const printSlot = document.querySelector<HTMLElement>('#photoPrintSlot');
  const livePhoto = document.querySelector<HTMLElement>('#livePhoto');
  const printedStack = document.querySelector<HTMLElement>('#printedPhotoStack');
  const nextRoom = document.querySelector<HTMLElement>('#photoboothNext');
  const counter = document.querySelector<HTMLElement>('#photoCounter');
  const threadBall = document.querySelector<HTMLElement>('#photoboothThreadBall');
  const enterTelevisionButton = document.querySelector<HTMLButtonElement>('#enterTelevisionButton');

  if (!scene || !booth || !takeButton || !boothFlash || !status || !printSlot || !livePhoto || !printedStack || !nextRoom || !counter || !threadBall) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let printing = false;
  let photoIndex = 0;

  const viewer = document.createElement('div');
  viewer.className = 'photo-viewer';
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <div class="photo-viewer-backdrop" data-close-photo-viewer></div>
    <figure class="photo-viewer-card" role="dialog" aria-modal="true" aria-labelledby="photoViewerTitle">
      <button class="photo-viewer-close" type="button" aria-label="Close enlarged photo">×</button>
      <div class="photo-viewer-kicker">PRIVATE LITTLE MEMORY</div>
      <div class="photo-viewer-frame"><img id="photoViewerImage" src="" alt="" /></div>
      <figcaption id="photoViewerTitle"></figcaption>
      <div class="photo-viewer-hint">CLICK OUTSIDE OR PRESS ESC TO CLOSE</div>
    </figure>
  `;
  document.body.appendChild(viewer);
  const viewerImage = viewer.querySelector<HTMLImageElement>('#photoViewerImage');
  const viewerTitle = viewer.querySelector<HTMLElement>('#photoViewerTitle');
  const viewerClose = viewer.querySelector<HTMLButtonElement>('.photo-viewer-close');

  const closeViewer = () => {
    if (viewer.getAttribute('aria-hidden') === 'true') return;
    if (reducedMotion) {
      viewer.setAttribute('aria-hidden', 'true');
      viewer.style.opacity = '0';
      document.body.classList.remove('photo-viewer-open');
      return;
    }
    gsap.to(viewer, {
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        viewer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('photo-viewer-open');
      },
    });
  };

  const openViewer = (item: MemoryPhoto) => {
    if (!viewerImage || !viewerTitle) return;
    viewerImage.src = item.src;
    viewerImage.alt = `Birthday memory photo ${item.id}`;
    viewerTitle.textContent = item.caption;
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('photo-viewer-open');
    if (reducedMotion) {
      viewer.style.opacity = '1';
      return;
    }
    gsap.fromTo(viewer, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' });
    gsap.fromTo(viewer.querySelector('.photo-viewer-card'),
      { y: 24, scale: 0.94, rotate: -1 },
      { y: 0, scale: 1, rotate: 0, duration: 0.42, ease: 'back.out(1.5)' },
    );
  };

  viewerClose?.addEventListener('click', closeViewer);
  viewer.querySelector('[data-close-photo-viewer]')?.addEventListener('click', closeViewer);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeViewer();
  });

  const updateCounter = () => {
    counter.textContent = `${photoIndex} / ${photos.length} PHOTOS PRINTED`;
    if (photoIndex >= photos.length) {
      takeButton.disabled = true;
      takeButton.setAttribute('aria-disabled', 'true');
      status.textContent = 'ALL THREE MEMORIES ARE PRINTED ✦';
      gsap.to(nextRoom, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      nextRoom.setAttribute('aria-hidden', 'false');
    }
  };

  const renderLivePhoto = (item: MemoryPhoto) => {
    const image = livePhoto.querySelector<HTMLImageElement>('img');
    const caption = livePhoto.querySelector<HTMLElement>('.live-photo-caption');
    if (!image || !caption) return;
    image.src = item.src;
    image.alt = `Birthday memory photo ${item.id}`;
    image.style.display = 'block';
    livePhoto.classList.remove('is-placeholder');
    caption.textContent = item.caption;
  };

  const createPrintedPhoto = (item: MemoryPhoto, index: number) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'printed-photo';
    card.setAttribute('aria-label', `Open enlarged photo ${index + 1}`);
    card.style.setProperty('--photo-rotate', `${index % 2 === 0 ? -3 : 4}deg`);
    card.innerHTML = `
      <span class="printed-photo-tape" aria-hidden="true"></span>
      <span class="printed-photo-image"><img src="${item.src}" alt="Birthday memory photo ${item.id}" /></span>
      <span class="printed-photo-caption">${item.caption}</span>
    `;

    const image = card.querySelector<HTMLImageElement>('img');
    image?.addEventListener('error', () => card.classList.add('is-placeholder'));

    card.addEventListener('click', () => {
      openViewer(item);
      if (!reducedMotion) {
        gsap.fromTo(card, { y: -10, scale: 1.04, rotate: 0 }, { y: 0, scale: 1, rotate: 'var(--photo-rotate)', duration: 0.45, ease: 'power2.inOut' });
      }
    });

    printedStack.appendChild(card);
    return card;
  };

  const printPhoto = () => {
    if (printing || photoIndex >= photos.length) return;
    printing = true;

    const item = photos[photoIndex];
    renderLivePhoto(item);
    status.textContent = `FLASHING · PRINTING MEMORY ${photoIndex + 1} OF ${photos.length} ✦`;

    gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        const card = createPrintedPhoto(item, photoIndex);
        if (!card) { printing = false; return; }
        const cardRect = card.getBoundingClientRect();
        const slotRect = printSlot.getBoundingClientRect();
        const startX = slotRect.left + slotRect.width / 2 - cardRect.width / 2;
        const startY = slotRect.top - 10;
        const endX = cardRect.left;
        const endY = cardRect.top;

        gsap.set(card, {
          position: 'fixed',
          left: startX,
          top: startY,
          x: 0,
          y: 0,
          xPercent: 0,
          opacity: 1,
          zIndex: 100,
          rotate: -2,
        });
        gsap.to(card, {
          left: endX,
          top: endY,
          duration: 0.95,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(card, { clearProps: 'position,left,top,zIndex,x,y,xPercent,transform' });
            photoIndex += 1;
            updateCounter();
            if (photoIndex < photos.length) status.textContent = 'READY FOR THE NEXT LITTLE MEMORY ✦';
            printing = false;
          },
        });
      },
    })
      .to(takeButton, { scale: 0.92, y: 3, duration: 0.08 })
      .to(takeButton, { scale: 1, y: 0, duration: 0.18, ease: 'back.out(2)' })
      .to(livePhoto, { scale: 1.025, duration: 0.18, ease: 'power2.out' }, '-=0.1')
      .to(boothFlash, { opacity: 1, duration: 0.08 })
      .to(boothFlash, { opacity: 0, duration: 0.28, ease: 'power2.inOut' })
      .to('.photobooth-light-dot', { opacity: 1, scale: 1.18, duration: 0.15, stagger: 0.03 }, '-=0.18')
      .to('.photobooth-light-dot', { opacity: 0.45, scale: 1, duration: 0.22, stagger: 0.03 })
      .to(printSlot, { height: 18, duration: 0.18 })
      .to(printSlot, { height: 8, duration: 0.24, ease: 'power2.inOut' });
  };

  takeButton.addEventListener('click', printPhoto);

  enterTelevisionButton?.addEventListener('click', () => {
    const target = document.querySelector<HTMLElement>('#televisionScene');
    if (!target) return;
    enterTelevisionButton.disabled = true;
    gsap.to(nextRoom, { opacity: 0, y: -18, duration: 0.35, ease: 'power2.in', onComplete: () => {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => {
        gsap.fromTo(target, { opacity: 0.88, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      }, reducedMotion ? 0 : 420);
    }});
  });

  if (!reducedMotion) {
    gsap.from('.photobooth-header > *', {
      y: 26,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: scene, start: 'top 78%', toggleActions: 'play none none reverse' },
    });

    gsap.from('.photobooth-side-note, .photobooth-shell, .photo-stack-area', {
      y: 50,
      opacity: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: booth, start: 'top 78%', toggleActions: 'play none none reverse' },
    });

    gsap.to(threadBall, {
      x: 'calc(100vw - 42px)',
      scrollTrigger: { trigger: scene, start: 'top 78%', end: 'bottom 22%', scrub: 1.1 },
      ease: 'none',
    });
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    booth.addEventListener('pointermove', (event) => {
      if (reducedMotion || printing) return;
      const rect = booth.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to('.photobooth-shell', { x: x * 8, y: y * -5, rotateY: x * -1.2, rotateX: y * 1.0, duration: 0.75, ease: 'power3.out', overwrite: true });
    }, { passive: true });

    booth.addEventListener('pointerleave', () => {
      gsap.to('.photobooth-shell', { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out', overwrite: true });
    });
  }

  updateCounter();
}
