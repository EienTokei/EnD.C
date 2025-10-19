// 通用工具函数和组件加载
function loadComponent(componentName, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const componentPath = `components/${componentName}.html`;

    fetch(componentPath)
        .then(response => {
            if (!response.ok) throw new Error('组件加载失败');
            return response.text();
        })
        .then(html => {
            container.outerHTML = html;

            // 组件加载后的回调
            if (typeof window.onComponentLoaded === 'function') {
                window.onComponentLoaded(componentName, container, options);
            }
        })
        .catch(error => {
            console.error(`加载组件 ${componentName} 失败:`, error);
        });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 检查元素是否在视口中
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadComponent, debounce, isElementInViewport };
} else {
    window.CommonUtils = { loadComponent, debounce, isElementInViewport };
}