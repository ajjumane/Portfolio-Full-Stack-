document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Default to light mode if no preference
        body.classList.add('light-mode');
        updateThemeIcon('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            updateThemeIcon('dark-mode');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
            updateThemeIcon('light-mode');
        }
    });

    function updateThemeIcon(currentTheme) {
        if (currentTheme === 'dark-mode') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }


    // --- Mobile Navigation (Hamburger) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Skill Bar Generation and Animation ---
    const skillBarItems = document.querySelectorAll('.skill-bar-item');
    const skillLevelMap = {
        5: 'Expert',
        4: 'Advanced',
        3: 'Intermediate',
        2: 'Basic'
    };

    // 1. Generate the HTML structure for each skill
    skillBarItems.forEach(item => {
        const name = item.getAttribute('data-skill-name');
        const level = parseInt(item.getAttribute('data-level'));
        const percentage = level * 20; // Maps 1-5 to 20%-100%

        item.innerHTML = `
            <div class="skill-bar-header">
                <span class="skill-name">${name}</span>
                <span class="skill-level-label">${skillLevelMap[level] || 'Basic'}</span>
            </div>
            <div class="skill-bar-container">
                <div class="skill-bar" data-percent="${percentage}%"></div>
            </div>
        `;
    });

    // 2. Animate skill bars when the skills section is visible
    let skillsSectionVisible = false;
    const skillsSection = document.getElementById('skills');

    const animateSkillBars = () => {
        if (skillsSectionVisible) {
            skillBarItems.forEach(item => {
                const bar = item.querySelector('.skill-bar');
                // Use the percentage stored in data-percent to animate the width
                bar.style.width = bar.getAttribute('data-percent');
            });
            // Stop observing once animated
            observer.unobserve(skillsSection);
        }
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillsSectionVisible = true;
                animateSkillBars();
            }
        });
    }, { threshold: 0.1 });

    if (skillsSection) {
        observer.observe(skillsSection);
    }


    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150; // How far from top of viewport to trigger

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load to reveal elements already in view

    // --- Smooth Scrolling for Navbar Links ---
    document.querySelectorAll('.navbar .nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offsetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});