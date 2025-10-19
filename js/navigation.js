// 导航逻辑
class NavigationManager {
    constructor() {
        this.isHomepage = window.location.pathname === '/' ||
            window.location.pathname.endsWith('index.html');
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupMobileMenu();
        this.setupNavLinksBehavior();

    }

    // 平滑滚动设置
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId.startsWith('#')) return;

                // 检查是否是封面按钮
                if (this.classList.contains('enter-btn')) {
                    e.preventDefault();

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop,
                            behavior: 'smooth'
                        });
                    }
                    return;
                }

                // 其他锚点链接
                if (this.closest('nav') || this.closest('.nav-links')) {
                    e.preventDefault();

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // 移动端菜单设置
    setupMobileMenu() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-toggle, .nav-toggle *')) {
                const navToggle = e.target.closest('.nav-toggle');
                const navLinks = document.querySelector('.nav-links');

                if (!navToggle || !navLinks) return;

                const toggleIcon = navToggle.querySelector('i');

                navLinks.classList.toggle('active');

                if (toggleIcon.classList.contains('fa-bars')) {
                    toggleIcon.classList.replace('fa-bars', 'fa-times');
                } else {
                    toggleIcon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });

        // 移动端点击导航项后自动收起
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-links a, .nav-links a *') && window.innerWidth <= 768) {
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.querySelector('.nav-toggle');

                if (navLinks && navToggle) {
                    navLinks.classList.remove('active');
                    const toggleIcon = navToggle.querySelector('i');
                    toggleIcon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    }

    // 设置导航链接行为（首页锚点 vs 其他页面跳转）
    setupNavLinksBehavior() {
        // 这个方法现在在组件加载时由 onComponentLoaded 调用
        const navLinks = document.querySelectorAll('.nav-links a[data-section]');

        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

        navLinks.forEach(link => {
            const section = link.getAttribute('data-section');

            if (!this.isHomepage) {

                if (currentPage === section) {
                    // 如果当前页面就是目标页面，使用锚点链接
                    link.setAttribute('href', `#${section}`);
                } else {
                    // 否则跳转到对应页面
                    link.setAttribute('href', `./${section}.html`);
                }
            }
        });
    }

    // // 更新活跃导航项（根据滚动位置）
    // updateActiveNavItem() {
    //     if (!this.isHomepage) return;
    //
    //     const sections = document.querySelectorAll('section[id]');
    //     const navLinks = document.querySelectorAll('.nav-links a[data-section]');
    //
    //     let currentSection = '';
    //     const scrollPos = window.scrollY + 100;
    //
    //     sections.forEach(section => {
    //         const sectionTop = section.offsetTop;
    //         const sectionHeight = section.clientHeight;
    //
    //         if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
    //             currentSection = section.getAttribute('id');
    //         }
    //     });
    //
    //     navLinks.forEach(link => {
    //         link.classList.remove('active');
    //         if (link.getAttribute('data-section') === currentSection) {
    //             link.classList.add('active');
    //         }
    //     });
    // }
}

// 初始化导航
function initNavigation() {
    const navigation = new NavigationManager();

    // 滚动时更新活跃导航项
    // window.addEventListener('scroll', CommonUtils.debounce(() => {
    //     navigation.updateActiveNavItem();
    // }, 100));

    return navigation;
}

// 组件加载后的回调
window.onComponentLoaded = function(componentName, container, options) {
    if (componentName === 'navbar') {
        // 导航栏加载完成后初始化导航逻辑
        setTimeout(() => {
            const navigation = initNavigation();

            // 如果是首页，设置导航链接为锚点
            if (options.isHomepage) {
                navigation.setupNavLinksBehavior();
            }
        }, 0);
    }
};

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager, initNavigation };
} else {
    window.NavigationManager = NavigationManager;
    window.initNavigation = initNavigation;
}