let score = parseInt(sessionStorage.getItem('score')) || 0;

document.addEventListener('DOMContentLoaded', () => {
    updateScore();
    populateTools();
    setupStoveArea();
});

function populateTools() {
    const gameArea = document.getElementById('gameArea');
    const gameRect = gameArea.getBoundingClientRect();
    const centerX = gameRect.width / 1.35;
    const centerY = gameRect.height / 2.75;
    const radius = 400;

    const toolsSrc = [
        'img/molot1.png',
        'img/salt1.png',
        'img/manka3.png',
        'img/sugar 1.png',
        'img/butter.png',
        'img/pomidor.png',
        'img/moloko.png',
        'img/topor1.png'
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(toolsSrc);
    const startAngle = -Math.PI / 2;
    const angleStep = Math.PI / (toolsSrc.length - 1);

    toolsSrc.forEach((src, index) => {
        const toolElement = document.createElement('img');
        toolElement.src = src;
        toolElement.alt = `Инструмент ${index + 1}`;
        toolElement.classList.add('tool');
        toolElement.id = `tool${index + 1}`;
        toolElement.draggable = true;
        document.getElementById('gameArea').appendChild(toolElement);

        if (['topor1.png', 'butter.png', 'salt1.png', 'manka3.png'].some(requiredSrc => src.includes(requiredSrc))) {
            toolElement.dataset.correct = 'true';
        } else {
            toolElement.dataset.correct = 'false';
        }

        const angle = startAngle + angleStep * index;
        const toolX = centerX + radius * Math.cos(angle);
        const toolY = centerY - radius * Math.sin(angle);

        toolElement.style.position = 'absolute';
        toolElement.style.left = `${toolX}px`;
        toolElement.style.top = `${toolY}px`;
        toolElement.style.transform = 'translate(-50%, 50%)';

        toolElement.addEventListener('dragstart', handleDragStart);
        toolElement.addEventListener('dragend', handleDragEnd);
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
        const correctSound = document.getElementById('correctSound');
        correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
        correctSound.play(); // Воспроизводим звук при правильном слове
        droppedTool.remove();
        const allCorrectToolsUsed = Array.from(document.querySelectorAll('.tool[data-correct="true"]')).every(tool => tool.dataset.used === 'true');
        if (allCorrectToolsUsed) {
            showNotification('Правильно! Ты сварил кашу!', true);
        }
    } else {
        droppedTool.remove();
        const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.volume = 0.3; // Устанавливаем громкость на 0.5
                incorrectSound.play(); // Воспроизводим звук при неправильном слове
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
            window.location.href = 'byt2.html';
            score++;
            updateScore();
        }
    }, 3000);
}
document.getElementById("helpButton").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("overlay1").style.display = "block";
    event.stopPropagation(); // Предотвращаем всплытие события
});

// Добавляем обработчик события для скрытия overlay1 при клике на любую область кроме helpContent
document.addEventListener("click", function(event) {
    var overlay = document.getElementById("overlay1");
    var helpContent = document.getElementById("helpContent");
    if (event.target !== helpContent && !helpContent.contains(event.target)) {
        overlay.style.display = "none";
    }
});

// Обработчик события для закрытия overlay1 при клике на сам overlay1
document.getElementById("overlay1").addEventListener("click", function(event) {
    document.getElementById("overlay1").style.display = "none";
    event.stopPropagation(); // Предотвращаем всплытие события
});

// Предотвращаем закрытие overlay1 при клике внутри helpContent
document.getElementById("helpContent").addEventListener("click", function(event) {
    event.stopPropagation(); // Предотвращаем всплытие события
});
document.addEventListener('DOMContentLoaded', function() {
    var babaYagaImage = document.getElementById('baba-yaga-image1');
    var babaYagaSound = document.getElementById('baba-yaga-sound');
    
    // Устанавливаем громкость звука
    babaYagaSound.volume = 0.2;
    
    // Добавляем обработчик события клика на изображение "Баба Яга"
    babaYagaImage.addEventListener('click', function() {
        // Проверяем, играет ли звук в данный момент, и приостанавливаем его, если да
        if (!babaYagaSound.paused) {
            babaYagaSound.pause();
            babaYagaSound.currentTime = 0; // Сбрасываем время воспроизведения звука
        }
        
        // Воспроизводим звук "Баба Яга"
        babaYagaSound.play();
    });
});
