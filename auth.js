/**
 * Auth JS - 最终版
 */
(function() {
    // HTML 转义函数
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        var div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    // Toast
    function toast(title, msg, type) {
        var c = document.getElementById('toastContainer');
        if (!c) return;
        var t = document.createElement('div');
        t.className = 'toast toast-' + (type || 'info');
        t.innerHTML = '<span>✓</span><div><b>' + escapeHtml(title) + '</b><p>' + escapeHtml(msg) + '</p></div><button onclick="this.parentElement.remove()">×</button>';
        c.appendChild(t);
        setTimeout(function() { t.remove(); }, 4000);
    }

    // Tab 切换
    function switchTab(tab) {
        var s = document.getElementById('signinForm');
        var r = document.getElementById('registerForm');
        var st = document.getElementById('signinTab');
        var rt = document.getElementById('registerTab');
        var ft = document.getElementById('authFooterText');
        var ht = document.getElementById('authTitle');
        var sb = document.getElementById('authSubtitle');

        st.classList.remove('active');
        rt.classList.remove('active');

        if (tab === 'signin') {
            st.classList.add('active');
            s.style.display = 'flex';
            r.style.display = 'none';
            ft.innerHTML = 'No account? <a href="#" id="footerLink">Sign up</a>';
            ht.textContent = 'Welcome back';
            sb.textContent = 'Sign in to continue';
        } else {
            rt.classList.add('active');
            s.style.display = 'none';
            r.style.display = 'flex';
            ft.innerHTML = 'Have account? <a href="#" id="footerLink">Sign in</a>';
            ht.textContent = 'Create account';
            sb.textContent = 'Join us today';
        }
        document.getElementById('footerLink').onclick = function(e) { e.preventDefault(); switchTab(tab === 'signin' ? 'register' : 'signin'); };
    }

    // 密码可见
    function togglePwd(id, btn) {
        var i = document.getElementById(id);
        if (i) {
            i.type = i.type === 'password' ? 'text' : 'password';
            btn.textContent = i.type === 'password' ? '👁' : '🙈';
        }
    }

    // 验证
    function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
    function err(id, msg) {
        var el = document.getElementById(id);
        if (el) { el.textContent = msg; el.style.display = 'block'; }
    }
    function clearErr(form) {
        form.querySelectorAll('.field-error').forEach(function(el) {
            el.textContent = ''; el.style.display = 'none';
        });
    }

    // 登录
    function signIn(e) {
        e.preventDefault();
        var form = document.getElementById('signinForm');
        clearErr(form);
        var em = document.getElementById('signinEmail');
        var pw = document.getElementById('signinPassword');

        if (!em.value.trim()) { err('signinEmailError', 'Email required'); em.focus(); return; }
        if (!validEmail(em.value)) { err('signinEmailError', 'Invalid email'); em.focus(); return; }
        if (!pw.value) { err('signinPasswordError', 'Password required'); pw.focus(); return; }

        var users = JSON.parse(localStorage.getItem('users') || '[]');
        var user = users.find(function(u) { return u.email === em.value.trim(); });

        if (!user) { err('signinEmailError', 'Account not found'); return; }
        if (user.password !== pw.value) { err('signinPasswordError', 'Wrong password'); return; }

        localStorage.setItem('session', JSON.stringify({ 
            loggedIn: true, 
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
        }));
        toast('Welcome!', 'Hello, ' + user.name + '!', 'success');
        setTimeout(function() { location.href = 'index.html'; }, 1000);
    }

    // 注册
    function register(e) {
        e.preventDefault();
        var form = document.getElementById('registerForm');
        clearErr(form);
        var n = document.getElementById('regName');
        var em = document.getElementById('regEmail');
        var pw = document.getElementById('regPassword');
        var cf = document.getElementById('regConfirm');
        var ph = document.getElementById('regPhone');
        var tr = document.getElementById('agreeTerms');

        if (!n.value.trim()) { err('regNameError', 'Name required'); n.focus(); return; }
        if (n.value.trim().length < 2) { err('regNameError', 'Name too short'); n.focus(); return; }
        if (!em.value.trim()) { err('regEmailError', 'Email required'); em.focus(); return; }
        if (!validEmail(em.value)) { err('regEmailError', 'Invalid email'); em.focus(); return; }

        var users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(function(u) { return u.email === em.value.trim(); })) { err('regEmailError', 'Email taken'); return; }

        if (!pw.value) { err('regPasswordError', 'Password required'); pw.focus(); return; }
        if (pw.value.length < 8) { err('regPasswordError', 'Min 8 characters'); pw.focus(); return; }
        if (!cf.value) { err('regConfirmError', 'Confirm required'); cf.focus(); return; }
        if (pw.value !== cf.value) { err('regConfirmError', 'Passwords do not match'); cf.focus(); return; }
        if (!tr.checked) { toast('Notice', 'Please agree to Terms', 'warning'); return; }

        var newUser = { 
            id: 'USR-' + Date.now().toString(36).toUpperCase(), 
            name: n.value.trim(), 
            email: em.value.trim(), 
            password: pw.value, 
            phone: ph.value.trim() || ''
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        localStorage.setItem('session', JSON.stringify({ 
            loggedIn: true, 
            user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone }
        }));
        toast('Success!', 'Welcome, ' + newUser.name + '!', 'success');
        setTimeout(function() { location.href = 'index.html'; }, 1500);
    }

    // 忘记密码
    function showForgotModal() {
        document.getElementById('forgotModal').style.display = 'flex';
        document.getElementById('forgotEmail').value = '';
        document.getElementById('forgotError').style.display = 'none';
        document.getElementById('forgotSuccess').style.display = 'none';
    }
    function closeForgotModal() {
        document.getElementById('forgotModal').style.display = 'none';
    }
    function submitForgot() {
        var emailInput = document.getElementById('forgotEmail');
        var errorEl = document.getElementById('forgotError');
        var successEl = document.getElementById('forgotSuccess');
        var email = emailInput.value.trim();

        errorEl.style.display = 'none';
        successEl.style.display = 'none';

        if (!email) { errorEl.textContent = 'Email required'; errorEl.style.display = 'block'; return; }
        if (!validEmail(email)) { errorEl.textContent = 'Invalid email'; errorEl.style.display = 'block'; return; }

        var users = JSON.parse(localStorage.getItem('users') || '[]');
        var user = users.find(function(u) { return u.email === email });

        if (!user) { errorEl.textContent = 'Account not found'; errorEl.style.display = 'block'; return; }

        var tempPwd = 'TMP' + Math.random().toString(36).substr(2, 8).toUpperCase();
        user.password = tempPwd;
        localStorage.setItem('users', JSON.stringify(users));

        successEl.innerHTML = 'Temporary password generated!<br><span class="temp-pwd">' + tempPwd + '</span><br><small>Login and change it immediately</small>';
        successEl.style.display = 'block';
        toast('Done', 'Temporary password set', 'success');
    }

    // 主题
    function initTheme() {
        var t = localStorage.getItem('theme') || 'dark';
        if (t === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }
    function toggleTheme() {
        var t = localStorage.getItem('theme') || 'dark';
        localStorage.setItem('theme', t === 'dark' ? 'light' : 'dark');
        initTheme();
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        initTheme();

        // Tab 切换
        document.getElementById('signinTab').onclick = function() { switchTab('signin'); };
        document.getElementById('registerTab').onclick = function() { switchTab('register'); };

        // 表单提交
        document.getElementById('signinForm').onsubmit = signIn;
        document.getElementById('registerForm').onsubmit = register;

        // 密码可见性
        document.getElementById('toggleSigninPassword').onclick = function() { togglePwd('signinPassword', this); };
        document.getElementById('toggleRegPassword').onclick = function() { togglePwd('regPassword', this); };
        document.getElementById('toggleRegConfirm').onclick = function() { togglePwd('regConfirm', this); };

        // Forgot 密码
        document.getElementById('forgotLink').onclick = function(e) { e.preventDefault(); showForgotModal(); };
        document.getElementById('closeForgot').onclick = closeForgotModal;
        document.getElementById('submitForgot').onclick = submitForgot;
        document.getElementById('forgotModal').onclick = function(e) { if (e.target === this) closeForgotModal(); };
        document.getElementById('forgotEmail').onkeydown = function(e) { if (e.key === 'Enter') submitForgot(); };

        // 主题切换
        document.getElementById('themeToggle').onclick = toggleTheme;

        // 默认显示登录
        switchTab('signin');
    });
})();
