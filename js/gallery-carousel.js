// js/gallery-carousel.js
class GalleryCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5秒自动切换
        this.isPlaying = true;

        this.init();
    }

    async init() {
        await this.loadGalleryData();
        this.renderCarousel();
        this.setupEventListeners();
        this.startAutoPlay();
    }

    // 加载画廊数据
    async loadGalleryData() {
        try {
            const response = await fetch('data/gallery.json');
            const data = await response.json();
            this.slides = data.featured;
            this.stats = data.stats;
        } catch (error) {
            console.error('加载画廊数据失败:', error);
            // 使用默认数据作为备选
            this.slides = this.getDefaultSlides();
            this.stats = { totalImages: 0, totalGames: 0 };
        }
    }

    // 备选数据
    getDefaultSlides() {
        return [
            {
                id: 1,
                image: '../images/about-hover.webp',
                title: '时钟塔的Alice',
                description: '那指的不是“你”，我不需要“你”。',
                game: '魔女恋爱日记',
                category: 'cg'
            },
            {
                id: 2,
                image: '../images/tale-hover.webp',
                title: '幻想列车的咕隆咕隆',
                description: '奏响吧，我的意志',
                game: '宝石夜乐园',
                category: 'cg'
            }
        ];
    }

    // 渲染轮播图
    renderCarousel() {
        const track = document.querySelector('.carousel-track');
        const dots = document.querySelector('.carousel-dots');

        if (!track || !dots) return;

        // 清空现有内容
        track.innerHTML = '';
        dots.innerHTML = '';

        // 创建幻灯片
        this.slides.forEach((slide, index) => {
            const slideElement = this.createSlideElement(slide, index);
            track.appendChild(slideElement);

            // 创建指示点
            const dot = this.createDotElement(index);
            dots.appendChild(dot);
        });

        // 设置初始状态
        this.goToSlide(0);
    }

    // 创建幻灯片元素
    createSlideElement(slide, index) {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'carousel-slide';
        slideDiv.dataset.index = index;

        slideDiv.innerHTML = `
            <img src="${slide.image}" alt="${slide.title}" loading="lazy">
            <div class="carousel-caption">
                <h3>${slide.title}</h3>
                <p>${slide.description}</p>
                <span class="slide-meta">——「${slide.game}」</span>
            </div>
        `;

        return slideDiv;
    }

    // 创建指示点元素
    createDotElement(index) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.dataset.index = index;
        dot.innerHTML = '<span class="sr-only">跳转到第' + (index + 1) + '张图片</span>';

        dot.addEventListener('click', () => {
            this.goToSlide(index);
        });

        return dot;
    }

    // 设置事件监听
    setupEventListeners() {
        // 上一张/下一张按钮
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // 鼠标悬停暂停自动播放
        const carousel = document.querySelector('.gallery-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // 触摸滑动支持
        this.setupTouchEvents();
    }

    // 设置触摸事件
    setupTouchEvents() {
        const track = document.querySelector('.carousel-track');
        if (!track) return;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;

            const diff = startX - currentX;
            const threshold = 50; // 滑动阈值

            if (diff > threshold) {
                this.nextSlide();
            } else if (diff < -threshold) {
                this.prevSlide();
            }

            isDragging = false;
            this.resumeAutoPlay();
        });
    }

    // 转到指定幻灯片
    goToSlide(index) {
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;

        this.currentSlide = index;

        const track = document.querySelector('.carousel-track');
        const dots = document.querySelectorAll('.carousel-dot');

        if (track) {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        // 更新指示点状态
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // 重置自动播放计时器
        this.resetAutoPlay();
    }

    // 下一张幻灯片
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }

    // 上一张幻灯片
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }

    // 开始自动播放
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.isPlaying) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }

    // 暂停自动播放
    pauseAutoPlay() {
        this.isPlaying = false;
    }

    // 恢复自动播放
    resumeAutoPlay() {
        this.isPlaying = true;
    }

    // 重置自动播放计时器
    resetAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        this.startAutoPlay();
    }

    // 销毁方法（清理资源）
    destroy() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        // 移除事件监听器等
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const carousel = document.querySelector('.gallery-carousel');

        if (prevBtn) prevBtn.replaceWith(prevBtn.cloneNode(true));
        if (nextBtn) nextBtn.replaceWith(nextBtn.cloneNode(true));
        if (carousel) {
            carousel.replaceWith(carousel.cloneNode(true));
        }
    }
}

// 图片懒加载功能
class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
        }
    }

    observeImage(img) {
        if (this.observer) {
            this.observer.observe(img);
        } else {
            // 降级方案：直接加载
            this.loadImage(img);
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src && src !== img.src) {
            img.src = src;
            img.onload = () => {
                img.classList.add('loaded');
            };
        }
    }
}

// 初始化函数
function initGalleryCarousel() {
    // 初始化懒加载
    const lazyLoader = new LazyLoader();

    // 初始化轮播图
    const carousel = new GalleryCarousel();

    // 监听所有图片的懒加载
    document.addEventListener('DOMContentLoaded', () => {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => lazyLoader.observeImage(img));
    });

    return carousel;
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GalleryCarousel, LazyLoader, initGalleryCarousel };
} else {
    window.GalleryCarousel = GalleryCarousel;
    window.LazyLoader = LazyLoader;
    window.initGalleryCarousel = initGalleryCarousel;
}