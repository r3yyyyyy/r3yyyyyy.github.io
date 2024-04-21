let score = parseInt(sessionStorage.getItem('score')) || 0;
updateScore();
// Слова для ловли и неловли
const catchWords = ["хитрая", "плутовка", "ласково говорит", "обманщица", "расчетливая", "умная", "мстительная", "красивая", "изворотливая"];
const avoidWords = ["честная", "добрая", "смешная", "спокойная", "глупая", "медлительная"];

// Получаем элементы DOM
const gameContainer = document.getElementById('game-container');
const scoreCounter = document.getElementById('scoreCounter');
const meshok = document.getElementById('meshok');

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
                removeWord(wordElement);
                if (!usedCatchWords.includes(word)) {
                    usedCatchWords.push(word);
                }
                if (usedCatchWords.length === 9) { // Проверяем, достигнут ли лимит пойманных слов
                    window.location.href = 'page2.html'; // Переходим на следующую страницу
                    score++; // Увеличиваем счет при пойманном правильном слове
                    updateScore();
                }
            } else {
                // Если слово неправильное, не засчитываем его, просто удаляем
                removeWord(wordElement);
            }
        } else if (wordRect.top > window.innerHeight) {
            // Если слово упало мимо мешка, удаляем его
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
    const animationDuration = 3;
    wordElement.style.animation = `fall ${animationDuration}s linear`;

    // Удаление слова после завершения анимации
    wordElement.addEventListener('animationend', () => {
        removeWord(wordElement);
    });
}

// Запускаем создание новых слов каждые 2 секунды
const wordInterval = setInterval(createWord, 3500);

// Проверяем условие завершения игры каждую секунду
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