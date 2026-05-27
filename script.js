/**
 * Campus Lost & Found System - 校园失物招领系统
 * =================================================
 * 功能: 失物招领报告、浏览、智能匹配、认领管理
 * 技术: HTML5 + CSS3 + JavaScript + localStorage
 * =================================================
 */

// ========================================
// 安全工具函数 - Security Utilities
// ========================================

/**
 * HTML 转义函数 - 防止 XSS 攻击
 * 将特殊字符转换为 HTML 实体
 */
const escapeHtml = (str) => {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
};

// ========================================
// 主题管理 - Theme Management
// ========================================

/**
 * 初始化主题
 * 从localStorage读取保存的主题设置并应用到页面
 */
const initTheme = () => {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = saved;
    updateThemeIcon();
};

/**
 * 更新主题图标
 * 根据当前主题显示对应的图标(☀️深色模式/🌙浅色模式)
 */
const updateThemeIcon = () => {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = localStorage.getItem('theme') === 'light' ? '🌙' : '☀️';
};

/**
 * 切换主题
 * 在深色(Aurora Dark)和浅色(Sunrise Light)之间切换
 */
const toggleTheme = () => {
    const current = localStorage.getItem('theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    document.documentElement.dataset.theme = next;
    updateThemeIcon();
    showToast('Theme Changed', `Switched to ${next === 'dark' ? 'Aurora Dark' : 'Liquid Light'}`, 'info');
};

// ========================================
// 移动端导航 - Mobile Navigation
// ========================================

/**
 * 初始化移动端汉堡菜单
 * 点击切换导航栏显示/隐藏
 */
const initMobileNav = () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.navbar-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('show');
        });
    }
};

// ========================================
// 示例数据 (30条)
// ========================================
const initializeSampleData = () => {
    const now = Date.now();
    const baseItem = (id, type, name, cat, zone, loc, date, desc, urgency, status, claims = []) => ({
        id, type, name, category: cat, locationZone: zone, location: loc, date, description: desc,
        contact: type === 'Lost' ? 'student@example.com' : 'campus-help@example.com',
        urgency, status, claims, createdAt: now - (now - new Date(date).getTime())
    });
    
    const sampleItems = [
        baseItem(generateId(), 'Lost', 'iPhone 14 Pro', 'Phone', 'Library', '3rd Floor Study Area', '2026-05-20', 'Black iPhone 14 Pro in clear case.', 'High', 'Pending'),
        baseItem(generateId(), 'Lost', 'Nike Blue Backpack', 'Bag', 'Classroom', 'Room 305', '2026-05-19', 'Blue Nike backpack with laptop.', 'Medium', 'Pending'),
        baseItem(generateId(), 'Lost', 'AirPods Pro 2nd Gen', 'Earbuds', 'Sports Area', 'Basketball Court', '2026-05-21', 'White AirPods Pro with blue stickers.', 'High', 'Pending'),
        baseItem(generateId(), 'Lost', 'BMW Car Keys', 'Keys', 'Dormitory', 'Building B Lobby', '2026-05-18', 'Silver BMW keys with leather keychain.', 'High', 'Pending'),
        baseItem(generateId(), 'Lost', 'Engineering Textbook', 'Book', 'Office', 'Admin Building 2nd Floor', '2026-05-17', 'Fundamentals of Engineering textbook.', 'Low', 'Pending'),
        baseItem(generateId(), 'Lost', 'Campus Student ID', 'ID Card', 'Canteen', 'Main Dining Hall', '2026-05-21', 'White student ID with blue lanyard.', 'High', 'Pending'),
        baseItem(generateId(), 'Lost', 'Black Reading Glasses', 'Other', 'Library', 'Quiet Reading Room', '2026-05-16', 'Black rectangular reading glasses.', 'Medium', 'Pending'),
        baseItem(generateId(), 'Lost', 'MacBook Air Charger', 'Laptop', 'Canteen', 'Table 12', '2026-05-20', 'White Apple MacBook Air charger.', 'Medium', 'Pending'),
        baseItem(generateId(), 'Lost', 'TI-84 Calculator', 'Other', 'Classroom', 'Room 401', '2026-05-19', 'Texas Instruments graphing calculator.', 'Medium', 'Pending'),
        baseItem(generateId(), 'Lost', 'Blue Umbrella', 'Other', 'Dormitory', 'Building A Entrance', '2026-05-18', 'Compact blue automatic umbrella.', 'Low', 'Pending'),
        baseItem(generateId(), 'Lost', 'Water Bottle', 'Other', 'Student Center', 'Cafe Seating Area', '2026-05-21', 'Silver metal water bottle.', 'Low', 'Pending'),
        baseItem(generateId(), 'Lost', 'Samsung Galaxy Earbuds', 'Earbuds', 'Library', '2nd Floor Lobby', '2026-05-19', 'Black Samsung Galaxy Buds2 Pro.', 'Medium', 'Pending'),
        baseItem(generateId(), 'Found', 'Student ID Card', 'ID Card', 'Canteen', 'Near Exit Door', '2026-05-20', 'Student ID found on bench.', 'High', 'Pending'),
        baseItem(generateId(), 'Found', 'Silver USB Drive', 'Other', 'Library', 'Computer Lab Desk 7', '2026-05-19', '16GB silver USB drive.', 'Low', 'Pending'),
        baseItem(generateId(), 'Found', 'Calculus Textbook', 'Book', 'Library', 'Group Study Room B', '2026-05-17', 'Calculus: Early Transcendentals 8th Ed.', 'Medium', 'Pending'),
        baseItem(generateId(), 'Found', 'Black Leather Wallet', 'Wallet', 'Dormitory', 'Main Entrance', '2026-05-19', 'Slim black leather wallet.', 'High', 'Claimed', [
            { claimantName: 'Sarah Williams', contact: 'sample@example.com', proof: 'Can describe contents', createdAt: now - 1800000, reviewed: true }
        ]),
        baseItem(generateId(), 'Found', 'Sony Earbuds', 'Earbuds', 'Sports Area', 'Tennis Court Benches', '2026-05-21', 'Black Sony WF-1000XM4 earbuds.', 'Medium', 'Pending'),
        baseItem(generateId(), 'Found', 'Mechanical Pencil Set', 'Other', 'Canteen', 'Food Court Table', '2026-05-20', 'Set of 5 blue mechanical pencils.', 'Low', 'Pending'),
        baseItem(generateId(), 'Found', 'Blue Hydro Flask', 'Other', 'Sports Area', 'Gym Lobby', '2026-05-18', 'Blue Hydro Flask 32oz.', 'Low', 'Pending'),
        baseItem(generateId(), 'Found', 'Spiral Notebook', 'Other', 'Classroom', 'Room 208', '2026-05-21', 'Blue spiral notebook.', 'Low', 'Pending'),
        baseItem(generateId(), 'Found', 'Pencil Case', 'Other', 'Library', 'Study Carrels', '2026-05-20', 'Purple fabric pencil case.', 'Low', 'Pending'),
        baseItem(generateId(), 'Found', 'MacBook Charger', 'Laptop', 'Classroom', 'Computer Lab 101', '2026-05-19', 'Apple USB-C MacBook charger 61W.', 'Medium', 'Pending'),
        baseItem(generateId(), 'Found', 'Red Gym Bag', 'Bag', 'Sports Area', 'Locker Room', '2026-05-20', 'Red Nike drawstring gym bag.', 'Medium', 'Claimed', [
            { claimantName: 'John Smith', contact: 'sample@example.com', proof: 'Can describe bag contents', createdAt: now - 3600000, reviewed: true }
        ]),
        baseItem(generateId(), 'Found', 'White iPad Case', 'Phone', 'Office', 'Meeting Room 3', '2026-05-18', 'White Apple iPad Smart Cover.', 'Low', 'Pending'),
        baseItem(generateId(), 'Found', 'Car Keys', 'Keys', 'Dormitory', 'Building C Stairs', '2026-05-17', 'Toyota car keys on black lanyard.', 'High', 'Claimed', [
            { claimantName: 'Emily Davis', contact: 'sample@example.com', proof: 'Described car model correctly', createdAt: now - 7200000, reviewed: true }
        ]),
        baseItem(generateId(), 'Lost', 'Dell Laptop', 'Laptop', 'Library', 'Main Reading Room', '2026-05-16', 'Dell XPS 13 laptop in gray sleeve.', 'High', 'Claimed', [
            { claimantName: 'Lisa Wang', contact: 'sample@example.com', proof: 'Can describe stickers', createdAt: now - 10800000, reviewed: true }
        ]),
        baseItem(generateId(), 'Found', 'Phone Charger', 'Phone', 'Classroom', 'Room 502', '2026-05-19', 'Samsung fast charger with USB-C.', 'Low', 'Claimed', [
            { claimantName: 'Tom Brown', contact: 'sample@example.com', proof: 'Has same phone model', createdAt: now - 5400000, reviewed: true }
        ]),
        baseItem(generateId(), 'Lost', 'Pearl Necklace', 'Other', 'Dormitory', 'Common Room', '2026-05-18', 'White pearl necklace in pouch.', 'Medium', 'Claimed', [
            { claimantName: 'Anna Lee', contact: 'sample@example.com', proof: 'Has matching receipt', createdAt: now - 9000000, reviewed: true }
        ]),
        baseItem(generateId(), 'Lost', 'Library History Book', 'Book', 'Library', 'Circulation Desk', '2026-05-10', 'History of World Civilizations textbook.', 'Low', 'Returned'),
        baseItem(generateId(), 'Lost', 'Samsung Phone Case', 'Phone', 'Canteen', 'Food Court', '2026-05-12', 'Clear phone case with student ID.', 'Medium', 'Returned')
    ];
    localStorage.setItem('items', JSON.stringify(sampleItems));
};

// ========================================
// 工具函数 - Utility Functions
// ========================================

/**
 * 设置元素文本内容
 * @param {string} id - 元素ID
 * @param {string} value - 要设置的文本值
 */
const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
};

/**
 * 计算统计数据
 * @param {Array} items - 物品数组
 * @returns {Object} 统计数据对象
 */
const calculateStats = (items) => ({
    total: items.length,
    lost: items.filter(i => i.type === 'Lost').length,
    found: items.filter(i => i.type === 'Found').length,
    claimed: items.filter(i => i.status === 'Claimed').length,
    returned: items.filter(i => i.status === 'Returned').length,
    high: items.filter(i => i.urgency === 'High').length
});

/**
 * 更新所有统计显示(首页和浏览页)
 */
const updateAllStats = () => {
    const items = getAllItems();
    const stats = calculateStats(items);
    const ids = ['statTotal', 'statLost', 'statFound', 'statClaimed', 'statReturned', 'statHigh',
                  'homeStatTotal', 'homeStatLost', 'homeStatFound', 'homeStatClaimed', 'homeStatReturned', 'homeStatHigh'];
    ids.forEach((id, i) => setText(id, stats[ids[i % 6]]));
};

/**
 * 生成唯一ID
 * 格式: LF-时间戳-随机字符
 */
const generateId = () => 'LF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();

/**
 * 获取所有物品
 * 如果localStorage为空则初始化示例数据
 * @returns {Array} 物品数组
 */
const getAllItems = () => {
    try {
        let items = JSON.parse(localStorage.getItem('items'));
        if (!items?.length) { initializeSampleData(); items = JSON.parse(localStorage.getItem('items')); }
        return items.map(normalizeItemData);
    } catch { initializeSampleData(); return JSON.parse(localStorage.getItem('items')).map(normalizeItemData); }
};

/**
 * 标准化物品数据
 * 确保每个物品都有必需的字段和默认值
 */
const normalizeItemData = (item) => ({
    id: item.id || generateId(),
    type: item.type || 'Lost',
    name: item.name || 'Unknown Item',
    category: item.category || 'Other',
    locationZone: item.locationZone || 'Other',
    location: item.location || '',
    date: item.date || new Date().toISOString().split('T')[0],
    description: item.description || '',
    contact: item.contact || '',
    urgency: item.urgency || 'Medium',
    status: item.status || 'Pending',
    claims: item.claims || [],
    createdAt: item.createdAt || Date.now()
});

/**
 * 保存物品到localStorage
 */
const saveItems = (items) => localStorage.setItem('items', JSON.stringify(items));

/**
 * 格式化日期显示
 */
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/**
 * 获取类别图标
 * @param {string} cat - 物品类别
 * @returns {string} 对应的emoji图标
 */
const getCategoryIcon = (cat) => ({
    'ID Card': '🪪', 'Phone': '📱', 'Bag': '🎒', 'Book': '📚', 'Keys': '🔑',
    'Wallet': '👛', 'Laptop': '💻', 'Earbuds': '🎧', 'Other': '📦'
}[cat] || '📦');

// ========================================
// 智能匹配算法 - Smart Matching Algorithm
// ========================================

/**
 * 计算两个物品的匹配分数
 * 评分规则:
 * - 类别相同: +30分
 * - 名称完全包含: +25分
 * - 名称部分包含(4字符以上词): +15分
 * - 区域相同: +20分
 * 
 * @param {Object} item1 - 物品1
 * @param {Object} item2 - 物品2
 * @returns {number} 匹配分数(0-75)
 */
const calculateMatchScore = (item1, item2) => {
    let score = 0;
    if (item1.category === item2.category) score += 30;  // 类别匹配
    const n1 = item1.name.toLowerCase(), n2 = item2.name.toLowerCase();
    if (n1.includes(n2) || n2.includes(n1)) score += 25;  // 名称包含
    else if (n1.split(' ').some(w => n2.includes(w) && w.length > 3)) score += 15;  // 部分词匹配
    if (item1.locationZone === item2.locationZone) score += 20;  // 区域匹配
    return score;
};

/**
 * 查找与新物品可能匹配的物品
 * 用于报告时即时显示匹配结果
 * 
 * @param {Object} newItem - 新报告的物品
 * @param {number} limit - 返回数量限制
 * @returns {Array} 匹配的物品数组(含分数和级别)
 */
const findPossibleMatches = (newItem, limit = 3) => {
    const allItems = getAllItems();
    // 失物找招领，招领找失物
    const targetType = newItem.type === 'Lost' ? 'Found' : 'Lost';
    
    return allItems
        .filter(item => item.id !== newItem.id && item.type === targetType && item.status === 'Pending')
        .map(item => ({ 
            item, 
            score: calculateMatchScore(newItem, item), 
            level: score >= 55 ? 'High' : score >= 40 ? 'Medium' : 'Low' 
        }))
        .filter(m => m.score >= 25)  // 最低25分才算匹配
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
};

/**
 * 获取所有可能的匹配对
 * 用于匹配收件箱显示
 * 
 * @param {number} limit - 返回数量限制
 * @returns {Array} 匹配对数组(lost-found配对)
 */
const getAllMatches = (limit = 5) => {
    const allItems = getAllItems();
    const lostItems = allItems.filter(i => i.type === 'Lost' && i.status === 'Pending');
    const foundItems = allItems.filter(i => i.type === 'Found' && i.status === 'Pending');
    
    const matches = [];
    lostItems.forEach(lost => {
        foundItems.forEach(found => {
            const score = calculateMatchScore(lost, found);
            if (score >= 35) {  // 配对需要35分以上
                matches.push({ lost, found, score, level: score >= 55 ? 'High' : score >= 45 ? 'Medium' : 'Low' });
            }
        });
    });
    return matches.sort((a, b) => b.score - a.score).slice(0, limit);
};

// ========================================
// Toast 通知
// ========================================
const showToast = (title, message, type = 'info') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><div class="toast-content"><div class="toast-title">${escapeHtml(title)}</div><div class="toast-message">${escapeHtml(message)}</div></div><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
};

// ========================================
// 活动日志
// ========================================
const addActivityLog = (action, itemName) => {
    const log = JSON.parse(localStorage.getItem('activityLog')) || [];
    log.unshift({ action, itemName, time: Date.now() });
    if (log.length > 10) log.length = 10;
    localStorage.setItem('activityLog', JSON.stringify(log));
};

const getTimeAgo = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
};

const renderActivityLog = () => {
    const container = document.getElementById('activityLogPreview');
    if (!container) return;
    const log = JSON.parse(localStorage.getItem('activityLog')) || [];
    if (!log.length) { container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No recent activity</p>'; return; }
    const icons = { 'reported-lost': '📋', 'reported-found': '📦', returned: '✅', claimed: '📬', deleted: '🗑️' };
    const texts = { 'reported-lost': 'Lost item reported', 'reported-found': 'Found item reported', returned: 'Marked as returned', claimed: 'Claim requested', deleted: 'Item deleted' };
    container.innerHTML = log.slice(0, 5).map(e => `<div class="activity-item"><span class="activity-icon">${icons[e.action] || '📋'}</span><div><p class="activity-text">${texts[e.action] || e.action}: ${escapeHtml(e.itemName)}</p><p class="activity-time">${getTimeAgo(e.time)}</p></div></div>`).join('');
};

// ========================================
// 自定义下拉框
// ========================================
const initCustomDropdowns = () => {
    document.querySelectorAll('.liquid-dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!trigger || !menu) return;
        
        trigger.addEventListener('click', e => {
            e.stopPropagation();
            document.querySelectorAll('.dropdown-menu.active, .dropdown-trigger.active').forEach(el => {
                if (el !== menu && el !== trigger) el.classList.remove('active');
            });
            trigger.classList.toggle('active');
            menu.classList.toggle('active');
        });
        
        menu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', e => {
                e.stopPropagation();
                const labelSpan = item.querySelector('.option-label');
                trigger.querySelector('span:first-child').textContent = labelSpan ? labelSpan.textContent : item.textContent;
                menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                trigger.classList.remove('active');
                menu.classList.remove('active');
                if (typeof renderItems === 'function') renderItems();
            });
        });
    });
    
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu.active, .dropdown-trigger.active').forEach(el => el.classList.remove('active'));
    });
};

const getDropdownValue = (id) => {
    const dropdown = document.getElementById(id);
    return dropdown?.querySelector('.dropdown-item.selected')?.dataset.value || '';
};

// ========================================
// 报告表单
// ========================================
const initReportForm = () => {
    const form = document.getElementById('reportForm');
    if (form) form.addEventListener('submit', e => { e.preventDefault(); if (validateReportForm()) submitReport(); });
    initImagePreview();
};

const validateReportForm = () => {
    let valid = true;
    const clearErrors = () => document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    const showError = (id, msg) => { const el = document.getElementById(id); if (el) { el.textContent = msg; valid = false; } };
    clearErrors();
    if (!document.querySelector('input[name="itemType"]:checked')) showError('typeError', 'Select item type');
    if (!document.getElementById('itemName')?.value.trim()) showError('nameError', 'Item name required');
    if (!document.getElementById('itemCategory')?.value) showError('categoryError', 'Select category');
    if (!document.getElementById('locationZone')?.value) showError('zoneError', 'Select location zone');
    if (!document.getElementById('itemLocation')?.value.trim()) showError('locationError', 'Location required');
    if (!document.getElementById('itemDate')?.value) showError('dateError', 'Date required');
    if (!document.getElementById('itemDescription')?.value.trim()) showError('descriptionError', 'Description required');
    if (!document.getElementById('itemContact')?.value.trim()) showError('contactError', 'Contact required');
    return valid;
};

const submitReport = () => {
    const type = document.querySelector('input[name="itemType"]:checked').value;
    const urgency = document.querySelector('input[name="itemUrgency"]:checked')?.value || 'Medium';
    
    const newItem = {
        id: generateId(),
        type: type === 'lost' ? 'Lost' : 'Found',
        name: document.getElementById('itemName').value.trim(),
        category: document.getElementById('itemCategory').value,
        locationZone: document.getElementById('locationZone').value,
        location: document.getElementById('itemLocation').value.trim(),
        date: document.getElementById('itemDate').value,
        description: document.getElementById('itemDescription').value.trim(),
        contact: document.getElementById('itemContact').value.trim(),
        urgency, status: 'Pending', claims: [], createdAt: Date.now()
    };
    
    const items = getAllItems();
    items.unshift(newItem);
    saveItems(items);
    addActivityLog(newItem.type === 'Lost' ? 'reported-lost' : 'reported-found', newItem.name);
    
    const matches = findPossibleMatches(newItem);
    showToast('Report Submitted', `"${newItem.name}" has been recorded`, 'success');
    
    const fb = document.getElementById('formFeedback');
    if (fb) {
        const matchesHtml = matches.length ? `<div class="match-highlight" style="margin-top: 1rem;"><div class="match-highlight-title">🔗 Possible Matches (${matches.length})</div>${matches.map(m => `<div class="match-highlight-item"><span class="match-highlight-name">${getCategoryIcon(m.item.category)} ${escapeHtml(m.item.name)}</span><span class="match-highlight-level">${escapeHtml(m.level)}</span></div>`).join('')}</div>` : '';
        fb.className = 'glass-alert glass-alert-success visible';
        fb.innerHTML = `<div class="alert-title">✓ Report Submitted!</div><p>Your ${newItem.type === 'Lost' ? 'lost' : 'found'} item has been recorded.${matchesHtml}</p><div class="alert-actions"><a href="items.html" class="liquid-btn liquid-btn-primary liquid-btn-sm">View Items</a><button onclick="resetReportForm()" class="liquid-btn liquid-btn-secondary liquid-btn-sm">New Report</button></div>`;
        document.getElementById('reportForm').reset();
        document.getElementById('itemDate').valueAsDate = new Date();
    }
    updateAllStats();
};

const resetReportForm = () => {
    const fb = document.getElementById('formFeedback');
    if (fb) { fb.className = 'glass-alert'; fb.style.display = 'none'; }
    const dateInput = document.getElementById('itemDate');
    if (dateInput) dateInput.valueAsDate = new Date();
};

// ========================================
// 图片预览
// ========================================
const initImagePreview = () => {
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('itemImage');
    const preview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--accent-primary)'; });
    uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
    uploadArea.addEventListener('drop', e => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleImageFile(fileInput.files[0]); });
    if (removeBtn) removeBtn.addEventListener('click', () => { fileInput.value = ''; preview.style.display = 'none'; uploadArea.style.display = 'block'; });
    
    const handleImageFile = (file) => {
        if (!file.type.startsWith('image/')) { showToast('Invalid File', 'Please select an image', 'error'); return; }
        const reader = new FileReader();
        reader.onload = e => { const img = document.getElementById('previewImg'); if (img) img.src = e.target.result; preview.style.display = 'inline-block'; uploadArea.style.display = 'none'; };
        reader.readAsDataURL(file);
    };
};

// ========================================
// 物品浏览
// ========================================
let currentManageMode = sessionStorage.getItem('manageMode') === 'true';

const initItemsPage = () => {
    const grid = document.getElementById('itemsGrid');
    if (!grid) return;
    
    getAllItems();
    updateAllStats();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', debounce(renderItems, 300));
    
    ['fromDateInput', 'toDateInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', renderItems);
    });
    
    initCustomDropdowns();
    ['clearFiltersBtn', 'emptyClearBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', clearFilters);
    });
    
    const manageBtn = document.getElementById('manageModeBtn');
    if (manageBtn) { manageBtn.addEventListener('click', toggleManageMode); updateManageModeUI(); }
    
    initDetailDrawer();
    renderItems();
    renderMatchInbox();
    renderClaimCenter();
    renderRecentlyReturned();
};

const debounce = (fn, wait) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
};

const clearFilters = () => {
    ['searchInput', 'fromDateInput', 'toDateInput'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['type', 'category', 'zone', 'status'].forEach(id => {
        const dd = document.getElementById(id + 'Dropdown');
        if (dd) {
            const first = dd.querySelector('.dropdown-item');
            const trigger = dd.querySelector('.dropdown-trigger span:first-child');
            if (first && trigger) {
                trigger.textContent = first.querySelector('.option-label')?.textContent || first.textContent;
                dd.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
                first.classList.add('selected');
            }
        }
    });
    renderItems();
    showToast('Filters Cleared', 'Showing all items', 'info');
};

const renderItems = () => {
    const grid = document.getElementById('itemsGrid');
    const empty = document.getElementById('emptyState');
    const count = document.getElementById('itemsCount');
    if (!grid) return;
    
    let items = getAllItems();
    const total = items.length;
    
    // Filters
    const typeVal = getDropdownValue('typeDropdown');
    if (typeVal === 'lost') items = items.filter(i => i.type === 'Lost');
    else if (typeVal === 'found') items = items.filter(i => i.type === 'Found');
    
    const zoneVal = getDropdownValue('zoneDropdown');
    if (zoneVal) items = items.filter(i => i.locationZone === zoneVal);
    
    const searchVal = document.getElementById('searchInput')?.value.toLowerCase();
    if (searchVal) items = items.filter(i => i.name.toLowerCase().includes(searchVal) || i.description.toLowerCase().includes(searchVal));
    
    const catVal = getDropdownValue('categoryDropdown');
    if (catVal) items = items.filter(i => i.category === catVal);
    
    const statusVal = getDropdownValue('statusDropdown');
    if (statusVal) items = items.filter(i => i.status === statusVal);
    
    // Date range
    const fromDate = document.getElementById('fromDateInput');
    const toDate = document.getElementById('toDateInput');
    if (fromDate?.value) items = items.filter(i => new Date(i.date).getTime() >= new Date(fromDate.value).getTime());
    if (toDate?.value) items = items.filter(i => new Date(i.date).getTime() <= new Date(toDate.value).getTime() + 86400000);
    
    // Sort
    const sortVal = getDropdownValue('sortDropdown') || 'newest';
    if (sortVal === 'priority') items.sort((a, b) => (['High', 'Medium', 'Low'].indexOf(a.urgency) - ['High', 'Medium', 'Low'].indexOf(b.urgency)));
    else items.sort((a, b) => sortVal === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
    
    if (count) count.textContent = (searchVal || catVal || statusVal || zoneVal || typeVal || fromDate?.value || toDate?.value) ? `Showing ${items.length} of ${total}` : `${total} items`;
    
    if (!items.length) { grid.style.display = 'none'; if (empty) empty.style.display = 'block'; return; }
    grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';
    grid.innerHTML = items.map(createItemCard).join('');
};

const createItemCard = (item) => {
    const manage = currentManageMode;
    const claims = item.claims?.length > 0;
    return `<div class="item-card glass-card glass-card-normal" onclick="console.log('Card clicked:', '${item.id}'); openDetailView('${item.id}')">
        <div class="item-card-header">
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                <span class="glass-chip chip-${item.type.toLowerCase()}">${item.type === 'Lost' ? '🔴' : '🟢'} ${item.type}</span>
                <span class="glass-chip chip-${item.urgency.toLowerCase()}">${escapeHtml(item.urgency)}</span>
            </div>
            <span class="glass-chip chip-${item.status.toLowerCase()}">${escapeHtml(item.status)}</span>
        </div>
        <h3 class="item-name">${getCategoryIcon(item.category)} ${escapeHtml(item.name)}</h3>
        <div class="item-meta">
            <span class="item-meta-item"><span>📍</span> ${escapeHtml(item.locationZone)}</span>
            <span class="item-meta-item"><span>📅</span> ${formatDate(item.date)}</span>
            ${claims ? `<span class="item-meta-item"><span>📬</span> ${item.claims.length} claim${item.claims.length > 1 ? 's' : ''}</span>` : ''}
        </div>
        <p class="item-description">${escapeHtml(item.description)}</p>
        <div class="item-footer">
            <button class="liquid-btn liquid-btn-sm liquid-btn-secondary" style="flex: 2;" onclick="event.stopPropagation(); openDetailView('${item.id}')"><span>👁️</span> Details</button>
            ${item.status === 'Pending' && item.type === 'Found' && !manage ? `<button class="liquid-btn liquid-btn-sm liquid-btn-secondary" style="flex: 1;" onclick="openClaimForm('${item.id}')"><span>📬</span></button>` : ''}
            ${manage ? `<button class="liquid-btn liquid-btn-sm liquid-btn-success" style="flex: 1;" onclick="markAsReturned('${item.id}')"><span>✅</span></button><button class="liquid-btn liquid-btn-sm liquid-btn-danger" style="flex: 1;" onclick="deleteItem('${item.id}')"><span>🗑️</span></button>` : ''}
        </div>
    </div>`;
};

const renderMatchInbox = () => {
    const container = document.getElementById('matchInboxList');
    if (!container) return;
    const matches = getAllMatches();
    if (!matches.length) { container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1rem;">No potential matches found.</p>'; return; }
    container.innerHTML = matches.map(m => `<div class="match-pair">
        <div class="match-item"><span class="match-item-type lost">🔴 Lost</span><span class="match-item-name">${getCategoryIcon(m.lost.category)} ${escapeHtml(m.lost.name)}</span></div>
        <span class="match-arrow">⇄</span>
        <div class="match-item"><span class="match-item-type found">🟢 Found</span><span class="match-item-name">${getCategoryIcon(m.found.category)} ${escapeHtml(m.found.name)}</span></div>
        <span class="match-level-badge ${m.level.toLowerCase()}">${escapeHtml(m.level)}</span>
    </div>`).join('');
};

const getPendingClaims = () => {
    const claims = [];
    getAllItems().forEach(item => {
        item.claims?.forEach((claim, idx) => {
            if (!claim.reviewed) claims.push({ item, claim, idx });
        });
    });
    return claims;
};

const renderClaimCenter = () => {
    const section = document.getElementById('claimCenterSection');
    const container = document.getElementById('claimCenterList');
    if (!section || !container) return;
    const claims = getPendingClaims();
    if (!claims.length) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    container.innerHTML = claims.map(c => `<div class="claim-item">
        <div class="claim-info">
            <span class="claim-item-name">${getCategoryIcon(c.item.category)} ${escapeHtml(c.item.name)}</span>
            <span class="claim-claimant">From: ${escapeHtml(c.claim.claimantName)}</span>
            <span class="claim-proof">"${escapeHtml(c.claim.proof)}"</span>
            <span class="claim-status pending">⏳ Pending Review</span>
        </div>
        <div class="claim-actions">
            <button class="liquid-btn liquid-btn-sm liquid-btn-success" onclick="approveClaim('${c.item.id}', ${c.idx})">✓ Approve</button>
            <button class="liquid-btn liquid-btn-sm liquid-btn-danger" onclick="rejectClaim('${c.item.id}', ${c.idx})">✗ Reject</button>
        </div>
    </div>`).join('');
};

const approveClaim = (itemId, claimIndex) => {
    if (!currentManageMode) { showToast('Access Denied', 'Manage Mode required', 'error'); return; }
    const items = getAllItems();
    const item = items.find(i => i.id === itemId);
    if (item?.claims[claimIndex]) {
        item.claims[claimIndex].reviewed = true;
        item.claims[claimIndex].status = 'approved';
        item.status = 'Claimed';
        saveItems(items);
        addActivityLog('claimed', item.name);
        showToast('Claim Approved', 'Item marked as claimed', 'success');
        updateAllStats();
        renderItems();
        renderClaimCenter();
    }
};

const rejectClaim = (itemId, claimIndex) => {
    if (!currentManageMode) { showToast('Access Denied', 'Manage Mode required', 'error'); return; }
    const items = getAllItems();
    const item = items.find(i => i.id === itemId);
    if (item?.claims[claimIndex]) {
        item.claims[claimIndex].reviewed = true;
        item.claims[claimIndex].status = 'rejected';
        saveItems(items);
        addActivityLog('rejected', item.name);
        showToast('Claim Rejected', 'Claim has been marked as rejected', 'info');
        updateAllStats();
        renderItems();
        renderClaimCenter();
    }
};

const renderRecentlyReturned = () => {
    const section = document.getElementById('recentlyReturnedSection');
    const grid = document.getElementById('recentlyReturnedGrid');
    if (!section || !grid) return;
    const items = getAllItems().filter(i => i.status === 'Returned').slice(0, 3);
    if (!items.length) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    grid.innerHTML = items.map(item => `<div class="glass-card glass-card-compact" style="cursor: pointer;" onclick="openDetailView('${item.id}')">
        <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.35rem;">
            <span>${getCategoryIcon(item.category)}</span>
            <span style="font-weight: 600; color: var(--text-main);">${escapeHtml(item.name)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="glass-chip chip-zone">${escapeHtml(item.locationZone)}</span>
            <span class="glass-chip chip-returned">✅ Returned</span>
        </div>
    </div>`).join('');
};

// ========================================
// 管理模式
// ========================================
const toggleManageMode = () => {
    const password = prompt('Demo Manager Password: admin123\n\nNote: This is a front-end prototype.');
    if (password === 'admin123') {
        currentManageMode = !currentManageMode;
        sessionStorage.setItem('manageMode', currentManageMode);
        updateManageModeUI();
        renderItems();
        renderClaimCenter();
        showToast(currentManageMode ? 'Manage Mode Activated' : 'Browse Mode', currentManageMode ? 'You can now manage items and claims' : 'Returned to browse mode', currentManageMode ? 'success' : 'info');
    } else if (password !== null) {
        showToast('Access Denied', 'Incorrect password', 'error');
    }
};

const updateManageModeUI = () => {
    const badge = document.getElementById('manageBadge');
    const btnIcon = document.getElementById('manageModeIcon');
    const btnText = document.getElementById('manageModeText');
    const exportBtn = document.getElementById('exportCsvBtn');
    const repairBtn = document.getElementById('repairBtn');
    if (badge) badge.style.display = currentManageMode ? 'inline-flex' : 'none';
    if (btnIcon) btnIcon.textContent = currentManageMode ? '🔓' : '🔐';
    if (btnText) btnText.textContent = currentManageMode ? 'Exit Manage' : 'Manage';
    if (exportBtn) exportBtn.style.display = currentManageMode ? 'inline-flex' : 'none';
    if (repairBtn) repairBtn.style.display = currentManageMode ? 'inline-flex' : 'none';
};

// ========================================
// 详情抽屉
// ========================================
let currentItemId = null;
let currentItemData = null;

const initDetailDrawer = () => {
    const overlay = document.getElementById('drawerOverlay');
    const closeBtn = document.getElementById('drawerCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeDetailView);
    if (overlay) overlay.addEventListener('click', closeDetailView);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetailView(); });
};

const openDetailView = (itemId) => {
    console.log('openDetailView called with:', itemId);
    const items = getAllItems();
    const item = items.find(i => i.id === itemId);
    console.log('Found item:', item);
    if (!item) { console.log('Item not found'); return; }
    
    currentItemId = itemId;
    currentItemData = item;
    const manage = currentManageMode;
    
    // 填充数据
    const nameEl = document.getElementById('drawerItemName');
    const zoneEl = document.getElementById('drawerItemZone');
    const dateEl = document.getElementById('drawerItemDate');
    const locEl = document.getElementById('drawerItemLocation');
    const descEl = document.getElementById('drawerItemDescription');
    const contactEl = document.getElementById('drawerItemContact');
    const idEl = document.getElementById('drawerItemId');
    const chipsEl = document.getElementById('drawerChips');
    
    if (nameEl) nameEl.innerHTML = `${getCategoryIcon(item.category)} ${escapeHtml(item.name)}`;
    if (zoneEl) zoneEl.textContent = item.locationZone;
    if (dateEl) dateEl.textContent = formatDate(item.date);
    if (locEl) locEl.textContent = item.location;
    if (descEl) descEl.textContent = item.description;
    if (contactEl) contactEl.textContent = item.contact;
    if (idEl) idEl.textContent = item.id;
    
    if (chipsEl) chipsEl.innerHTML = `<span class="glass-chip chip-${item.type.toLowerCase()}">${item.type === 'Lost' ? '🔴' : '🟢'} ${escapeHtml(item.type)}</span><span class="glass-chip chip-category">${getCategoryIcon(item.category)} ${escapeHtml(item.category)}</span><span class="glass-chip chip-${item.status.toLowerCase()}">${escapeHtml(item.status)}</span><span class="glass-chip chip-${item.urgency.toLowerCase()}">${escapeHtml(item.urgency)}</span>`;
    
    const claimsEl = document.getElementById('drawerItemClaims');
    if (claimsEl) claimsEl.innerHTML = item.claims?.length ? item.claims.map(c => `<div style="padding: 0.65rem; background: rgba(255,255,255,0.04); border-radius: 8px; margin-bottom: 0.45rem;"><p style="font-weight: 600; color: var(--text-main);">${escapeHtml(c.claimantName)}</p><p style="font-size: 0.78rem; color: var(--text-secondary);">${escapeHtml(c.contact)}</p><p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">"${escapeHtml(c.proof)}"</p>${c.reviewed ? '<span class="glass-chip chip-returned" style="margin-top: 0.35rem;">✓ Reviewed</span>' : '<span class="glass-chip chip-pending" style="margin-top: 0.35rem;">⏳ Pending</span>'}</div>`).join('') : '<p style="color: var(--text-muted); font-size: 0.85rem;">No claims yet</p>';
    
    const matchesEl = document.getElementById('drawerPossibleMatches');
    const matchesSection = document.getElementById('possibleMatchesSection');
    if (matchesEl) {
        const matches = findPossibleMatches(item, 2);
        if (matches.length) {
            matchesEl.innerHTML = matches.map(m => `<div class="match-highlight-item"><span class="match-highlight-name">${getCategoryIcon(m.item.category)} ${escapeHtml(m.item.name)}</span><span class="match-highlight-level">${escapeHtml(m.level)}</span></div>`).join('');
            if (matchesSection) matchesSection.style.display = 'block';
        } else {
            if (matchesSection) matchesSection.style.display = 'none';
        }
    }
    
    const timelineEl = document.getElementById('drawerTimeline');
    if (timelineEl) {
        const statusIndex = { 'Pending': 0, 'Claimed': 1, 'Returned': 2 };
        const currentIndex = statusIndex[item.status] ?? 0;
        timelineEl.innerHTML = `<div class="timeline-item ${currentIndex >= 0 ? 'completed' : ''}"><div class="timeline-dot">📋</div><div class="timeline-content"><p class="timeline-title">Reported</p><p class="timeline-date">${formatDate(item.date)}</p></div></div><div class="timeline-item ${currentIndex >= 1 ? (currentIndex === 1 ? 'active' : 'completed') : ''}"><div class="timeline-dot">${currentIndex >= 1 ? '📬' : '○'}</div><div class="timeline-content"><p class="timeline-title">Claimed</p><p class="timeline-date">${item.claims?.length ? formatDate(new Date(item.claims[0].createdAt).toISOString().split('T')[0]) : '-'}</p></div></div><div class="timeline-item ${currentIndex >= 2 ? 'completed' : ''}"><div class="timeline-dot">${currentIndex >= 2 ? '✅' : '○'}</div><div class="timeline-content"><p class="timeline-title">Returned</p><p class="timeline-date">${item.status === 'Returned' ? formatDate(item.date) : '-'}</p></div></div>`;
    }
    
    // 按钮
    const claimBtn = document.getElementById('drawerClaimBtn');
    const markBtn = document.getElementById('drawerMarkBtn');
    const deleteBtn = document.getElementById('drawerDeleteBtn');
    if (claimBtn) { claimBtn.style.display = item.status === 'Pending' && item.type === 'Found' && !manage ? 'flex' : 'none'; claimBtn.onclick = () => openClaimForm(itemId); }
    if (markBtn) { markBtn.style.display = manage ? 'flex' : 'none'; markBtn.onclick = () => { markAsReturned(itemId); closeDetailView(); }; }
    if (deleteBtn) { deleteBtn.style.display = manage ? 'flex' : 'none'; deleteBtn.onclick = () => { deleteItem(itemId); closeDetailView(); }; }
    
    // 打开 Drawer
    const drawer = document.getElementById('detailDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeDetailView = () => {
    document.getElementById('detailDrawer')?.classList.remove('active');
    document.getElementById('drawerOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
    currentItemId = null;
    currentItemData = null;
};

// ========================================
// 物品操作
// ========================================
const markAsReturned = (itemId) => {
    const items = getAllItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
        const idx = items.findIndex(i => i.id === itemId);
        items[idx].status = 'Returned';
        saveItems(items);
        addActivityLog('returned', item.name);
        renderItems();
        renderRecentlyReturned();
        renderMatchInbox();
        updateAllStats();
        showToast('Status Updated', `"${item.name}" marked as returned`, 'success');
    }
};

const deleteItem = (itemId) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    const items = getAllItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
        saveItems(items.filter(i => i.id !== itemId));
        addActivityLog('deleted', item.name);
        renderItems();
        renderRecentlyReturned();
        renderMatchInbox();
        renderClaimCenter();
        updateAllStats();
        showToast('Item Deleted', `"${item.name}" removed`, 'warning');
    }
};

// ========================================
// 打印 & 复制
// ========================================
const printNotice = () => {
    if (!currentItemData) { showToast('Error', 'No item selected', 'error'); return; }
    const item = currentItemData;
    const printContent = `<!DOCTYPE html><html><head><title>Lost & Found Notice - ${item.name}</title><style>body{font-family:Arial,sans-serif;padding:30px;max-width:600px;margin:auto}h1{text-align:center;color:#333;border-bottom:2px solid #3b82f6;padding-bottom:15px}.notice{background:#f8fafc;border:2px solid #3b82f6;border-radius:10px;padding:25px;margin:20px 0}.field{margin:12px 0}.label{font-weight:bold;color:#555}.value{color:#222;margin-left:10px}.type{font-size:1.4em;font-weight:bold;margin-bottom:15px}.lost{color:#ef4444}.found{color:#22c55e}.footer{text-align:center;margin-top:25px;color:#666;font-size:0.9em}</style></head><body><h1>🔍 Lost & Found Notice</h1><div class="notice"><div class="type ${item.type.toLowerCase()}">${item.type === 'Lost' ? '🔴 LOST ITEM' : '🟢 FOUND ITEM'}</div><div class="field"><span class="label">Item:</span><span class="value">${item.name}</span></div><div class="field"><span class="label">Category:</span><span class="value">${item.category}</span></div><div class="field"><span class="label">Location Zone:</span><span class="value">${item.locationZone}</span></div><div class="field"><span class="label">Specific Location:</span><span class="value">${item.location}</span></div><div class="field"><span class="label">Date:</span><span class="value">${formatDate(item.date)}</span></div><div class="field"><span class="label">Urgency:</span><span class="value">${item.urgency}</span></div><div class="field"><span class="label">Description:</span><span class="value">${item.description}</span></div><div class="field"><span class="label">Contact:</span><span class="value">${item.contact}</span></div><div class="field"><span class="label">Item ID:</span><span class="value">${item.id}</span></div></div><div class="footer"><p>Campus Lost & Found Center | lostandfound@campus.edu</p></div></body></html>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
};

const copyContact = () => {
    if (!currentItemData) { showToast('Error', 'No item selected', 'error'); return; }
    navigator.clipboard?.writeText(currentItemData.contact).then(() => showToast('Copied!', `Contact copied`, 'success')).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = currentItemData.contact;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied!', 'Contact copied', 'success');
    });
};

// ========================================
// 认领请求
// ========================================
const openClaimForm = (itemId) => { currentItemId = itemId; document.getElementById('claimModal')?.classList.add('active'); document.body.style.overflow = 'hidden'; };
const closeClaimForm = () => { document.getElementById('claimModal')?.classList.remove('active'); document.body.style.overflow = ''; document.getElementById('claimForm')?.reset(); currentItemId = null; };

const submitClaimRequest = () => {
    const name = document.getElementById('claimName')?.value.trim();
    const contact = document.getElementById('claimContact')?.value.trim();
    const proof = document.getElementById('claimProof')?.value.trim();
    if (!name) { showToast('Error', 'Your name is required', 'error'); return; }
    if (!contact) { showToast('Error', 'Contact method is required', 'error'); return; }
    if (!proof) { showToast('Error', 'Proof description is required', 'error'); return; }
    
    const items = getAllItems();
    const item = items.find(i => i.id === currentItemId);
    if (!item) return;
    
    item.claims = item.claims || [];
    item.claims.push({ claimantName: name, contact, proof, createdAt: Date.now(), reviewed: false });
    item.status = 'Claimed';
    saveItems(items);
    addActivityLog('claimed', item.name);
    closeClaimForm();
    closeDetailView();
    renderItems();
    renderClaimCenter();
    updateAllStats();
    showToast('Claim Submitted', `Claim for "${item.name}" submitted`, 'success');
};

// ========================================
// 数据管理
// ========================================
const resetDemoData = () => {
    if (!currentManageMode) { showToast('Access Denied', 'Manage Mode required', 'error'); return; }
    if (!confirm('Reset all demo data?')) return;
    localStorage.removeItem('items');
    localStorage.removeItem('activityLog');
    initializeSampleData();
    addActivityLog('reset', 'All Items');
    renderItems();
    renderMatchInbox();
    renderClaimCenter();
    renderRecentlyReturned();
    updateAllStats();
    renderActivityLog();
    closeDetailView();
    showToast('Demo Reset', 'Sample data has been reloaded', 'success');
};

const repairData = () => {
    if (!currentManageMode) { showToast('Access Denied', 'Manage Mode required', 'error'); return; }
    try {
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        if (!Array.isArray(items)) throw new Error('Not array');
        const repaired = items.map(normalizeItemData);
        localStorage.setItem('items', JSON.stringify(repaired));
        showToast('Data Repaired', 'All records normalized', 'success');
        updateAllStats();
        renderItems();
    } catch {
        initializeSampleData();
        showToast('Data Reset', 'Corrupted data replaced with sample', 'success');
        updateAllStats();
        renderItems();
    }
};

const exportCSV = () => {
    if (!currentManageMode) { showToast('Access Denied', 'Manage Mode required', 'error'); return; }
    const items = getAllItems();
    if (!items.length) { showToast('No Data', 'No items to export', 'error'); return; }
    const csv = 'ID,Type,Name,Category,Location Zone,Location,Date,Description,Urgency,Status,Contact,Claims\n' +
        items.map(i => `"${i.id}","${i.type}","${i.name}","${i.category}","${i.locationZone}","${i.location}","${i.date}","${i.description.replace(/"/g, '""')}","${i.urgency}","${i.status}","${i.contact}",${i.claims?.length || 0}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lost_found_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    addActivityLog('export', 'CSV Export');
    showToast('Export Complete', 'CSV file downloaded', 'success');
};

// ========================================
// 联系表单
// ========================================
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();
        const msg = document.getElementById('contactMessage')?.value.trim();
        if (!name) { showToast('Error', 'Name required', 'error'); return; }
        if (!email || !email.includes('@')) { showToast('Error', 'Valid email required', 'error'); return; }
        if (!msg) { showToast('Error', 'Message required', 'error'); return; }
        showToast('Message Sent', 'Thank you! We will respond within 24 hours.', 'success');
        form.reset();
    });
};

// ========================================
// 登录状态管理
// ========================================

/**
 * 更新导航栏登录状态
 * 已登录显示用户名和登出按钮，未登录显示Sign In
 */
const updateAuthNav = () => {
    const authLink = document.getElementById('navAuthLink');
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    
    if (authLink) {
        if (session && session.loggedIn) {
            authLink.innerHTML = '<span>👤</span> ' + escapeHtml(session.user.name.split(' ')[0]);
            authLink.href = '#';
            authLink.onclick = (e) => { e.preventDefault(); logout(); };
        } else {
            authLink.innerHTML = '<span>🔐</span> Sign In';
            authLink.href = 'auth.html';
            authLink.onclick = null;
        }
    }
};

/**
 * 用户登出
 */
const logout = () => {
    localStorage.removeItem('session');
    showToast('Logged Out', 'You have been logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'auth.html';
    }, 1000);
};

// ========================================
// 强制登录检查
// ========================================

/**
 * 检查用户是否登录
 * 如果未登录则重定向到登录页
 */
const requireLogin = () => {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (!session || !session.loggedIn) {
        window.location.href = 'auth.html';
        return false;
    }
    return true;
};

/**
 * 获取当前登录用户
 */
const getCurrentUser = () => {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    return session?.user || null;
};

// ========================================
// 初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    
    // 检查是否需要强制登录
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['auth.html', 'index.html', ''];
    
    // 如果不是公开页面且未登录，重定向到登录页
    if (!publicPages.includes(currentPage)) {
        if (!requireLogin()) return;  // 重要：未登录时直接返回，不执行后续代码
    }
    
    updateAuthNav();  // 更新登录导航状态
    
    // 根据页面初始化对应功能
    if (currentPage === 'index.html' || currentPage === '') {
        getAllItems();
        updateAllStats();
        renderActivityLog();
    } else if (currentPage === 'report.html') {
        getAllItems();
        initReportForm();
    } else if (currentPage === 'items.html') {
        getAllItems();
        updateAllStats();
        initItemsPage();
    } else if (currentPage === 'contact.html') {
        getAllItems();
        updateAllStats();
        initContactForm();
    } else if (currentPage === 'auth.html') {
        // 登录页不需要其他初始化
    }
});
