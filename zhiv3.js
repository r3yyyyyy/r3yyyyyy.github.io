let score = parseInt(sessionStorage.getItem('score')) || 0;

document.addEventListener('DOMContentLoaded', () => {
    updateScore();
    populateTools();
    setupStoveArea();
});

function populateTools() {
    const gameArea = document.getElementById('gameArea');
    const gameRect = gameArea.getBoundingClientRect();
    const centerX = gameRect.width / 2.75; // Изменено для расположения слева
    const centerY = gameRect.height / 2.02;
    const radius = 400; // Изменено для увеличения расстояния между блоками

    const toolsText = [
        'Коромысло',
        'Кадка',
        'Лукошко',
        'Гусельки',
        'Дом',
        'Ведро',
        'Крыльцо',
        'Корзинка'
    ];

    // Функция перемешивания массива
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(toolsText);

    toolsText.forEach((text, index) => {
        const toolElement = document.createElement('div');
        toolElement.textContent = text;
        toolElement.classList.add('tool');
        toolElement.id = `tool${index + 1}`;
        toolElement.draggable = true;
        document.getElementById('gameArea').appendChild(toolElement);

        const angleStep = Math.PI / (toolsText.length - 1);
        const angle = -Math.PI / -2 + angleStep * index;

        const toolX = centerX + radius * Math.cos(angle);
        const toolY = centerY + radius * Math.sin(angle);

        toolElement.style.position = 'absolute';
        toolElement.style.left = `${toolX}px`;
        toolElement.style.top = `${toolY}px`;
        toolElement.style.transform = 'translate(-50%, -50%)';

        toolElement.addEventListener('dragstart', handleDragStart);
        toolElement.addEventListener('dragend', handleDragEnd);

        // Устанавливаем атрибут data-correct="true" только для верных инструментов
        if (['Коромысло', 'Кадка', 'Лукошко', 'Гусельки', 'Изба'].includes(text)) {
            toolElement.dataset.correct = 'true';
        } else {
            toolElement.dataset.correct = 'false';
        }
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(e.target, 0, 0);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function updateScore() {
    let scoreCounter = document.getElementById('scoreCounter');
    if (!document.getElementById('scoreImage')) {
        let scoreImage = new Image();
        scoreImage.id = 'scoreImage';
        scoreImage.src = 'img/apple.png';
        scoreImage.className = 'scoreImageClass';
        scoreCounter.appendChild(scoreImage);
    }
    let scoreText = document.getElementById('scoreText');
    if (!scoreText) {
        scoreText = document.createElement('div');
        scoreText.id = 'scoreText';
        scoreCounter.appendChild(scoreText);
    }
    scoreText.textContent = score;
    sessionStorage.setItem('score', score);
}

function setupStoveArea() {
    const stoveArea = document.getElementById('stoveArea');
    stoveArea.addEventListener('dragover', allowDrop);
    stoveArea.addEventListener('drop', handleDrop);
}

function allowDrop(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const droppedTool = document.getElementById(id);

    if (droppedTool && droppedTool.dataset.correct === 'true') {
        droppedTool.dataset.used = 'true';
        score++;
        updateScore();
        droppedTool.remove();
        const allCorrectToolsUsed = Array.from(document.querySelectorAll('.tool[data-correct="true"]')).every(tool => tool.dataset.used === 'true');
        if (allCorrectToolsUsed) {
            showNotification('Все слова распределены верно!', true);
        }
    } else {
        droppedTool.remove();
        showNotification('НЕВЕРНО. ПОПРОБУЙ ЕЩЕ РАЗ.', false);
    }
}

function showNotification(message, isSuccess) {
    const overlay = document.getElementById('overlay');
    const notification = document.getElementById('notification');

    notification.textContent = message;
    notification.className = isSuccess ? 'success' : 'failure';
    overlay.style.display = 'block';
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
        overlay.style.display = 'none';
        if (isSuccess) {
            // Переадресация пользователя на следующий уровень
            window.location.href = 'zhiv4.html';
        }
    }, 3000);
}