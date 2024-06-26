let score = parseInt(sessionStorage.getItem('score')) || 0;
updateScore();
// Функция для отображения уведомления
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
            window.location.href = 'volsh5.html';
            score++;
            updateScore();
        }
    }, 1000);
}

const wordsFirstZone = [
    { text: 'Жил-был царь', zone: 'first' },
    { text: 'Жил-был старик, и было у его три сына', zone: 'first' },
    { text: 'Жили-были старик да старуха', zone: 'first' },
    { text: 'Жил старик со старухою', zone: 'first' }
];

const wordsSecondZone = [
    { text: 'и стали они жить-поживать да горя не знать.', zone: 'second' },
    { text: 'Я на том пиру был, мед-пиво пил, по усам текло, а в рот не попало', zone: 'second' },
    { text: 'и стала она в добре поживать, лиха не знавать.', zone: 'second' },
    { text: 'И стали они жить-поживать, век доживать.', zone: 'second' }
];

let currentIndex = 0; // Индекс текущей фразы

// Функция для начала игры
// Объединяем массивы с фразами
const allWords = wordsFirstZone.concat(wordsSecondZone);

// Функция для начала игры
function startGame() {
    // Показываем первую фразу
    showNextWord();
}

// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Функция для показа следующей фразы
function showNextWord() {
    if (allWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        const randomWord = allWords[randomIndex];
        const wordElement = createWordElement(randomWord.text, randomWord.zone);
        document.body.appendChild(wordElement);
        allWords.splice(randomIndex, 1); // Удаляем показанную фразу из массива
    } else {
        showNotification('Правильно! Ты молодец!', true);
        setTimeout(() => {
            window.location.href = 'volsh5.html';
            score++;
            updateScore();
        }, 2000); // Перенаправление через 2 секунды
    }
}



// Функция для создания элемента с фразой
function createWordElement(text, zone) {
    const toolElement = document.createElement('div');
    toolElement.textContent = text;
    toolElement.setAttribute('data-zone', zone); // Устанавливаем атрибут для хранения зоны
    toolElement.classList.add('tool');
    toolElement.style.position = 'absolute';
    toolElement.style.top = '250px';
    toolElement.style.left = '830px';
    toolElement.setAttribute('draggable', 'true');
    toolElement.addEventListener('dragstart', dragStart);
    toolElement.addEventListener('dragend', dragEnd);
    return toolElement;
}

// Функция для обработки события начала перетаскивания
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.textContent);
    event.target.classList.add('dragging');
}

// Функция для обработки события окончания перетаскивания
function dragEnd(event) {
    event.target.classList.remove('dragging');
}

// Функция для разрешения перетаскивания
function allowDrop(event) {
    event.preventDefault();
}

// Функция для обработки события перетаскивания на зону

// Функция для обработки события перетаскивания на зону
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const toolElement = document.querySelector('.tool');
    if (toolElement) {
        const zone = toolElement.getAttribute('data-zone');
        if (event.target.id === 'stoveArea' && zone === 'first') {
            event.target.appendChild(toolElement);
            toolElement.style.top = '0';
            toolElement.style.left = '0';
            toolElement.removeEventListener('dragstart', dragStart);
            toolElement.removeEventListener('dragend', dragEnd);
            toolElement.classList.remove('tool');
            toolElement.classList.add('invisible');
            const correctSound = document.getElementById('correctSound');
        correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
        correctSound.play(); // Воспроизводим звук при правильном слове
            showNextWord();
        } else if (event.target.id === 'stoveArea2' && zone === 'second') {
            event.target.appendChild(toolElement);
            toolElement.style.top = '0';
            toolElement.style.left = '0';
            toolElement.removeEventListener('dragstart', dragStart);
            toolElement.removeEventListener('dragend', dragEnd);
            toolElement.classList.remove('tool');
            toolElement.classList.add('invisible');
            const correctSound = document.getElementById('correctSound');
        correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
        correctSound.play(); // Воспроизводим звук при правильном слове
            showNextWord();
        } else {
            showNotification('Неверно. Попробуй еще раз', false); // Отображаем уведомление о неверном ответе
            const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.volume = 0.3; // Устанавливаем громкость на 0.5
                incorrectSound.play(); // Воспроизводим звук при неправильном слове
            // Возвращаем фразу на исходное место
            toolElement.style.top = '250px';
            toolElement.style.left = '830px';
        }
    }
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


// Начинаем игру при загрузке страницы
window.onload = startGame;
