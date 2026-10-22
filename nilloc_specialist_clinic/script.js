(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  const yearNode = document.querySelector('#year');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  // Demo-only interaction: connect this form to a real booking API or form service.
  const form = document.querySelector('#appointment-form');
  const note = document.querySelector('#form-note');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    note.textContent = `Thanks${name ? `, ${name}` : ''}! This demo form is working locally, but it is not yet connected to a clinic booking system.`;
    note.classList.add('form-success');
  });

  // Subtle reveal-on-scroll effect; content remains visible when reduced motion is enabled.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.about-visual, .about-copy, .service-card, .appointment > *');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealItems.forEach(item => item.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  }


  // Homepage review carousel: controls work on touch, mobile and desktop.
  const reviewsTrack = document.querySelector('#reviews-track');
  if (reviewsTrack) {
    const originalCards = Array.from(reviewsTrack.querySelectorAll('.review-card'));
    const cardsCount = originalCards.length;
    originalCards.forEach(card => { const clone = card.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); reviewsTrack.appendChild(clone); });
    const dots = Array.from(document.querySelectorAll('[data-review-index]'));
    const prev = document.querySelector('#reviews-prev');
    const next = document.querySelector('#reviews-next');
    let index = 0;
    const updateReviews = (animate = true) => {
      const gap = parseFloat(getComputedStyle(reviewsTrack).columnGap || getComputedStyle(reviewsTrack).gap) || 0;
      const cardWidth = originalCards[0]?.getBoundingClientRect().width || 0;
      reviewsTrack.style.transition = animate ? 'transform .5s cubic-bezier(.2,.75,.25,1)' : 'none';
      reviewsTrack.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    };
    const moveReviews = direction => {
      if (direction < 0 && index === 0) {
        index = cardsCount;
        updateReviews(false);
        requestAnimationFrame(() => { index = cardsCount - 1; updateReviews(true); });
      } else if (direction > 0 && index === cardsCount - 1) {
        index = cardsCount;
        updateReviews(true);
        window.setTimeout(() => { index = 0; updateReviews(false); }, 520);
      } else { index = (index + direction + cardsCount) % cardsCount; updateReviews(); }
    };
    prev?.addEventListener('click', () => moveReviews(-1));
    next?.addEventListener('click', () => moveReviews(1));
    dots.forEach(dot => dot.addEventListener('click', () => { index = Number(dot.dataset.reviewIndex) % cardsCount; updateReviews(); }));
    window.addEventListener('resize', () => updateReviews(false), { passive: true });
    let touchStart = 0;
    reviewsTrack.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, { passive: true });
    reviewsTrack.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStart;
      if (Math.abs(dx) > 45) moveReviews(dx < 0 ? 1 : -1);
    }, { passive: true });
    updateReviews(false);
  }

  // Projects page: category filters and progressive reveal button.
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  if (projectCards.length) {
    const filterButtons = Array.from(document.querySelectorAll('.project-filter'));
    const loadMore = document.querySelector('#projects-load-more');
    let activeFilter = 'all';
    let expanded = false;
    const applyProjects = () => {
      let visibleExtra = 0;
      projectCards.forEach(card => {
        const matches = activeFilter === 'all' || card.dataset.category === activeFilter;
        const isExtra = card.classList.contains('project-extra');
        const show = matches && (expanded || !isExtra);
        card.hidden = !show;
        if (show && isExtra) visibleExtra++;
      });
      if (loadMore) {
        const hasHiddenMatching = projectCards.some(card => card.classList.contains('project-extra') && (activeFilter === 'all' || card.dataset.category === activeFilter));
        loadMore.hidden = expanded || !hasHiddenMatching;
      }
    };
    filterButtons.forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      expanded = false;
      filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
      applyProjects();
    }));
    loadMore?.addEventListener('click', () => { expanded = true; applyProjects(); });
    applyProjects();
  }

  // Gallery pagination + accessible image lightbox.
  const galleryGrid = document.querySelector('#gallery-grid');
  if (galleryGrid) {
    const originalCards = Array.from(galleryGrid.querySelectorAll('.gallery-card'));

    // Keep nine photographs per gallery page, as in the reference design.
    // Add another set of photos so the numbered pages and arrows have real destinations.
    const extraPhotos = [
      ['https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=700&q=85', 'Preventive Health'],
      ['https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=700&q=85', 'Clinical Teamwork'],
      ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=85', 'Patient Consultation'],
      ['https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=85', 'Compassionate Care'],
      ['https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=700&q=85', 'Diagnostic Services'],
      ['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=700&q=85', 'Clinic Facilities'],
      ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=700&q=85', 'Healthcare Professionals'],
      ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=85', 'Wellness and Care'],
      ['https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=85', 'Experienced Doctors'],
      ['https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=700&q=85', 'Our Medical Team'],
      ['https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=85', 'Dental Care'],
      ['https://images.unsplash.com/photo-1583912267550-d4c5f6e4f8a0?auto=format&fit=crop&w=700&q=85', 'Care That Connects'],
      ['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=700&q=85', 'Modern Medicine'],
      ['https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=700&q=85', 'Medical Research'],
      ['https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=700&q=85', 'Patient Support'],
      ['https://images.unsplash.com/photo-1576091160501-bbe57469278b?auto=format&fit=crop&w=700&q=85', 'Everyday Healthcare'],
      ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=85', 'Health Professionals'],
      ['https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=85', 'Care in Action']
    ];

    extraPhotos.forEach(([src, title]) => {
      const template = originalCards[0];
      if (!template) return;
      const card = template.cloneNode(true);
      const image = card.querySelector('img');
      const caption = card.querySelector('.gallery-card-caption span');
      image.src = src;
      image.alt = title;
      card.href = src.replace('w=700', 'w=1600').replace('q=85', 'q=90');
      card.setAttribute('aria-label', `View ${title} photograph`);
      if (caption) caption.textContent = title;
      galleryGrid.appendChild(card);
    });

    const galleryCards = Array.from(galleryGrid.querySelectorAll('.gallery-card'));
    const pageButtons = Array.from(document.querySelectorAll('[data-gallery-page]'));
    const prevButton = document.querySelector('[data-gallery-prev]');
    const nextButton = document.querySelector('[data-gallery-next]');
    const status = document.querySelector('#gallery-page-status');
    const perPage = 9;
    const pageCount = Math.ceil(galleryCards.length / perPage);
    let currentPage = 0;
    let activeImageIndex = 0;
    let lastFocusedElement = null;

    // Build the lightbox in JavaScript so the page remains easy to edit in HTML.
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Gallery image viewer');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close image viewer">×</button>
      <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">‹</button>
      <figure class="lightbox-figure">
        <img class="lightbox-image" alt="">
        <figcaption class="lightbox-caption"></figcaption>
      </figure>
      <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">›</button>
      <div class="lightbox-counter" aria-live="polite"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    const getCardTitle = (card) => {
      const caption = card.querySelector('.gallery-card-caption span');
      return caption?.textContent?.trim() || card.querySelector('img')?.alt || 'Healthca gallery image';
    };

    const showLightboxImage = (index) => {
      activeImageIndex = (index + galleryCards.length) % galleryCards.length;
      const card = galleryCards[activeImageIndex];
      const thumbnail = card.querySelector('img');
      lightboxImage.src = card.href || thumbnail.src;
      lightboxImage.alt = thumbnail.alt || getCardTitle(card);
      lightboxCaption.textContent = getCardTitle(card);
      lightboxCounter.textContent = `${String(activeImageIndex + 1).padStart(2, '0')} / ${String(galleryCards.length).padStart(2, '0')}`;
      lightboxPrev.disabled = galleryCards.length < 2;
      lightboxNext.disabled = galleryCards.length < 2;
    };

    const openLightbox = (index) => {
      lastFocusedElement = document.activeElement;
      showLightboxImage(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      lightboxImage.removeAttribute('src');
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
    };

    const renderGalleryPage = (page, shouldScroll = false) => {
      currentPage = Math.min(Math.max(page, 0), pageCount - 1);
      galleryCards.forEach((card, index) => {
        const visible = index >= currentPage * perPage && index < (currentPage + 1) * perPage;
        card.classList.toggle('is-hidden', !visible);
        card.setAttribute('tabindex', visible ? '0' : '-1');
        card.setAttribute('aria-hidden', String(!visible));
      });
      pageButtons.forEach((button, index) => {
        const isCurrent = index === currentPage;
        button.classList.toggle('is-current', isCurrent);
        if (isCurrent) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
        button.hidden = index >= pageCount;
      });
      if (prevButton) prevButton.disabled = currentPage === 0;
      if (nextButton) nextButton.disabled = currentPage >= pageCount - 1;
      if (status) status.textContent = `Showing gallery page ${currentPage + 1} of ${pageCount}`;
      if (shouldScroll) {
        galleryGrid.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }
    };

    galleryCards.forEach((card, index) => {
      card.addEventListener('click', (event) => {
        event.preventDefault();
        openLightbox(index);
      });
    });

    pageButtons.forEach(button => button.addEventListener('click', () => {
      renderGalleryPage(Number(button.dataset.galleryPage), true);
    }));
    prevButton?.addEventListener('click', () => renderGalleryPage(currentPage - 1, true));
    nextButton?.addEventListener('click', () => renderGalleryPage(currentPage + 1, true));
    lightboxPrev.addEventListener('click', () => showLightboxImage(activeImageIndex - 1));
    lightboxNext.addEventListener('click', () => showLightboxImage(activeImageIndex + 1));
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', event => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showLightboxImage(activeImageIndex - 1);
      if (event.key === 'ArrowRight') showLightboxImage(activeImageIndex + 1);
      if (event.key === 'Tab') {
        // Keep keyboard focus within the image viewer.
        const focusable = [closeButton, lightboxPrev, lightboxNext];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    renderGalleryPage(0);
  }

})();
