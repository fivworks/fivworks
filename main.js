document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. Hamburger Menu Overlay Toggle
    ========================================================================= */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    let menuOpen = false;

    hamburgerBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        if (menuOpen) {
            hamburgerBtn.classList.add('open');
            menuOverlay.classList.add('active');
            document.querySelector('.pinned-header').classList.add('menu-active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        } else {
            hamburgerBtn.classList.remove('open');
            menuOverlay.classList.remove('active');
            document.querySelector('.pinned-header').classList.remove('menu-active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Close menu when a link is clicked
    const menuLinks = document.querySelectorAll('.menu-content a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) {
                hamburgerBtn.click(); // Trigger close animation and state reset
            }
        });
    });

    /* =========================================================================
       2. Interactive 3D Cube Logic (Auto-rotate & Manual Drag)
    ========================================================================= */
    const cube = document.getElementById('cube');
    let rotX = -20; // Initial resting angle
    let rotY = 45;  // Initial resting angle

    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    // Auto-rotation speed settings
    let isCubeInView = true;
    const autoSpeedX = 0.2;
    const autoSpeedY = 0.4;

    let clickStartTime = 0;
    // Removing isRolling state as we are disabling the roll animation

    // The main render loop for the cube
    function animateCube() {
        if (!isDragging && isCubeInView) {
            rotY += autoSpeedY;
            rotX += autoSpeedX;
            applyCubeTransform();
        }
        requestAnimationFrame(animateCube);
    }

    function applyCubeTransform() {
        cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    // Start auto-rotation
    animateCube();

    // Mouse Events for Desktop drag and click
    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('.cube')) {
            isDragging = true;
            previousX = e.clientX;
            previousY = e.clientY;
            clickStartTime = Date.now();
            cube.style.transition = 'none'; // Remove CSS transition for instant drag response
            cube.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousX;
            const deltaY = e.clientY - previousY;

            rotY += deltaX * 0.4;
            rotX -= deltaY * 0.4; // inverted Y axis feels more natural

            applyCubeTransform();

            previousX = e.clientX;
            previousY = e.clientY;
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            cube.style.cursor = 'grab';

            // Check if it was a quick click rather than a drag
            const timeElapsed = Date.now() - clickStartTime;
            if (timeElapsed < 250) {
                const face = e.target.closest('.cube-face');
                if (face && face.dataset.link) {
                    window.location.href = face.dataset.link;
                }
            }
        }
    });

    // Removed rollDice function


    // Touch Events for Mobile drag
    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('.cube')) {
            isDragging = true;
            previousX = e.touches[0].clientX;
            previousY = e.touches[0].clientY;
            clickStartTime = Date.now();
            cube.style.transition = 'none';
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            // Prevent page scrolling while dragging the cube
            if (e.cancelable) e.preventDefault();

            const deltaX = e.touches[0].clientX - previousX;
            const deltaY = e.touches[0].clientY - previousY;

            rotY += deltaX * 0.6; // slightly higher sensitivity on mobile
            rotX -= deltaY * 0.6;

            applyCubeTransform();

            previousX = e.touches[0].clientX;
            previousY = e.touches[0].clientY;
        }
    }, { passive: false }); // Requires passive: false to allow e.preventDefault()

    document.addEventListener('touchend', (e) => {
        if (isDragging) {
            isDragging = false;

            // Check if it was a quick tap rather than a swipe
            const timeElapsed = Date.now() - clickStartTime;
            if (timeElapsed < 250) {
                const face = e.target.closest('.cube-face');
                if (face && face.dataset.link) {
                    window.location.href = face.dataset.link;
                }
            }
        }
    });

    /* =========================================================================
       3. Scroll Reveal Animations via IntersectionObserver
    ========================================================================= */
    const textContainer = document.querySelector('.text-container');
    const projectLinks = document.querySelectorAll('.project-link');
    const heroSection = document.querySelector('.hero-section');
    const cvLines = document.querySelectorAll('.cv-separator-line');

    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed if you want it to remain solid
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    if (textContainer) revealObserver.observe(textContainer);
    projectLinks.forEach(link => revealObserver.observe(link));
    cvLines.forEach(line => revealObserver.observe(line));

    // Performance optimization: Pause cube auto-rotation when user scrolls past hero
    const performanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isCubeInView = entry.isIntersecting;
        });
    }, { threshold: 0 }); // 0 means any part is visible

    if (heroSection) performanceObserver.observe(heroSection);

    /* =========================================================================
       4. Delayed Logo Expansion on About Page
    ========================================================================= */
    const isAboutPage = window.location.pathname.includes('about.html');
    if (isAboutPage) {
        const aboutName = document.querySelector('.about-name');
        if (aboutName) {
            setTimeout(() => {
                document.body.classList.add('expanding');
                aboutName.classList.add('expanded');
            }, 500); // 0.5-second delay
        }
    }
});
