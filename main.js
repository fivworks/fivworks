document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. Hamburger Menu Overlay Toggle
    ========================================================================= */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    let menuOpen = false;

    if (hamburgerBtn) {
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
    }

    /* =========================================================================
       2. Interactive 3D Cube Logic (Auto-rotate & Manual Drag)
    ========================================================================= */
    const cube = document.getElementById('cube');
    let isCubeInView = true;

    if (cube) {
        let rotX = -20; // Initial resting angle
        let rotY = 45;  // Initial resting angle

        let isDragging = false;
        let previousX = 0;
        let previousY = 0;

        const autoSpeedX = 0.2;
        const autoSpeedY = 0.4;

        let clickStartTime = 0;

        function animateCube() {
            if (!isDragging && isCubeInView) {
                rotY += autoSpeedY;
                rotX += autoSpeedX;
                cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            }
            requestAnimationFrame(animateCube);
        }

        animateCube();

        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('.cube')) {
                isDragging = true;
                previousX = e.clientX;
                previousY = e.clientY;
                clickStartTime = Date.now();
                cube.style.transition = 'none';
                cube.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                rotY += (e.clientX - previousX) * 0.4;
                rotX -= (e.clientY - previousY) * 0.4;
                cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                previousX = e.clientX;
                previousY = e.clientY;
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                cube.style.cursor = 'grab';
                if (Date.now() - clickStartTime < 250) {
                    const face = e.target.closest('.cube-face');
                    if (face && face.dataset.link) window.location.href = face.dataset.link;
                }
            }
        });

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
                if (e.cancelable) e.preventDefault();
                rotY += (e.touches[0].clientX - previousX) * 0.6;
                rotX -= (e.touches[0].clientY - previousY) * 0.6;
                cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                previousX = e.touches[0].clientX;
                previousY = e.touches[0].clientY;
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (isDragging) {
                isDragging = false;
                if (Date.now() - clickStartTime < 250) {
                    const face = e.target.closest('.cube-face');
                    if (face && face.dataset.link) window.location.href = face.dataset.link;
                }
            }
        });
    }

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
       5. Sticky Buy Bar (ButterBodies page)
    ========================================================================= */
    const stickyBar = document.getElementById('sticky-bar');
    const buySection = document.getElementById('buy');

    if (stickyBar && buySection) {
        const firstSection = document.querySelector('.project-split-layout');

        const stickyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === firstSection) {
                    if (!entry.isIntersecting) {
                        stickyBar.classList.add('visible');
                    }
                }
                if (entry.target === buySection) {
                    if (entry.isIntersecting) {
                        stickyBar.classList.remove('visible');
                    } else if (window.scrollY > firstSection.offsetHeight) {
                        stickyBar.classList.add('visible');
                    }
                }
            });
        }, { threshold: 0.1 });

        stickyObserver.observe(firstSection);
        stickyObserver.observe(buySection);
    }

});
