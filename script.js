document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay for the outline for a smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    });

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

    // Custom Cursor Interactions
    // Add hover effect to cursor when hovering interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .social-icon, .close-modal');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(0, 255, 157, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
});
