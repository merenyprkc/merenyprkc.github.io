document.addEventListener('DOMContentLoaded', () => {

    // Language Switcher
    const langBtns = document.querySelectorAll('.lang-btn');
    const i18nElements = document.querySelectorAll('[data-i18n]');

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const lang = btn.id === 'lang-tr' ? 'tr' : 'en';

            i18nElements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    el.innerHTML = translations[lang][key];
                    if (el.hasAttribute('data-text')) {
                        // For glitch effect elements, extract only text if there's HTML
                        // But since hero-role has no HTML, straight assignment is fine
                        el.setAttribute('data-text', translations[lang][key]);
                    }
                }
            });
        });
    });

    // Set initial language to match EN translations perfectly on load
    const defaultLangBtn = document.getElementById('lang-en');
    if (defaultLangBtn) {
        defaultLangBtn.click();
    }

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth Scolling for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Project Details Modal
    const modal = document.querySelector('#project-modal');
    const projectCards = document.querySelectorAll('.project-card');
    const closeModalBtn = document.querySelector('.close-modal');

    // Modal Elements
    const modalImage = document.querySelector('#modal-image');
    const modalTitle = document.querySelector('#modal-title');
    const modalTags = document.querySelector('#modal-tags');
    const modalDescription = document.querySelector('#modal-description');
    const modalLinks = document.querySelector('#modal-links');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Extract data from the card
            const imgSrc = card.querySelector('img').src;
            const title = card.querySelector('h3').innerText; // Using innerText to get text without HTML
            const tags = card.querySelector('.tags').innerHTML;
            const links = card.querySelector('.project-links').innerHTML;

            // Try to get content from hidden details div, fallback to data attribute, fallback to short desc
            const detailsDiv = card.querySelector('.project-details');
            const dataDesc = card.getAttribute('data-description');
            const shortDesc = card.querySelector('.project-desc').innerText;

            let description = shortDesc;
            if (detailsDiv) {
                description = detailsDiv.innerHTML;
            } else if (dataDesc) {
                description = dataDesc;
            }

            // Populate Modal
            modalImage.src = imgSrc;
            modalTitle.innerText = title;
            modalTags.innerHTML = tags;
            modalDescription.innerHTML = description;
            modalLinks.innerHTML = links;

            // Show Modal
            modal.showModal();
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal Functions
    function closeProjectModal() {
        modal.close();
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeProjectModal);

    // Close when clicking outside content (backdrop)
    modal.addEventListener('click', (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            closeProjectModal();
        }
    });

    // Flat Carousel Logic
    const carouselCards = document.querySelectorAll('.project-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    
    let currentCarouselIndex = 0; // Treeban starts as active

    // Initialize Dots
    if (dotsContainer && carouselCards.length > 0) {
        carouselCards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === currentCarouselIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentCarouselIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.dot');

    function updateCarousel() {
        if (carouselCards.length === 0) return;
        
        carouselCards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next', 'hidden');
            
            if (index === currentCarouselIndex) {
                card.classList.add('active');
            } else if (index === (currentCarouselIndex - 1 + carouselCards.length) % carouselCards.length) {
                card.classList.add('prev');
            } else if (index === (currentCarouselIndex + 1) % carouselCards.length) {
                card.classList.add('next');
            } else {
                card.classList.add('hidden');
            }
        });

        dots.forEach((dot, index) => {
            if (index === currentCarouselIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselCards.length;
        updateCarousel();
    }

    function prevSlide() {
        currentCarouselIndex = (currentCarouselIndex - 1 + carouselCards.length) % carouselCards.length;
        updateCarousel();
    }

    if (carouselCards.length > 0) {
        updateCarousel();

        if (leftArrow) leftArrow.addEventListener('click', prevSlide);
        if (rightArrow) rightArrow.addEventListener('click', nextSlide);

        // Allow clicking prev/next cards to navigate instead of opening modal
        carouselCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (card.classList.contains('prev')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    prevSlide();
                } else if (card.classList.contains('next')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    nextSlide();
                }
            }, true); // use capture phase
        });
    }

    // Paginated wheel scroll: each wheel gesture jumps straight to the next/previous
    // section with a slow eased animation. Footer stays reachable via normal scroll
    // past Contact (the last paginated stop) instead of being trapped by the jump.
    (function () {
        const pages = [
            document.getElementById('home'),
            document.getElementById('about'),
            document.getElementById('projects'),
            document.getElementById('contact'),
        ].filter(Boolean);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (pages.length < 2 || !window.gsap || prefersReducedMotion) return;

        const modal = document.getElementById('project-modal');
        const EPS = 4;
        let isAnimating = false;

        function currentIndex() {
            const y = window.scrollY;
            let idx = 0;
            pages.forEach((page, i) => {
                if (y >= page.offsetTop - EPS) idx = i;
            });
            return idx;
        }

        function goTo(index) {
            if (index < 0 || index >= pages.length) return;
            isAnimating = true;
            const proxy = { y: window.scrollY };
            gsap.to(proxy, {
                y: pages[index].offsetTop,
                duration: 1.15,
                ease: 'power2.inOut',
                onUpdate: () => window.scrollTo(0, proxy.y),
                onComplete: () => { isAnimating = false; },
            });
        }

        window.addEventListener('wheel', (e) => {
            if (modal && modal.open) return;

            if (isAnimating) {
                e.preventDefault();
                return;
            }

            const idx = currentIndex();
            const lastIdx = pages.length - 1;
            const pastLastPage = window.scrollY > pages[lastIdx].offsetTop + EPS;

            if (e.deltaY > 0) {
                if (idx === lastIdx || pastLastPage) return; // let footer scroll in naturally
                e.preventDefault();
                goTo(idx + 1);
            } else if (e.deltaY < 0) {
                if (pastLastPage) return; // scrolling back up out of the footer first
                if (idx > 0) {
                    e.preventDefault();
                    goTo(idx - 1);
                }
            }
        }, { passive: false });
    })();

});
