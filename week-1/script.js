// ========= HOME PAGE ==============
// ==toggling navbar==
const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        const navBackdrop = document.getElementById('navBackdrop');

        function closeNav() {
            navLinks.classList.remove('open');
            navBackdrop.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }

        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navBackdrop.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navBackdrop.addEventListener('click', closeNav);
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));