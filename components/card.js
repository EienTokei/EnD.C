// 动态生成卡片的函数
function generateCards(sectionId, containerId, cardsData) {
    const container = document.getElementById(containerId);

    if (!container || !cardsData || !cardsData[sectionId]) return;

    const cards = cardsData[sectionId];
    container.innerHTML = '';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        cardElement.innerHTML = `
            <div class="card-header">
                <i class="${card.iconClass}" style="${card.iconStyle}"></i>
                <h3>${card.title}</h3>
            </div>
            <div class="card-body">
                <p>${card.description}</p>
            </div>
            <div class="card-footer">
                <span class="${card.tagClass}">${card.tag}</span>
                <a href="${card.link}">阅读 <i class="fas fa-scroll"></i></a>
            </div>
        `;

        container.appendChild(cardElement);
    });
}

// 卡片悬停效果增强
function initCardHoverEffects() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateCards, initCardHoverEffects };
} else {
    window.CardComponent = { generateCards, initCardHoverEffects };
}