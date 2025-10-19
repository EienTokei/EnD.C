class GalleryCarousel {
    constructor(containerSelector, galleryData) {
        this.container = document.querySelector(containerSelector);
        this.currentSlide = 0;
        this.slides = galleryData?.featured || [];
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.isPlaying = true;

        if (this.container && this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        this.renderCarousel();
        this.setupEventListeners();
        this.startAutoPlay();
    }

    renderCarousel() {
        const track = this.container.querySelector('.carousel-track');
        const dots = this.container.querySelector('.carousel-dots');

        if (!track || !dots) return;

        track.innerHTML = '';
        dots.innerHTML = '';

        this.slides.forEach((slide, index) => {
            const slideElement = this.createSlideElement(slide, index);
            track.appendChild(slideElement);

            const dot = this.createDotElement(index);
            dots.appendChild(dot);
        });

        this.goToSlide(0);
    }

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

    setupEventListeners() {
        const prevBtn = this.container.querySelector('.carousel-prev');
        const nextBtn = this.container.querySelector('.carousel-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());

        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const track = this.container.querySelector('.carousel-track');
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
            const threshold = 50;

            if (diff > threshold) {
                this.nextSlide();
            } else if (diff < -threshold) {
                this.prevSlide();
            }

            isDragging = false;
            this.resumeAutoPlay();
        });
    }

    goToSlide(index) {
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;

        this.currentSlide = index;

        const track = this.container.querySelector('.carousel-track');
        const dots = this.container.querySelectorAll('.carousel-dot');

        if (track) {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.resetAutoPlay();
    }

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.isPlaying) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        this.isPlaying = false;
    }

    resumeAutoPlay() {
        this.isPlaying = true;
    }

    resetAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        this.startAutoPlay();
    }

    destroy() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryCarousel;
} else {
    window.GalleryCarousel = GalleryCarousel;
}