// 首页专用逻辑
function initIndexPage() {
    initHomepageCards();
    initHomepageGallery();
    initCoverAnimation();
}

// 初始化首页卡片
function initHomepageCards() {
    if (typeof indexData === 'undefined') {
        console.error('首页数据未加载');
        return;
    }

    // 初始化恋爱日记卡片
    if (window.CardComponent && indexData.stories) {
        CardComponent.generateCards('stories', 'stories-cards', indexData);
    }

    // 初始化创想庭院卡片
    if (window.CardComponent && indexData.creations) {
        CardComponent.generateCards('creations', 'creations-cards', indexData);
    }

    // 初始化卡片悬停效果
    setTimeout(() => {
        if (window.CardComponent && CardComponent.initCardHoverEffects) {
            CardComponent.initCardHoverEffects();
        }
    }, 100);
}

// 初始化首页画廊轮播
function initHomepageGallery() {
    if (typeof indexData === 'undefined' || !indexData.gallery) {
        console.error('画廊数据未加载');
        return;
    }

    const galleryContainer = document.querySelector('.gallery-carousel');
    if (!galleryContainer) return;

    // 等待DOM完全渲染后初始化轮播
    setTimeout(() => {
        if (window.GalleryCarousel) {
            new GalleryCarousel('.gallery-carousel', indexData.gallery);
        }
    }, 200);
}

// 封面动画效果
function initCoverAnimation() {
    const cover = document.getElementById('cover');
    const enterBtn = document.querySelector('.enter-btn');

    if (!cover || !enterBtn) return;

    // 封面渐入效果
    setTimeout(() => {
        cover.style.opacity = '1';
        cover.style.transform = 'translateY(0)';
    }, 500);

    // 进入按钮悬停效果
    enterBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    enterBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果已经通过内联脚本初始化，则不重复执行
    if (!window.indexInitialized) {
        initIndexPage();
        window.indexInitialized = true;
    }
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initIndexPage };
} else {
    window.initIndexPage = initIndexPage;
}