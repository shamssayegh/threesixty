const carousel = document.querySelector('.carousel');

if (carousel) {
  const items = Array.from(carousel.querySelectorAll('.testimonial'));
  const prevButton = carousel.querySelector('.carousel-btn.prev');
  const nextButton = carousel.querySelector('.carousel-btn.next');
  const intervalMs = 5000;
  let activeIndex = 0;
  let timerId = null;
  let touchStartX = 0;

  const applyClasses = () => {
    items.forEach((item, index) => {
      item.classList.remove('is-active', 'is-next', 'is-prev');
      const offset = (index - activeIndex + items.length) % items.length;
      if (offset === 0) {
        item.classList.add('is-active');
      } else if (offset === 1) {
        item.classList.add('is-next');
      } else if (offset === items.length - 1) {
        item.classList.add('is-prev');
      }
    });
  };

  const goNext = () => {
    activeIndex = (activeIndex + 1) % items.length;
    applyClasses();
  };

  const goPrev = () => {
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    applyClasses();
  };

  const startAutoplay = () => {
    if (timerId || items.length < 2) return;
    timerId = setInterval(goNext, intervalMs);
  };

  const stopAutoplay = () => {
    if (!timerId) return;
    clearInterval(timerId);
    timerId = null;
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      stopAutoplay();
      goPrev();
      startAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      stopAutoplay();
      goNext();
      startAutoplay();
    });
  }

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  carousel.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    startAutoplay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  applyClasses();
  startAutoplay();
}

// Marquee text duplicator - creates seamless infinite scroll
const marquees = document.querySelectorAll('.divider-marquee-track');

marquees.forEach(track => {
  const text = track.querySelector('.divider-text');
  if (!text) return;

  const originalText = text.textContent.trim();
  const originalClass = text.className;

  // Calculate how many copies needed to fill viewport, then double it for seamless -50% loop
  const textWidth = text.offsetWidth;
  const viewportWidth = window.innerWidth;
  const copiesForViewport = Math.ceil(viewportWidth / textWidth) + 1;
  const totalCopies = copiesForViewport * 2; // Double for seamless loop

  track.innerHTML = '';

  for (let i = 0; i < totalCopies; i++) {
    const span = document.createElement('span');
    span.className = originalClass;
    span.innerHTML = originalText + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    track.appendChild(span);
  }
});