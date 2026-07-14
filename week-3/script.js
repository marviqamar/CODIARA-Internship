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

/* =============================================================
   TASK 7 (WEEK 3): TOAST NOTIFICATIONS
   Used for transient success confirmations (login, signup, contact,
   reset password). Field-level and persistent errors still use the
   inline showFormMessage() banner above, since those need to stay
   visible while the user fixes something.
   ============================================================= */
function showToast(message, type) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type || 'success'}`;
    toast.textContent = message;
    container.appendChild(toast);

    // trigger the slide-in on the next frame (so the transition actually plays)
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* =============================================================
   TASK 3 (WEEK 3): SIMULATED USER STORAGE (localStorage)
   NOTE: this is a front-end simulation only — passwords are stored
   in plain text in the browser's localStorage, which is fine for a
   demo/school project but must never be done in a real product.
   ============================================================= */
const USERS_STORAGE_KEY = 'eduAnalyticsUsers';

function getUsers() {
    try {
        const raw = localStorage.getItem(USERS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
    return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// seed a demo account once, so login still works out of the box
// even before anyone has signed up
(function seedDemoUser() {
    if (getUsers().length === 0) {
        saveUsers([
            { name: 'Admin', email: 'admin@eduanalytics.com', password: 'admin123' }
        ]);
    }
})();

/* =============================================================
   SHARED STUDENT DATA
   Used by the Dashboard table (Task 4/Week 2) and the dynamic
   Student Profile page (Task 4/Week 3). Defined once here, at the
   top level, so every page can read window.eduAnalyticsStudents —
   not just dashboard.html.
   ============================================================= */
const eduAnalyticsStudents = [
    {
        name: 'Amara Khan', rollNo: 101, grade: 'A', attendance: 96, status: 'good', label: 'Good', term: 'Term 2',
        subjects: {
            maths:   { score: 85, grade: 'A',  remark: 'Strong Performance' },
            science: { score: 92, grade: 'A+', remark: 'Excellent' },
            english: { score: 68, grade: 'C+', remark: 'Needs Improvement' },
            history: { score: 78, grade: 'B',  remark: 'Good' }
        }
    },
    {
        name: 'Bilal Ahmed', rollNo: 102, grade: 'B+', attendance: 88, status: 'good', label: 'Good', term: 'Term 2',
        subjects: {
            maths:   { score: 80, grade: 'B+', remark: 'Good' },
            science: { score: 75, grade: 'B',  remark: 'Good' },
            english: { score: 84, grade: 'A-', remark: 'Great Effort' },
            history: { score: 70, grade: 'B-', remark: 'Satisfactory' }
        }
    },
    {
        name: 'Sara Malik', rollNo: 103, grade: 'C', attendance: 71, status: 'watch', label: 'Watch', term: 'Term 2',
        subjects: {
            maths:   { score: 65, grade: 'C',  remark: 'Needs Improvement' },
            science: { score: 70, grade: 'B-', remark: 'Fair' },
            english: { score: 60, grade: 'C-', remark: 'Needs Improvement' },
            history: { score: 68, grade: 'C',  remark: 'Needs Improvement' }
        }
    },
    {
        name: 'Usman Raza', rollNo: 104, grade: 'D', attendance: 58, status: 'risk', label: 'At Risk', term: 'Term 2',
        subjects: {
            maths:   { score: 50, grade: 'D',  remark: 'Needs Urgent Attention' },
            science: { score: 55, grade: 'D+', remark: 'Needs Improvement' },
            english: { score: 45, grade: 'F',  remark: 'Needs Urgent Attention' },
            history: { score: 60, grade: 'C-', remark: 'Needs Improvement' }
        }
    },
    {
        name: 'Hina Tariq', rollNo: 105, grade: 'A-', attendance: 94, status: 'good', label: 'Good', term: 'Term 2',
        subjects: {
            maths:   { score: 90, grade: 'A',  remark: 'Excellent' },
            science: { score: 96, grade: 'A+', remark: 'Outstanding' },
            english: { score: 88, grade: 'A-', remark: 'Great Work' },
            history: { score: 91, grade: 'A',  remark: 'Excellent' }
        }
    },
    {
        name: 'Fahad Iqbal', rollNo: 106, grade: 'B', attendance: 82, status: 'good', label: 'Good', term: 'Term 2',
        subjects: {
            maths:   { score: 78, grade: 'B',  remark: 'Good' },
            science: { score: 84, grade: 'A-', remark: 'Very Good' },
            english: { score: 79, grade: 'B',  remark: 'Good' },
            history: { score: 80, grade: 'B+', remark: 'Good' }
        }
    },
    {
        name: 'Ayesha Noor', rollNo: 107, grade: 'C+', attendance: 68, status: 'watch', label: 'Watch', term: 'Term 2',
        subjects: {
            maths:   { score: 66, grade: 'C',  remark: 'Needs Improvement' },
            science: { score: 72, grade: 'B-', remark: 'Fair' },
            english: { score: 64, grade: 'C-', remark: 'Needs Improvement' },
            history: { score: 70, grade: 'B-', remark: 'Fair' }
        }
    },
    {
        name: 'Zain Abbas', rollNo: 108, grade: 'F', attendance: 45, status: 'risk', label: 'At Risk', term: 'Term 2',
        subjects: {
            maths:   { score: 40, grade: 'F', remark: 'Needs Urgent Attention' },
            science: { score: 48, grade: 'F', remark: 'Needs Urgent Attention' },
            english: { score: 42, grade: 'F', remark: 'Needs Urgent Attention' },
            history: { score: 45, grade: 'F', remark: 'Needs Urgent Attention' }
        }
    }
];

window.eduAnalyticsStudents = eduAnalyticsStudents;

// ---------- LOGIN FORM (validation + functional demo login) ----------
(function () {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');
    const messageEl = document.getElementById('loginMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn.textContent;

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

        const matchedUser = findUserByEmail(email);

        if (matchedUser && matchedUser.password === password) {
            messageEl.hidden = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';

            localStorage.setItem('eduAnalyticsLoggedIn', 'true');
            localStorage.setItem('eduAnalyticsUserEmail', matchedUser.email);
            localStorage.setItem('eduAnalyticsUserName', matchedUser.name);
            showToast('Login successful. Redirecting...', 'success');
            setTimeout(function () {
                window.location.href = 'dashboard.html';
            }, 700);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtnDefaultText;
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
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    const nameError = document.getElementById('signupNameError');
    const emailError = document.getElementById('signupEmailError');
    const passwordError = document.getElementById('signupPasswordError');
    const confirmPasswordError = document.getElementById('signupConfirmPasswordError');
    const messageEl = document.getElementById('signupMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn.textContent;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

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

        isValid = setFieldError(confirmPasswordInput, confirmPasswordError,
            !confirmPassword ? 'Please confirm your password.' :
            confirmPassword !== password ? 'Passwords do not match.' : '') && isValid;

        if (!isValid) {
            messageEl.hidden = true;
            return;
        }

        if (findUserByEmail(email)) {
            showFormMessage(messageEl, 'An account with this email already exists.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        messageEl.hidden = true;

        const users = getUsers();
        users.push({ name, email, password });
        saveUsers(users);

        showToast('Account created. Redirecting to login...', 'success');
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 800);
    });

    [[nameInput, nameError], [emailInput, emailError], [passwordInput, passwordError], [confirmPasswordInput, confirmPasswordError]].forEach(([input, errorEl]) => {
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
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn.textContent;

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

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // brief simulated delay so the loading state is actually visible
        setTimeout(function () {
            showToast("Thanks! We've received your message.", 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtnDefaultText;
        }, 500);
    });

    [[nameInput, nameError], [emailInput, emailError], [messageInput, messageError]].forEach(([input, errorEl]) => {
        input.addEventListener('input', () => setFieldError(input, errorEl, ''));
    });
})();

// ---------- FORGOT PASSWORD FORM ----------
(function () {
    const form = document.getElementById('forgotPasswordForm');
    if (!form) return;

    const emailInput = document.getElementById('forgotEmail');
    const emailError = document.getElementById('forgotEmailError');
    const messageEl = document.getElementById('forgotMessage');
    const submitBtn = document.getElementById('forgotSubmitBtn');
    const continueLink = document.getElementById('continueToResetLink');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        const isValid = setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '');

        if (!isValid) {
            messageEl.hidden = true;
            return;
        }

        // no real email service — simulate a sent reset link.
        // store which email this is for, so reset-password.html knows who to update
        localStorage.setItem('eduAnalyticsResetEmail', email);

        showFormMessage(messageEl, `If an account exists for ${email}, a reset link has been sent.`, 'success');
        submitBtn.hidden = true;
        continueLink.hidden = false;
    });

    emailInput.addEventListener('input', () => setFieldError(emailInput, emailError, ''));
})();

// ---------- RESET PASSWORD FORM ----------
(function () {
    const form = document.getElementById('resetPasswordForm');
    if (!form) return;

    const newPasswordInput = document.getElementById('resetNewPassword');
    const confirmPasswordInput = document.getElementById('resetConfirmPassword');
    const newPasswordError = document.getElementById('resetNewPasswordError');
    const confirmPasswordError = document.getElementById('resetConfirmPasswordError');
    const messageEl = document.getElementById('resetMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn.textContent;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        let isValid = true;
        isValid = setFieldError(newPasswordInput, newPasswordError,
            !newPassword ? 'New password is required.' :
            newPassword.length < 8 ? 'Password must be at least 8 characters.' : '') && isValid;

        isValid = setFieldError(confirmPasswordInput, confirmPasswordError,
            !confirmPassword ? 'Please confirm your new password.' :
            confirmPassword !== newPassword ? 'Passwords do not match.' : '') && isValid;

        if (!isValid) {
            messageEl.hidden = true;
            return;
        }

        const resetEmail = localStorage.getItem('eduAnalyticsResetEmail');
        const users = getUsers();
        const userIndex = users.findIndex((u) => resetEmail && u.email.toLowerCase() === resetEmail.toLowerCase());

        if (userIndex === -1) {
            showFormMessage(messageEl, 'No pending reset request found. Please start from Forgot Password again.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Resetting...';
        messageEl.hidden = true;

        users[userIndex].password = newPassword;
        saveUsers(users);
        localStorage.removeItem('eduAnalyticsResetEmail');

        // no backend yet — simulate the password update, then send them to log in
        showToast('Password reset successful. Redirecting to login...', 'success');
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 900);
    });

    [[newPasswordInput, newPasswordError], [confirmPasswordInput, confirmPasswordError]].forEach(([input, errorEl]) => {
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
   (+ TASK 5 WEEK 3: performance cards, same data, alternate view)
   ============================================================= */
(function () {
    const tableBody = document.getElementById('studentTableBody');
    const cardsGrid = document.getElementById('studentCardsGrid');
    if (!tableBody) return;

    const students = window.eduAnalyticsStudents;

    // builds one <tr> from a single student object — name links to that
    // student's dynamic profile page (report.html?roll=...)
    function buildRow(student) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="report.html?roll=${student.rollNo}" class="student-name-link">${student.name}</a></td>
            <td>${student.rollNo}</td>
            <td>${student.grade}</td>
            <td>${student.attendance}%</td>
            <td><span class="${student.status}">${student.label}</span></td>
        `;
        return tr;
    }

    // builds one performance card from a single student object
    function buildCard(student) {
        const initials = student.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
        const a = document.createElement('a');
        a.href = `report.html?roll=${student.rollNo}`;
        a.className = 'student-perf-card';
        a.innerHTML = `
            <div class="card-avatar">${initials}</div>
            <h3>${student.name}</h3>
            <p class="card-meta">Roll no ${student.rollNo} &middot; Grade ${student.grade}</p>
            <div class="card-footer-row">
                <span>${student.attendance}% attendance</span>
                <span class="${student.status}">${student.label}</span>
            </div>
        `;
        return a;
    }

    // renders a given list of students into BOTH the table and the card grid,
    // so search/filter (Task 5, Week 2) keeps whichever view is visible in sync
    function renderStudents(list) {
        if (list.length === 0) {
            tableBody.innerHTML = `
                <tr class="no-results-row">
                    <td colspan="5">No students match your search.</td>
                </tr>
            `;
            cardsGrid.innerHTML = `<p class="no-results-row">No students match your search.</p>`;
            return;
        }

        tableBody.innerHTML = '';
        list.forEach((student) => tableBody.appendChild(buildRow(student)));

        cardsGrid.innerHTML = '';
        list.forEach((student) => cardsGrid.appendChild(buildCard(student)));
    }

    renderStudents(students);

    // exposed globally so Task 5's search/filter script can reuse this render function
    window.renderStudentTable = renderStudents;
})();

/* =============================================================
   TASK 5 (WEEK 3): TABLE / CARD VIEW TOGGLE
   ============================================================= */
(function () {
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableWrapper = document.getElementById('studentTableWrapper');
    const cardsGrid = document.getElementById('studentCardsGrid');

    if (!tableViewBtn || !cardViewBtn || !tableWrapper || !cardsGrid) return;

    tableViewBtn.addEventListener('click', () => {
        tableWrapper.hidden = false;
        cardsGrid.hidden = true;
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
    });

    cardViewBtn.addEventListener('click', () => {
        tableWrapper.hidden = true;
        cardsGrid.hidden = false;
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
    });
})();

/* =============================================================
   TASK 5: SEARCH AND FILTER FUNCTIONALITY
   ============================================================= */
(function () {
    const searchInput = document.getElementById('studentSearchInput');
    const statusFilter = document.getElementById('studentStatusFilter');
    const minAttendanceFilter = document.getElementById('minAttendanceFilter');
    const tableBody = document.getElementById('studentTableBody');
    const sortableHeaders = document.querySelectorAll('th.sortable');

    // only run on dashboard.html, and only if the shared render function exists
    if (!searchInput || !statusFilter || !tableBody || !window.eduAnalyticsStudents || !window.renderStudentTable) {
        return;
    }

    const allStudents = window.eduAnalyticsStudents;

    // grade/status don't sort alphabetically in a meaningful way, so rank them explicitly
    const gradeRank = ['F', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];
    const statusRank = { risk: 0, watch: 1, good: 2 };

    let currentSortKey = null;
    let currentSortDirection = 'asc'; // 'asc' or 'desc'

    function applyFilters() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;
        const minAttendance = minAttendanceFilter && minAttendanceFilter.value !== ''
            ? Number(minAttendanceFilter.value)
            : null;

        let filtered = allStudents.filter((student) => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm);
            const matchesStatus = status === 'all' || student.status === status;
            const matchesAttendance = minAttendance === null || student.attendance >= minAttendance;
            return matchesSearch && matchesStatus && matchesAttendance;
        });

        if (currentSortKey) {
            filtered = filtered.slice().sort((a, b) => {
                let valA, valB;

                if (currentSortKey === 'grade') {
                    valA = gradeRank.indexOf(a.grade);
                    valB = gradeRank.indexOf(b.grade);
                } else if (currentSortKey === 'status') {
                    valA = statusRank[a.status];
                    valB = statusRank[b.status];
                } else if (currentSortKey === 'name') {
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                } else {
                    // rollNo, attendance — plain numbers
                    valA = a[currentSortKey];
                    valB = b[currentSortKey];
                }

                if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        window.renderStudentTable(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    if (minAttendanceFilter) minAttendanceFilter.addEventListener('input', applyFilters);

    // clicking a column header sorts by it; clicking the same one again reverses direction
    sortableHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            const key = header.dataset.sort;

            if (currentSortKey === key) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortKey = key;
                currentSortDirection = 'asc';
            }

            sortableHeaders.forEach((h) => {
                h.classList.remove('sort-active');
                h.querySelector('i').className = 'fa-solid fa-sort';
            });

            header.classList.add('sort-active');
            header.querySelector('i').className =
                currentSortDirection === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';

            applyFilters();
        });
    });
})();

/* =============================================================
   TASK 4 (WEEK 3): DYNAMIC STUDENT PROFILE PAGE (report.html)
   Reads ?roll=<rollNo> from the URL, finds that student in the
   shared data, and fills in the avatar, name, progress bars, and
   detailed table. Falls back to the first student if no ?roll is
   given (so visiting report.html directly still shows something),
   and shows a "not found" state if an invalid roll is given.
   ============================================================= */
(function () {
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return; // only run on report.html

    const notFoundEl = document.getElementById('stuNotFound');
    const students = window.eduAnalyticsStudents;

    const params = new URLSearchParams(window.location.search);
    const rollParam = params.get('roll');

    let student;
    if (rollParam) {
        student = students.find((s) => String(s.rollNo) === rollParam);
        if (!student) {
            reportContent.hidden = true;
            notFoundEl.hidden = false;
            return;
        }
    } else {
        student = students[0]; // default demo view when visited with no query string
    }

    // avatar initials, e.g. "Amara Khan" -> "AK"
    const initials = student.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('stuAvatar').textContent = initials;
    document.getElementById('stuName').textContent = student.name;
    document.getElementById('stuMeta').innerHTML =
        `Roll no ${student.rollNo} &middot; Grade ${student.grade} &middot; ${student.term}`;

    // fill each subject's progress bar + percent label
    Object.keys(student.subjects).forEach((subjectKey) => {
        const subject = student.subjects[subjectKey];
        const fillEl = document.getElementById(`${subjectKey}Fill`);
        const percentEl = document.getElementById(`${subjectKey}Percent`);
        if (fillEl) fillEl.style.width = subject.score + '%';
        if (percentEl) percentEl.textContent = subject.score + '%';
    });

    // build the detailed breakdown table
    const subjectLabels = { maths: 'Mathematics', science: 'Science', english: 'English', history: 'History' };
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = '';

    Object.keys(student.subjects).forEach((subjectKey) => {
        const subject = student.subjects[subjectKey];
        const badgeClass = subject.score >= 80 ? 'good' : subject.score >= 65 ? 'watch' : 'risk';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${subjectLabels[subjectKey]}</td>
            <td>${subject.score}/100</td>
            <td><span class="${badgeClass}">${subject.grade}</span></td>
            <td>${subject.remark}</td>
        `;
        tableBody.appendChild(tr);
    });
})();

/* =============================================================
   TASK 7 (WEEK 3): SCROLL-REVEAL ANIMATIONS
   Applies only to static, always-present content (hero panels,
   stat cards, benefit cards, etc.) — deliberately NOT applied to
   forms or dynamically-filtered table/card rows, so nothing that
   matters can ever get stuck invisible.
   ============================================================= */
(function () {
    const revealSelectors = [
        '.hero-panel',
        '.glance-box',
        '.benefit-box',
        '.overview-card',
        '.director-card',
        '.progress-card',
        '.hero-section-dashbrd .box',
        '.contact-row',
        '.about-hero',
        '.eyebrow'
    ].join(', ');

    const revealEls = document.querySelectorAll(revealSelectors);
    if (revealEls.length === 0) return;

    revealEls.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 6) * 0.06 + 's';
    });

    // safety net: force everything visible after 1.5s no matter what,
    // in case the observer never fires for some reason
    const safetyTimer = setTimeout(() => {
        revealEls.forEach((el) => el.classList.add('reveal-visible'));
    }, 1500);

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        clearTimeout(safetyTimer);
        revealEls.forEach((el) => el.classList.add('reveal-visible'));
    }
})();