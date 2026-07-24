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
   TASK 7 (WEEK 4): PERFORMANCE — SHARED DEBOUNCE UTILITY
   Delays running `fn` until `delay` ms after the last call, so a
   rapid-fire event (like typing) only triggers the expensive work
   once things settle down, instead of on every single keystroke.
   ============================================================= */
function debounce(fn, delay) {
    let timerId;
    return function debounced(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn.apply(this, args), delay);
    };
}

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
   TASK 6 (WEEK 5): PASSWORD STRENGTH + LIVE MATCH INDICATOR
   Shared by Sign Up and Reset Password, since both have a
   "new password" + "confirm password" pair.
   ============================================================= */
function getPasswordStrength(password) {
    if (!password) return '';
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 3) return 'fair';
    return 'strong';
}

function updateStrengthMeter(meterEl, labelEl, password) {
    if (!meterEl || !labelEl) return;
    const strength = getPasswordStrength(password);

    if (!strength) {
        meterEl.classList.remove('is-visible');
        return;
    }

    meterEl.className = `password-strength is-visible ${strength}`;
    const labels = { weak: 'Weak password', fair: 'Fair password', strong: 'Strong password' };
    labelEl.textContent = labels[strength];
}

function updateMatchIndicator(indicatorEl, password, confirmPassword) {
    if (!indicatorEl) return;

    if (!confirmPassword) {
        indicatorEl.className = 'password-match-indicator';
        return;
    }

    if (password === confirmPassword) {
        indicatorEl.className = 'password-match-indicator is-visible match';
        indicatorEl.textContent = '✓ Passwords match';
    } else {
        indicatorEl.className = 'password-match-indicator is-visible no-match';
        indicatorEl.textContent = 'Passwords do not match yet';
    }
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
            { name: 'Admin', email: 'admin@eduanalytics.com', password: 'admin123', role: 'admin' },
            { name: 'Ms. Fatima', email: 'teacher@eduanalytics.com', password: 'teacher123', role: 'teacher' },
            { name: 'Amara Khan', email: 'student@eduanalytics.com', password: 'student123', role: 'student', rollNo: 101 }
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

// shared by report.html and the student's own dashboard view — one definition,
// used wherever a subject breakdown table needs to be rendered
const SUBJECT_LABELS = { maths: 'Mathematics', science: 'Science', english: 'English', history: 'History' };

function getScoreBadgeClass(score) {
    return score >= 80 ? 'good' : score >= 65 ? 'watch' : 'risk';
}

function buildSubjectTableRows(subjects) {
    return Object.keys(subjects).map((subjectKey) => {
        const subject = subjects[subjectKey];
        const badgeClass = getScoreBadgeClass(subject.score);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${SUBJECT_LABELS[subjectKey]}</td>
            <td>${subject.score}/100</td>
            <td><span class="${badgeClass}">${subject.grade}</span></td>
            <td>${subject.remark}</td>
        `;
        return tr;
    });
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
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn.textContent;

    function validateEmailField() {
        const email = emailInput.value.trim();
        return setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '');
    }

    function validatePasswordField() {
        const password = passwordInput.value;
        return setFieldError(passwordInput, passwordError,
            !password ? 'Password is required.' :
            password.length < 6 ? 'Password must be at least 6 characters.' : '');
    }

    // validate as soon as the user leaves a field, not only on submit
    emailInput.addEventListener('blur', validateEmailField);
    passwordInput.addEventListener('blur', validatePasswordField);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const isValid = validateEmailField() && validatePasswordField();

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
            localStorage.setItem('eduAnalyticsUserRole', matchedUser.role || 'admin');
            if (matchedUser.rollNo) {
                localStorage.setItem('eduAnalyticsUserRollNo', matchedUser.rollNo);
            } else {
                localStorage.removeItem('eduAnalyticsUserRollNo');
            }
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
    const roleInput = document.getElementById('signupRole');
    const rollNoWrapper = document.getElementById('signupRollNoWrapper');
    const rollNoInput = document.getElementById('signupRollNo');
    const rollNoError = document.getElementById('signupRollNoError');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    const nameError = document.getElementById('signupNameError');
    const emailError = document.getElementById('signupEmailError');
    const passwordError = document.getElementById('signupPasswordError');
    const confirmPasswordError = document.getElementById('signupConfirmPasswordError');
    const messageEl = document.getElementById('signupMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn.textContent;
    const strengthMeter = document.getElementById('passwordStrengthMeter');
    const strengthLabel = document.getElementById('passwordStrengthLabel');
    const matchIndicator = document.getElementById('passwordMatchIndicator');

    // roll number only makes sense for students — show/hide it as the role changes
    function toggleRollNoField() {
        rollNoWrapper.hidden = roleInput.value !== 'student';
    }
    toggleRollNoField();
    roleInput.addEventListener('change', toggleRollNoField);

    function validateName() {
        const name = nameInput.value.trim();
        return setFieldError(nameInput, nameError,
            !name ? 'Name is required.' :
            name.length < 2 ? 'Name must be at least 2 characters.' : '');
    }

    function validateEmailField() {
        const email = emailInput.value.trim();
        return setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '');
    }

    function validateRollNo() {
        const rollNo = rollNoInput.value.trim();
        if (roleInput.value !== 'student') {
            return setFieldError(rollNoInput, rollNoError, '');
        }
        return setFieldError(rollNoInput, rollNoError,
            !rollNo ? 'Roll number is required for students.' :
            !window.eduAnalyticsStudents.some((s) => String(s.rollNo) === rollNo)
                ? 'No student record matches this roll number.' : '');
    }

    function validatePasswordField() {
        const password = passwordInput.value;
        return setFieldError(passwordInput, passwordError,
            !password ? 'Password is required.' :
            password.length < 8 ? 'Password must be at least 8 characters.' : '');
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        return setFieldError(confirmPasswordInput, confirmPasswordError,
            !confirmPassword ? 'Please confirm your password.' :
            confirmPassword !== password ? 'Passwords do not match.' : '');
    }

    // validate as soon as the user leaves a field, not only on submit
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmailField);
    rollNoInput.addEventListener('blur', validateRollNo);
    passwordInput.addEventListener('blur', validatePasswordField);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

    // live password strength meter and match indicator, updating as you type
    passwordInput.addEventListener('input', () => {
        updateStrengthMeter(strengthMeter, strengthLabel, passwordInput.value);
        updateMatchIndicator(matchIndicator, passwordInput.value, confirmPasswordInput.value);
    });
    confirmPasswordInput.addEventListener('input', () => {
        updateMatchIndicator(matchIndicator, passwordInput.value, confirmPasswordInput.value);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const role = roleInput.value;
        const rollNo = rollNoInput.value.trim();
        const password = passwordInput.value;

        const isValid = [
            validateName(),
            validateEmailField(),
            validateRollNo(),
            validatePasswordField(),
            validateConfirmPassword()
        ].every(Boolean);

        if (!isValid) {
            messageEl.hidden = true;
            return;
        }

        const users = getUsers();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            showFormMessage(messageEl, 'An account with this email already exists.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        messageEl.hidden = true;

        const newUser = { name, email, password, role };
        if (role === 'student') {
            newUser.rollNo = Number(rollNo);
        }

        users.push(newUser);
        saveUsers(users);

        showToast('Account created. Redirecting to login...', 'success');
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 800);
    });

    [[nameInput, nameError], [emailInput, emailError], [passwordInput, passwordError], [confirmPasswordInput, confirmPasswordError], [rollNoInput, rollNoError]].forEach(([input, errorEl]) => {
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

    function validateName() {
        const name = nameInput.value.trim();
        return setFieldError(nameInput, nameError,
            !name ? 'Name is required.' :
            name.length < 2 ? 'Name must be at least 2 characters.' : '');
    }

    function validateEmailField() {
        const email = emailInput.value.trim();
        return setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '');
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        return setFieldError(messageInput, messageError,
            !message ? 'Please write a message.' :
            message.length < 10 ? 'Message should be at least 10 characters.' : '');
    }

    // validate as soon as the user leaves a field, not only on submit
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmailField);
    messageInput.addEventListener('blur', validateMessage);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const isValid = [validateName(), validateEmailField(), validateMessage()].every(Boolean);

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

    function validateEmailField() {
        const email = emailInput.value.trim();
        return setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '');
    }

    emailInput.addEventListener('blur', validateEmailField);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const isValid = validateEmailField();

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
    const strengthMeter = document.getElementById('resetPasswordStrengthMeter');
    const strengthLabel = document.getElementById('resetPasswordStrengthLabel');
    const matchIndicator = document.getElementById('resetPasswordMatchIndicator');

    function validateNewPassword() {
        const newPassword = newPasswordInput.value;
        return setFieldError(newPasswordInput, newPasswordError,
            !newPassword ? 'New password is required.' :
            newPassword.length < 8 ? 'Password must be at least 8 characters.' : '');
    }

    function validateConfirmPassword() {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        return setFieldError(confirmPasswordInput, confirmPasswordError,
            !confirmPassword ? 'Please confirm your new password.' :
            confirmPassword !== newPassword ? 'Passwords do not match.' : '');
    }

    newPasswordInput.addEventListener('blur', validateNewPassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

    newPasswordInput.addEventListener('input', () => {
        updateStrengthMeter(strengthMeter, strengthLabel, newPasswordInput.value);
        updateMatchIndicator(matchIndicator, newPasswordInput.value, confirmPasswordInput.value);
    });
    confirmPasswordInput.addEventListener('input', () => {
        updateMatchIndicator(matchIndicator, newPasswordInput.value, confirmPasswordInput.value);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const newPassword = newPasswordInput.value;

        const isValid = [validateNewPassword(), validateConfirmPassword()].every(Boolean);

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

function performLogout() {
    localStorage.removeItem('eduAnalyticsLoggedIn');
    localStorage.removeItem('eduAnalyticsUserEmail');
    localStorage.removeItem('eduAnalyticsUserName');
    localStorage.removeItem('eduAnalyticsUserRole');
    localStorage.removeItem('eduAnalyticsUserRollNo');
    window.location.href = 'index.html';
}

/* =============================================================
   TASK 2 (WEEK 4): ROLE-BASED NAVBAR MENUS
   Runs on every page that has the shared navbar. Shows/hides the
   profile icon and the Reports link, and turns "Login" into a
   working "Logout" button, based on whether someone's logged in
   and what role they have.
   ============================================================= */
(function () {
    const authLink = document.getElementById('navAuthLink');
    if (!authLink) return; // page has no navbar (e.g. login/signup/forgot/reset pages)

    const profileLink = document.getElementById('navProfileLink');
    const reportsLink = document.getElementById('navReportsLink');
    const isLoggedIn = localStorage.getItem('eduAnalyticsLoggedIn') === 'true';
    const role = localStorage.getItem('eduAnalyticsUserRole');

    if (isLoggedIn) {
        if (profileLink) profileLink.hidden = false;

        // students get their own report linked from the dashboard already —
        // the generic "browse any student's report" link isn't meant for them
        if (reportsLink) reportsLink.hidden = (role === 'student');

        authLink.textContent = 'Logout';
        authLink.href = '#';
        authLink.addEventListener('click', function (e) {
            e.preventDefault();
            performLogout();
        });
    } else {
        if (profileLink) profileLink.hidden = true;
        if (reportsLink) reportsLink.hidden = false;
        // authLink stays as the default "Login" link from the HTML
    }
})();

/* =============================================================
   TASK 1 (WEEK 4): ROLE-BASED DASHBOARD LAYOUT
   Shows a different dashboard.html layout depending on the logged-in
   user's role: Admin and Teacher see the school-wide view; Student
   sees only their own performance, pulled from the shared student
   dataset via the roll number they linked at signup.
   ============================================================= */
(function () {
    const staffDashboard = document.getElementById('staffDashboard');
    if (!staffDashboard) return; // only run on dashboard.html

    const studentDashboard = document.getElementById('studentDashboard');
    const noRecordEl = document.getElementById('dashboardNoRecord');
    const headingEl = document.getElementById('staffDashboardHeading');
    const subtitleEl = document.getElementById('staffDashboardSubtitle');

    // default to 'admin' if nobody's logged in yet, so the dashboard
    // still shows the full school-wide view out of the box
    const role = localStorage.getItem('eduAnalyticsUserRole') || 'admin';

    if (role === 'student') {
        staffDashboard.hidden = true;

        const rollNo = localStorage.getItem('eduAnalyticsUserRollNo');
        const student = window.eduAnalyticsStudents.find((s) => String(s.rollNo) === String(rollNo));

        if (!student) {
            noRecordEl.hidden = false;
            return;
        }

        studentDashboard.hidden = false;

        const initials = student.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
        document.getElementById('myAvatar').textContent = initials;
        document.getElementById('myName').textContent = student.name;
        document.getElementById('myMeta').innerHTML = `Roll no ${student.rollNo} &middot; Grade ${student.grade}`;
        document.getElementById('myGradeCount').textContent = student.grade;
        document.getElementById('myAttendanceCount').textContent = student.attendance + '%';
        document.getElementById('myStatusCount').textContent = student.label;

        const statusIcons = { good: 'fa-circle-check', watch: 'fa-triangle-exclamation', risk: 'fa-circle-exclamation' };
        const statusCard = document.getElementById('myStatusCard');
        const statusIcon = document.getElementById('myStatusIcon');
        statusCard.className = `my-stat-card status-${student.status}`;
        statusIcon.className = `fa-solid ${statusIcons[student.status] || 'fa-circle-check'}`;
        document.getElementById('myFullReportLink').href = `report.html?roll=${student.rollNo}`;

        const progressGrid = document.getElementById('myProgressGrid');
        progressGrid.innerHTML = '';

        Object.keys(student.subjects).forEach((subjectKey) => {
            const subject = student.subjects[subjectKey];
            const card = document.createElement('div');
            card.className = `progress-card ${subjectKey}`;
            card.innerHTML = `
                <div class="progress-label"><span>${SUBJECT_LABELS[subjectKey]}</span><span>${subject.score}%</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${subject.score}%;"></div></div>
            `;
            progressGrid.appendChild(card);
        });

        const myTableBody = document.getElementById('myReportTableBody');
        myTableBody.innerHTML = '';
        buildSubjectTableRows(student.subjects).forEach((tr) => myTableBody.appendChild(tr));

        return;
    }

    // admin or teacher — show the school-wide dashboard
    staffDashboard.hidden = false;

    if (role === 'admin') {
        headingEl.textContent = 'Admin Dashboard';
        subtitleEl.textContent = "Manage the entire school's performance data.";
    } else {
        headingEl.textContent = 'Teacher Dashboard';
        subtitleEl.textContent = "An overview of your class's performance.";
    }
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

        // build everything off-DOM first, then insert once — one reflow
        // for the whole list instead of one reflow per row/card appended
        const rowFragment = document.createDocumentFragment();
        const cardFragment = document.createDocumentFragment();

        list.forEach((student) => {
            rowFragment.appendChild(buildRow(student));
            cardFragment.appendChild(buildCard(student));
        });

        tableBody.innerHTML = '';
        tableBody.appendChild(rowFragment);

        cardsGrid.innerHTML = '';
        cardsGrid.appendChild(cardFragment);
    }

    // note: no initial renderStudents(students) call here — the search/filter/
    // pagination block (below) always runs applyFilters() once on load, which
    // calls this function with the correctly paginated result. Rendering the
    // full unpaginated list here first would just be a wasted render pass.

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
        tableViewBtn.setAttribute('aria-pressed', 'true');
        cardViewBtn.setAttribute('aria-pressed', 'false');
    });

    cardViewBtn.addEventListener('click', () => {
        tableWrapper.hidden = true;
        cardsGrid.hidden = false;
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        cardViewBtn.setAttribute('aria-pressed', 'true');
        tableViewBtn.setAttribute('aria-pressed', 'false');
    });
})();

/* =============================================================
   TASK 5: SEARCH AND FILTER FUNCTIONALITY
   ============================================================= */
(function () {
    const searchInput = document.getElementById('studentSearchInput');
    const statusFilter = document.getElementById('studentStatusFilter');
    const gradeFilter = document.getElementById('studentGradeFilter');
    const minAttendanceFilter = document.getElementById('minAttendanceFilter');
    const maxAttendanceFilter = document.getElementById('maxAttendanceFilter');
    const tableBody = document.getElementById('studentTableBody');
    const sortableHeaders = document.querySelectorAll('th.sortable');
    const filtersToggleBtn = document.getElementById('filtersToggleBtn');
    const filtersPanel = document.getElementById('advancedFiltersPanel');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

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

    // --- pagination state ---
    const PAGE_SIZE = 4;
    let currentPage = 1;
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationButtons = document.getElementById('paginationButtons');

    function renderPagination(totalItems, totalPages) {
        if (!paginationInfo || !paginationButtons) return;

        if (totalItems === 0) {
            paginationInfo.textContent = 'Showing 0 of 0';
            paginationButtons.innerHTML = '';
            return;
        }

        const start = (currentPage - 1) * PAGE_SIZE + 1;
        const end = Math.min(currentPage * PAGE_SIZE, totalItems);
        paginationInfo.textContent = `Showing ${start}-${end} of ${totalItems}`;

        function goToPage(page) {
            currentPage = page;
            applyFilters();
        }

        const fragment = document.createDocumentFragment();

        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.setAttribute('aria-label', 'Previous page');
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
        fragment.appendChild(prevBtn);

        for (let page = 1; page <= totalPages; page++) {
            const pageBtn = document.createElement('button');
            pageBtn.type = 'button';
            pageBtn.className = `pagination-btn${page === currentPage ? ' active' : ''}`;
            pageBtn.textContent = page;
            pageBtn.setAttribute('aria-label', `Page ${page}`);
            if (page === currentPage) pageBtn.setAttribute('aria-current', 'page');
            pageBtn.addEventListener('click', () => goToPage(page));
            fragment.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.setAttribute('aria-label', 'Next page');
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
        fragment.appendChild(nextBtn);

        paginationButtons.innerHTML = '';
        paginationButtons.appendChild(fragment);
    }

    function applyFilters() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;
        const gradeBucket = gradeFilter ? gradeFilter.value : 'all';
        const minAttendance = minAttendanceFilter && minAttendanceFilter.value !== ''
            ? Number(minAttendanceFilter.value)
            : null;
        const maxAttendance = maxAttendanceFilter && maxAttendanceFilter.value !== ''
            ? Number(maxAttendanceFilter.value)
            : null;

        let filtered = allStudents.filter((student) => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm);
            const matchesStatus = status === 'all' || student.status === status;
            const matchesGrade = gradeBucket === 'all' || student.grade.charAt(0) === gradeBucket;
            const matchesMin = minAttendance === null || student.attendance >= minAttendance;
            const matchesMax = maxAttendance === null || student.attendance <= maxAttendance;
            return matchesSearch && matchesStatus && matchesGrade && matchesMin && matchesMax;
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

        // paginate the fully filtered+sorted list, not the raw dataset
        const totalItems = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        currentPage = Math.min(Math.max(1, currentPage), totalPages);

        const pageStart = (currentPage - 1) * PAGE_SIZE;
        const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

        // exposed so Export CSV/PDF can export everything that matches the
        // current filters, not just the 4 students visible on this page
        window.currentFilteredStudents = filtered;

        // lets other features (like the Chart.js dashboard charts) react
        // whenever the filtered result set changes, without this block
        // needing to know anything about them
        if (typeof window.onDashboardFiltersApplied === 'function') {
            window.onDashboardFiltersApplied(filtered);
        }

        window.renderStudentTable(pageItems);
        renderPagination(totalItems, totalPages);
    }

    // exposed so the export feature can restore the normal paginated view
    // after a PDF export temporarily shows the full unpaginated list to print
    window.reapplyDashboardFilters = applyFilters;

    // --- advanced filters panel toggle ---
    if (filtersToggleBtn && filtersPanel) {
        filtersToggleBtn.addEventListener('click', () => {
            const isOpen = filtersPanel.hidden === false;
            filtersPanel.hidden = isOpen;
            filtersToggleBtn.setAttribute('aria-expanded', String(!isOpen));
        });
    }

    // --- clear all filters ---
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            statusFilter.value = 'all';
            if (gradeFilter) gradeFilter.value = 'all';
            if (minAttendanceFilter) minAttendanceFilter.value = '';
            if (maxAttendanceFilter) maxAttendanceFilter.value = '';
            currentPage = 1;
            applyFilters();
        });
    }

    // search and min-attendance fire on every keystroke — debounce them so a
    // fast typist doesn't trigger a full re-render on every single character.
    // the status dropdown only fires on selection, so it stays immediate.
    // any real filter change resets back to page 1 — staying on page 3 of a
    // brand new, smaller result set would be confusing.
    function applyFiltersFromPage1() {
        currentPage = 1;
        applyFilters();
    }

    const debouncedApplyFilters = debounce(applyFiltersFromPage1, 200);
    searchInput.addEventListener('input', debouncedApplyFilters);
    statusFilter.addEventListener('change', applyFiltersFromPage1);
    if (gradeFilter) gradeFilter.addEventListener('change', applyFiltersFromPage1);
    if (minAttendanceFilter) minAttendanceFilter.addEventListener('input', debouncedApplyFilters);
    if (maxAttendanceFilter) maxAttendanceFilter.addEventListener('input', debouncedApplyFilters);

    // clicking (or pressing Enter/Space on) a column header sorts by it;
    // doing it again on the same column reverses direction
    function handleSort(header) {
        const key = header.dataset.sort;

        if (currentSortKey === key) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortKey = key;
            currentSortDirection = 'asc';
        }

        sortableHeaders.forEach((h) => {
            h.classList.remove('sort-active');
            h.setAttribute('aria-sort', 'none');
            h.querySelector('i').className = 'fa-solid fa-sort';
        });

        header.classList.add('sort-active');
        header.setAttribute('aria-sort', currentSortDirection === 'asc' ? 'ascending' : 'descending');
        header.querySelector('i').className =
            currentSortDirection === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';

        applyFiltersFromPage1();
    }

    sortableHeaders.forEach((header) => {
        header.addEventListener('click', () => handleSort(header));
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSort(header);
            }
        });
    });

    // Task 4's initial render shows the full, unpaginated list — apply
    // pagination immediately so page 1 is correct from first load, not
    // just after the first filter/sort interaction
    applyFilters();
})();

/* =============================================================
   TASK 3 (WEEK 5): EXPORT OPTIONS (CSV / PDF)
   CSV is genuinely generated and downloaded client-side — no backend
   needed. PDF uses the browser's native print dialog with a dedicated
   print stylesheet (see style.css "PRINT STYLESHEET"); choosing
   "Save as PDF" there produces a real PDF, no library required.
   Both export whatever's currently filtered, not just the current
   page, since exporting only 4 of 8 matching students would be
   a pretty unhelpful "export" button.
   ============================================================= */
(function () {
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (!exportCsvBtn && !exportPdfBtn) return; // this page has no export buttons

    function getExportList() {
        return window.currentFilteredStudents || window.eduAnalyticsStudents || [];
    }

    function downloadCsv() {
        const students = getExportList();
        if (students.length === 0) {
            showToast('No students match the current filters to export.', 'error');
            return;
        }

        const headers = ['Name', 'Roll No', 'Grade', 'Attendance %', 'Status'];
        const rows = students.map((s) => [s.name, s.rollNo, s.grade, s.attendance, s.label]);

        // wrap every field in quotes and escape any embedded quotes, so names
        // or values containing commas don't silently break the CSV columns
        const csvContent = [headers, ...rows]
            .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
            .join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `student-records-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast(`Exported ${students.length} student record${students.length === 1 ? '' : 's'} as CSV.`, 'success');
    }

    function exportPdf() {
        const students = getExportList();
        if (students.length === 0) {
            showToast('No students match the current filters to export.', 'error');
            return;
        }

        // the print stylesheet only targets the table, so switch to table
        // view and temporarily show the full filtered list (bypassing
        // pagination) so the printout/PDF isn't missing anything
        const tableViewBtn = document.getElementById('tableViewBtn');
        if (tableViewBtn) tableViewBtn.click();
        window.renderStudentTable(students);
        window.print();
    }

    if (exportCsvBtn) exportCsvBtn.addEventListener('click', downloadCsv);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportPdf);

    // after the print dialog closes (Save/Cancel either way), restore the
    // normal paginated view instead of leaving the full list showing
    window.addEventListener('afterprint', () => {
        if (window.reapplyDashboardFilters) window.reapplyDashboardFilters();
    });
})();

/* =============================================================
   TASK 4 (WEEK 5): INTERACTIVE CHARTS (Chart.js)
   Grade distribution (bar) and status distribution (doughnut),
   built from the same shared student data everything else uses.
   Registers with the onDashboardFiltersApplied hook so the charts
   actually update live when Advanced Filters/search/sort change —
   not just static decoration.
   ============================================================= */
(function () {
    const gradeCanvas = document.getElementById('gradeChart');
    const statusCanvas = document.getElementById('statusChart');
    if (!gradeCanvas || !statusCanvas) return; // this page has no charts

    if (typeof Chart === 'undefined') {
        console.warn('Chart.js failed to load — dashboard charts will not render.');
        return;
    }

    const gradeBuckets = ['A', 'B', 'C', 'D', 'F'];

    function computeGradeCounts(students) {
        const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
        students.forEach((s) => {
            const bucket = s.grade.charAt(0);
            if (counts[bucket] !== undefined) counts[bucket]++;
        });
        return gradeBuckets.map((b) => counts[b]);
    }

    function computeStatusCounts(students) {
        const counts = { good: 0, watch: 0, risk: 0 };
        students.forEach((s) => { if (counts[s.status] !== undefined) counts[s.status]++; });
        return [counts.good, counts.watch, counts.risk];
    }

    // brand colors pulled straight from the CSS custom properties, so the
    // charts stay visually consistent with the rest of the site automatically
    const rootStyles = getComputedStyle(document.documentElement);
    const colorIndigo = rootStyles.getPropertyValue('--indigo').trim() || '#3b4d9e';
    const colorMint = rootStyles.getPropertyValue('--mint').trim() || '#2fae82';
    const colorAmber = rootStyles.getPropertyValue('--amber').trim() || '#c97a2b';
    const colorRisk = '#c0392b';

    const gradeChart = new Chart(gradeCanvas, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D', 'F'],
            datasets: [{
                label: 'Students',
                data: computeGradeCounts(window.eduAnalyticsStudents),
                backgroundColor: colorIndigo,
                borderRadius: 6,
                maxBarThickness: 48
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });

    const statusChart = new Chart(statusCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Good', 'Watch', 'At Risk'],
            datasets: [{
                data: computeStatusCounts(window.eduAnalyticsStudents),
                backgroundColor: [colorMint, colorAmber, colorRisk],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    function updateCharts(students) {
        gradeChart.data.datasets[0].data = computeGradeCounts(students);
        gradeChart.update();

        statusChart.data.datasets[0].data = computeStatusCounts(students);
        statusChart.update();
    }

    // paint with whatever's already filtered (if filters ran first) or the
    // full dataset (if this script happens to run before them)
    updateCharts(window.currentFilteredStudents || window.eduAnalyticsStudents);

    // stay in sync with every future filter/search/sort change
    const previousHook = window.onDashboardFiltersApplied;
    window.onDashboardFiltersApplied = function (filtered) {
        if (typeof previousHook === 'function') previousHook(filtered);
        updateCharts(filtered);
    };
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
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = '';
    buildSubjectTableRows(student.subjects).forEach((tr) => tableBody.appendChild(tr));
})();

/* =============================================================
   TASK 5 (WEEK 4): NOTIFICATION PANEL UI
   Sample notifications, seeded once into localStorage so read/unread
   state persists across page loads (same simulation pattern as the
   user accounts). Only visible when someone's logged in, same as
   the profile icon.
   ============================================================= */
(function () {
    const bellBtn = document.getElementById('notificationBellBtn');
    if (!bellBtn) return; // page has no navbar

    const NOTIFICATIONS_KEY = 'eduAnalyticsNotifications';
    const panel = document.getElementById('notificationPanel');
    const badge = document.getElementById('notificationBadge');
    const list = document.getElementById('notificationList');
    const markAllBtn = document.getElementById('markAllReadBtn');
    const isLoggedIn = localStorage.getItem('eduAnalyticsLoggedIn') === 'true';

    bellBtn.hidden = !isLoggedIn;
    if (!isLoggedIn) return;

    function seedNotifications() {
        if (localStorage.getItem(NOTIFICATIONS_KEY)) return;
        const seed = [
            { id: 1, type: 'watch', icon: 'fa-triangle-exclamation', title: 'Attendance Alert', message: "Sara Malik's attendance dropped below 75%.", time: '2h ago', read: false },
            { id: 2, type: 'good', icon: 'fa-file-lines', title: 'New Grade Posted', message: 'Amara Khan scored 92% in Science.', time: '5h ago', read: false },
            { id: 3, type: 'good', icon: 'fa-user-plus', title: 'New Student Registered', message: 'Zain Abbas has been added to Grade 10.', time: '1d ago', read: false },
            { id: 4, type: 'risk', icon: 'fa-circle-exclamation', title: 'At-Risk Student', message: 'Usman Raza needs immediate attention.', time: '2d ago', read: true }
        ];
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(seed));
    }

    function getNotifications() {
        try {
            return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveNotifications(notifications) {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }

    function render() {
        const notifications = getNotifications();
        const unreadCount = notifications.filter((n) => !n.read).length;

        badge.textContent = unreadCount;
        badge.hidden = unreadCount === 0;

        if (notifications.length === 0) {
            list.innerHTML = '<p class="notification-empty">No notifications yet.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        notifications.forEach((n) => {
            const item = document.createElement('div');
            item.className = `notification-item${n.read ? '' : ' unread'}`;
            item.dataset.id = n.id;
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-label', `${n.title}: ${n.message}${n.read ? '' : ' (unread)'}`);
            item.innerHTML = `
                <div class="notification-icon ${n.type}"><i class="fa-solid ${n.icon}"></i></div>
                <div class="notification-text">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <span class="notification-time">${n.time}</span>
                </div>
                ${n.read ? '' : '<div class="notification-unread-dot"></div>'}
            `;
            fragment.appendChild(item);
        });

        list.innerHTML = '';
        list.appendChild(fragment);
    }

    // one delegated listener instead of re-attaching a click+keydown handler
    // to every notification item on every single render() call
    function markNotificationRead(id) {
        const all = getNotifications();
        const target = all.find((x) => String(x.id) === String(id));
        if (target) target.read = true;
        saveNotifications(all);
        render();
    }

    list.addEventListener('click', (e) => {
        const item = e.target.closest('.notification-item');
        if (item) markNotificationRead(item.dataset.id);
    });

    list.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const item = e.target.closest('.notification-item');
        if (item) {
            e.preventDefault();
            markNotificationRead(item.dataset.id);
        }
    });

    function openPanel() {
        panel.hidden = false;
        bellBtn.setAttribute('aria-expanded', 'true');
        const firstItem = panel.querySelector('.notification-item');
        if (firstItem) firstItem.focus();
    }

    function closePanel() {
        panel.hidden = true;
        bellBtn.setAttribute('aria-expanded', 'false');
    }

    seedNotifications();
    render();

    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.hidden ? openPanel() : closePanel();
    });

    markAllBtn.addEventListener('click', () => {
        const all = getNotifications().map((n) => ({ ...n, read: true }));
        saveNotifications(all);
        render();
    });

    document.addEventListener('click', (e) => {
        if (!panel.hidden && !panel.contains(e.target) && !bellBtn.contains(e.target)) {
            closePanel();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !panel.hidden) closePanel();
    });
})();

/* =============================================================
   TASK 4 (WEEK 4): DARK MODE / LIGHT MODE TOGGLE
   The inline <script> in each page's <head> already applies a saved
   dark preference before first paint (avoids a flash of light mode).
   This block just keeps things consistent and wires up the toggle
   button's click handler, on whichever pages have one.
   ============================================================= */
(function () {
    const THEME_KEY = 'eduAnalyticsTheme';
    const toggleBtn = document.getElementById('themeToggleBtn');
    const toggleIcon = document.getElementById('themeToggleIcon');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (toggleIcon) toggleIcon.className = 'fa-solid fa-lightbulb';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (toggleIcon) toggleIcon.className = 'fa-solid fa-moon';
        }
    }

    // re-apply on every page load so the icon matches the saved state
    // (the inline head script already set the attribute; this just syncs the icon)
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);

    if (!toggleBtn) return; // this page has no toggle button (e.g. login/signup)

    toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
    });
})();

/* =============================================================
   TASK 3 (WEEK 4): PROFILE MANAGEMENT PAGE
   Lets the logged-in user view/edit their name+email and change
   their password. Role is shown but read-only (changing your own
   role would be a privilege-escalation bug, not a feature).
   ============================================================= */
(function () {
    const loginRequiredEl = document.getElementById('profileLoginRequired');
    if (!loginRequiredEl) return; // only run on profile.html

    const profileContent = document.getElementById('profileContent');
    const isLoggedIn = localStorage.getItem('eduAnalyticsLoggedIn') === 'true';
    const currentEmail = localStorage.getItem('eduAnalyticsUserEmail');

    if (!isLoggedIn || !currentEmail) {
        loginRequiredEl.hidden = false;
        return;
    }

    const currentUser = findUserByEmail(currentEmail);
    if (!currentUser) {
        loginRequiredEl.hidden = false;
        return;
    }

    profileContent.hidden = false;

    // --- populate the hero + info form with the current user's data ---
    const initials = currentUser.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('profileAvatar').textContent = initials;
    document.getElementById('profileNameDisplay').textContent = currentUser.name;
    document.getElementById('profileRoleBadge').textContent = currentUser.role || 'admin';
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileRoleField').value =
        (currentUser.role || 'admin').charAt(0).toUpperCase() + (currentUser.role || 'admin').slice(1);

    // --- profile info form (name + email) ---
    const infoForm = document.getElementById('profileInfoForm');
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const nameError = document.getElementById('profileNameError');
    const emailError = document.getElementById('profileEmailError');
    const infoMessage = document.getElementById('profileInfoMessage');

    function validateName() {
        const name = nameInput.value.trim();
        return setFieldError(nameInput, nameError,
            !name ? 'Name is required.' :
            name.length < 2 ? 'Name must be at least 2 characters.' : '');
    }

    function validateEmailField() {
        const email = emailInput.value.trim();
        return setFieldError(emailInput, emailError,
            !email ? 'Email is required.' :
            !isValidEmail(email) ? 'Enter a valid email address.' : '');
    }

    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmailField);

    infoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();

        const isValid = [validateName(), validateEmailField()].every(Boolean);

        if (!isValid) {
            infoMessage.hidden = true;
            return;
        }

        // if the email changed, make sure it's not already taken by someone else
        const users = getUsers();
        const existingOwner = users.find((u) => u.email.toLowerCase() === newEmail.toLowerCase());
        if (existingOwner && existingOwner.email.toLowerCase() !== currentUser.email.toLowerCase()) {
            showFormMessage(infoMessage, 'That email is already in use by another account.', 'error');
            return;
        }

        const idx = users.findIndex((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());
        users[idx].name = newName;
        users[idx].email = newEmail;
        saveUsers(users);

        // keep the session in sync with the (possibly changed) name/email
        localStorage.setItem('eduAnalyticsUserName', newName);
        localStorage.setItem('eduAnalyticsUserEmail', newEmail);
        currentUser.name = newName;
        currentUser.email = newEmail;

        document.getElementById('profileNameDisplay').textContent = newName;
        document.getElementById('profileAvatar').textContent =
            newName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

        infoMessage.hidden = true;
        showToast('Profile updated successfully.', 'success');
    });

    [[nameInput, nameError], [emailInput, emailError]].forEach(([input, errorEl]) => {
        input.addEventListener('input', () => setFieldError(input, errorEl, ''));
    });

    // --- change password form ---
    const passwordForm = document.getElementById('passwordChangeForm');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPasswordProfile');
    const confirmNewPasswordInput = document.getElementById('confirmNewPasswordProfile');
    const currentPasswordError = document.getElementById('currentPasswordError');
    const newPasswordError = document.getElementById('newPasswordProfileError');
    const confirmNewPasswordError = document.getElementById('confirmNewPasswordProfileError');
    const passwordMessage = document.getElementById('passwordMessage');

    function validateCurrentPassword() {
        const currentPassword = currentPasswordInput.value;
        return setFieldError(currentPasswordInput, currentPasswordError,
            !currentPassword ? 'Current password is required.' :
            currentPassword !== currentUser.password ? 'Current password is incorrect.' : '');
    }

    function validateNewPassword() {
        const newPassword = newPasswordInput.value;
        return setFieldError(newPasswordInput, newPasswordError,
            !newPassword ? 'New password is required.' :
            newPassword.length < 8 ? 'Password must be at least 8 characters.' : '');
    }

    function validateConfirmNewPassword() {
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;
        return setFieldError(confirmNewPasswordInput, confirmNewPasswordError,
            !confirmNewPassword ? 'Please confirm your new password.' :
            confirmNewPassword !== newPassword ? 'Passwords do not match.' : '');
    }

    currentPasswordInput.addEventListener('blur', validateCurrentPassword);
    newPasswordInput.addEventListener('blur', validateNewPassword);
    confirmNewPasswordInput.addEventListener('blur', validateConfirmNewPassword);

    passwordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newPassword = newPasswordInput.value;

        const isValid = [
            validateCurrentPassword(),
            validateNewPassword(),
            validateConfirmNewPassword()
        ].every(Boolean);

        if (!isValid) {
            passwordMessage.hidden = true;
            return;
        }

        const users = getUsers();
        const idx = users.findIndex((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());
        users[idx].password = newPassword;
        saveUsers(users);
        currentUser.password = newPassword;

        passwordForm.reset();
        passwordMessage.hidden = true;
        showToast('Password updated successfully.', 'success');
    });

    [[currentPasswordInput, currentPasswordError], [newPasswordInput, newPasswordError], [confirmNewPasswordInput, confirmNewPasswordError]].forEach(([input, errorEl]) => {
        input.addEventListener('input', () => setFieldError(input, errorEl, ''));
    });

    // --- logout button ---
    document.getElementById('profileLogoutBtn').addEventListener('click', performLogout);
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
        '.dashboard-hero-panel',
        '.glance-box',
        '.benefit-box',
        '.overview-card',
        '.director-card',
        '.progress-card',
        '.hero-section-dashbrd .box',
        '.chart-card',
        '.my-stat-card',
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