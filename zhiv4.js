// Слова для ловли и неловли
const catchWords = ["хитрая", "плутовка", "ласково говорит", "обманщица", "расчетливая", "умная", "мстительная", "красивая", "изворотливая"];
const avoidWords = ["честная", "добрая", "смешная", "спокойная", "глупая", "медлительная"]

// Получаем элементы DOM
const gameContainer = document.getElementById('game-container');
const scoreCounter = document.getElementById('scoreCounter');
const meshok = document.getElementById('meshok');

let score = 0;
let words = [];
let usedCatchWords = [];

// Добавляем обработчики событий для перемещения мешка
meshok.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', moveMeshok);
document.addEventListener('mouseup', stopDragging);

let isDragging = false;

// Функция начала перетаскивания мешка
function startDragging(event) {
    isDragging = true;
}

// Функция остановки перетаскивания мешка
function stopDragging(event) {
    isDragging = false;
}

// Функция перемещения мешка
function moveMeshok(event) {
    if (isDragging) {
        meshok.style.left = `${event.clientX - meshok.offsetWidth / 2}px`;
        meshok.style.top = `${event.clientY - meshok.offsetHeight / 2}px`;
        checkCollision();
    }
}

// Создаем элементы для слов и добавляем их в контейнер
function createWordElement(word) {
    const wordElement = document.createElement('div');
    wordElement.classList.add('word');
    wordElement.textContent = word;
    gameContainer.appendChild(wordElement);
    return wordElement;
}

// Удаляем слово из массива и из DOM
function removeWord(wordElement) {
    gameContainer.removeChild(wordElement);
}

// Обновляем счетчик очков
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

// Проверяем столкновение слова с мешком
function checkCollision() {
    const meshokRect = meshok.getBoundingClientRect();
    words.forEach(wordElement => {
        const wordRect = wordElement.getBoundingClientRect();
        if (
            wordRect.top < meshokRect.bottom &&
            wordRect.bottom > meshokRect.top &&
            wordRect.left < meshokRect.right &&
            wordRect.right > meshokRect.left
        ) {
            const word = wordElement.textContent;
            if (catchWords.includes(word)) {
                score++;
                updateScore();
            }
            removeWord(wordElement);
        } else if (wordRect.top > window.innerHeight) {
            removeWord(wordElement);
        }
    });
}

// Создаем новое слово
function createWord() {
    let wordList;
    if (words.length === catchWords.length + avoidWords.length) {
        words = []; // Если использованы все слова, начинаем с начала
    }
    if (usedCatchWords.length === catchWords.length) {
        wordList = avoidWords;
    } else {
        wordList = Math.random() < 0.5 ? catchWords : avoidWords;
    }
    let word;
    do {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        word = wordList[randomIndex];
    } while (wordList === catchWords && usedCatchWords.includes(word)); // Проверяем, чтобы слова не повторялись
    const wordElement = createWordElement(word);
    words.push(wordElement);
    if (wordList === catchWords) {
        usedCatchWords.push(word);
    }

    // Добавляем анимацию движения слова
    const animationDuration = 4.5;
    wordElement.style.animation = `fall ${animationDuration}s linear`;

    // Удаление слова после завершения анимации
    wordElement.addEventListener('animationend', () => {
        removeWord(wordElement);
    });
}

// Запускаем создание новых слов каждые 2 секунды
const wordInterval = setInterval(createWord, 5500);

// Проверяем условие завершения игры каждую секунду
const gameInterval = setInterval(() => {
    if (score === catchWords.length) {
        clearInterval(wordInterval);
        clearInterval(gameInterval);
        window.location.href = 'zhiv5.html';
    }
}, 2000);


