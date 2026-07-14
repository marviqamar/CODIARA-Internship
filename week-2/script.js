/* =============================================================
   NAVBAR + MOBILE SIDEBAR TOGGLE
   ============================================================= */
(function () {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');

    // bail out safely on any page missing these elements
    if (!navToggle || !navLinks || !navBackdrop) return;

    function openNav() {
        navLinks.classList.add('open');
        navBackdrop.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
    }

    function closeNav() {
        navLinks.classList.remove('open');
        navBackdrop.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    }

    function isNavOpen() {
        return navLinks.classList.contains('open');
    }

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        isNavOpen() ? closeNav() : openNav();
    });

    navBackdrop.addEventListener('click', closeNav);

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (e) => {
        if (!isNavOpen()) return;
        const clickedInsideSidebar = navLinks.contains(e.target);
        const clickedToggleButton = navToggle.contains(e.target);
        if (!clickedInsideSidebar && !clickedToggleButton) {
            closeNav();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isNavOpen()) {
            closeNav();
        }
    });
})();

/* =============================================================
   TASK 2: FORM VALIDATION
   Login, Sign Up, and Contact forms
   ============================================================= */

// ---------- shared helpers ----------
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function setFieldError(input, errorEl, message) {
    if (message) {
        input.classList.add('input-error');
        errorEl.textContent = message;
        return false; // invalid
    }
    input.classList.remove('input-error');
    errorEl.textContent = '';
    return true; // valid
}

function showFormMessage(el, text, type) {
    el.textContent = text;
    el.hidden = false;
    el.classList.remove('form-message--error', 'form-message--success');
    el.classList.add(type === 'error' ? 'form-message--error' : 'form-message--success');
}

// ---------- LOGIN FORM (validation + functional demo login) ----------
(function () {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');
    const messageEl = document.getElementById('loginMessage');

    const DEMO_EMAIL = 'admin@eduanalytics.com';
    const DEMO_PASSWORD = 'admin123';

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let isValid = true;
        isValid = setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '') && isValid;

        isValid = setFieldError(passwordInput, passwordError,
            !password ? 'Password is required.' :
            password.length < 6 ? 'Password must be at least 6 characters.' : '') && isValid;

        if (!isValid) {
            messageEl.hidden = true;
            return;
        }

        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
            localStorage.setItem('eduAnalyticsLoggedIn', 'true');
            localStorage.setItem('eduAnalyticsUserEmail', email);
            showFormMessage(messageEl, 'Login successful. Redirecting...', 'success');
            setTimeout(function () {
                window.location.href = 'dashboard.html';
            }, 700);
        } else {
            showFormMessage(messageEl, 'Incorrect email or password.', 'error');
        }
    });

    [[emailInput, emailError], [passwordInput, passwordError]].forEach(([input, errorEl]) => {
        input.addEventListener('input', () => setFieldError(input, errorEl, ''));
    });
})();

// ---------- SIGN UP FORM ----------
(function () {
    const form = document.getElementById('signupForm');
    if (!form) return;

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const nameError = document.getElementById('signupNameError');
    const emailError = document.getElementById('signupEmailError');
    const passwordError = document.getElementById('signupPasswordError');
    const messageEl = document.getElementById('signupMessage');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let isValid = true;
        isValid = setFieldError(nameInput, nameError,
            !name ? 'Name is required.' :
            name.length < 2 ? 'Name must be at least 2 characters.' : '') && isValid;

        isValid = setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '') && isValid;

        isValid = setFieldError(passwordInput, passwordError,
            !password ? 'Password is required.' :
            password.length < 8 ? 'Password must be at least 8 characters.' : '') && isValid;

        if (!isValid) {
            messageEl.hidden = true;
            return;
        }

        showFormMessage(messageEl, 'Account created. Redirecting to login...', 'success');
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 800);
    });

    [[nameInput, nameError], [emailInput, emailError], [passwordInput, passwordError]].forEach(([input, errorEl]) => {
        input.addEventListener('input', () => setFieldError(input, errorEl, ''));
    });
})();

// ---------- CONTACT / FEEDBACK FORM ----------
(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessageField');
    const nameError = document.getElementById('contactNameError');
    const emailError = document.getElementById('contactEmailError');
    const messageError = document.getElementById('contactMessageError');
    const messageEl = document.getElementById('contactMessage');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        let isValid = true;
        isValid = setFieldError(nameInput, nameError,
            !name ? 'Name is required.' :
            name.length < 2 ? 'Name must be at least 2 characters.' : '') && isValid;

        isValid = setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '') && isValid;

        isValid = setFieldError(messageInput, messageError,
            !message ? 'Please write a message.' :
            message.length < 10 ? 'Message should be at least 10 characters.' : '') && isValid;

        if (!isValid) {
            messageEl.hidden = true;
            return;
        }

        showFormMessage(messageEl, "Thanks! We've received your message.", 'success');
        form.reset();
    });

    [[nameInput, nameError], [emailInput, emailError], [messageInput, messageError]].forEach(([input, errorEl]) => {
        input.addEventListener('input', () => setFieldError(input, errorEl, ''));
    });
})();

/* =============================================================
   TASK 3: DYNAMIC DASHBOARD CARDS
   ============================================================= */
(function () {
    const totalEl = document.getElementById('totalStudentsCount');
    if (!totalEl) return;

    const dashboardStats = {
        totalStudents:  { value: 248, decimals: 0, suffix: '' },
        averageGPA:     { value: 3.4, decimals: 1, suffix: '' },
        attendanceRate: { value: 92,  decimals: 0, suffix: '%' },
        atRiskStudents: { value: 12,  decimals: 0, suffix: '' }
    };

    function animateCount(el, target, decimals, suffix, duration) {
        duration = duration || 1200;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            el.textContent = current.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toFixed(decimals) + suffix;
            }
        }
        requestAnimationFrame(tick);
    }

    const cardMap = [
        ['totalStudentsCount', dashboardStats.totalStudents],
        ['averageGpaCount', dashboardStats.averageGPA],
        ['attendanceRateCount', dashboardStats.attendanceRate],
        ['atRiskStudentsCount', dashboardStats.atRiskStudents]
    ];

    cardMap.forEach(([id, stat]) => {
        const el = document.getElementById(id);
        if (el) animateCount(el, stat.value, stat.decimals, stat.suffix);
    });
})();

/* =============================================================
   TASK 4: BUILD STUDENT INFORMATION TABLES
   ============================================================= */
(function () {
    const tableBody = document.getElementById('studentTableBody');
    if (!tableBody) return;

    const students = [
        { name: 'Amara Khan',   rollNo: 101, grade: 'A',  attendance: 96, status: 'good',  label: 'Good' },
        { name: 'Bilal Ahmed',  rollNo: 102, grade: 'B+', attendance: 88, status: 'good',  label: 'Good' },
        { name: 'Sara Malik',   rollNo: 103, grade: 'C',  attendance: 71, status: 'watch', label: 'Watch' },
        { name: 'Usman Raza',   rollNo: 104, grade: 'D',  attendance: 58, status: 'risk',  label: 'At Risk' },
        { name: 'Hina Tariq',   rollNo: 105, grade: 'A-', attendance: 94, status: 'good',  label: 'Good' },
        { name: 'Fahad Iqbal',  rollNo: 106, grade: 'B',  attendance: 82, status: 'good',  label: 'Good' },
        { name: 'Ayesha Noor',  rollNo: 107, grade: 'C+', attendance: 68, status: 'watch', label: 'Watch' },
        { name: 'Zain Abbas',   rollNo: 108, grade: 'F',  attendance: 45, status: 'risk',  label: 'At Risk' }
    ];

    function buildRow(student) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNo}</td>
            <td>${student.grade}</td>
            <td>${student.attendance}%</td>
            <td><span class="${student.status}">${student.label}</span></td>
        `;
        return tr;
    }

    function renderStudents(list) {
        tableBody.innerHTML = '';
        list.forEach((student) => tableBody.appendChild(buildRow(student)));
    }

    renderStudents(students);

    window.eduAnalyticsStudents = students;
    window.renderStudentTable = renderStudents;
})();

/* =============================================================
   TASK 5: SEARCH AND FILTER FUNCTIONALITY
   ============================================================= */
(function () {
    const searchInput = document.getElementById('studentSearchInput');
    const statusFilter = document.getElementById('studentStatusFilter');
    const tableBody = document.getElementById('studentTableBody');

    if (!searchInput || !statusFilter || !tableBody || !window.eduAnalyticsStudents || !window.renderStudentTable) {
        return;
    }

    const allStudents = window.eduAnalyticsStudents;

    function applyFilters() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;

        const filtered = allStudents.filter((student) => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm);
            const matchesStatus = status === 'all' || student.status === status;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr class="no-results-row">
                    <td colspan="5">No students match your search.</td>
                </tr>
            `;
        } else {
            window.renderStudentTable(filtered);
        }
    }

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
})();