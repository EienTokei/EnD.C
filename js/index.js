// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if(targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 卡片悬停效果增强
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// 获取汉堡按钮和导航链接
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const toggleIcon = navToggle.querySelector('i');

// 点击按钮触发切换
navToggle.addEventListener('click', () => {
    // 给导航链接加/删 active 类（控制显隐）
    navLinks.classList.toggle('active');

    // 切换图标（展开时变叉号，收起时变 bars）
    if (toggleIcon.classList.contains('fa-bars')) {
        toggleIcon.classList.replace('fa-bars', 'fa-times');
    } else {
        toggleIcon.classList.replace('fa-times', 'fa-bars');
    }
});

// 可选优化：点击导航项后自动收起导航（移动端）
const navItems = navLinks.querySelectorAll('a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) { // 仅在移动端生效
            navLinks.classList.remove('active');
            toggleIcon.classList.replace('fa-times', 'fa-bars');
        }
    });
});