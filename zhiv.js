let score = parseInt(sessionStorage.getItem('score')) || 0;
const correctOrder = ['mouse', 'frog', 'rabbit', 'fox', 'wolf', 'bear2'];
let userOrder = [];

document.addEventListener('DOMContentLoaded', () => {
    updateScore();
    populateAnimalField();
});

function populateAnimalField() {
    const animalField = document.getElementById('animalField');
    const fieldWidth = animalField.offsetWidth;
    const fieldHeight = animalField.offsetHeight;
    const animalSize = 150; // Размер контейнера для животного и облака
    let occupiedPositions = [];

    correctOrder.forEach(animal => {
        let position;
        do {
            position = {
                x: getRandomPosition(0, fieldWidth - animalSize),
                y: getRandomPosition(0, fieldHeight - animalSize)
            };
        } while (checkOverlap(position, occupiedPositions, animalSize));

        occupiedPositions.push(position);

        let animalWithCloud = document.createElement('div');
        animalWithCloud.className = 'animalOnCloud';
        animalWithCloud.style.left = `${position.x}px`;
        animalWithCloud.style.top = `${position.y}px`;

        let img = document.createElement('img');
        img.src = `img/${animal}.png`;
        img.id = animal;
        img.alt = animal;
        img.className = 'animalImage';
        animalWithCloud.appendChild(img);

        let cloudImg = document.createElement('img');
        //cloudImg.src = 'img/cloud.png';//
        cloudImg.className = 'cloudImage';
        animalWithCloud.insertBefore(cloudImg, img);

        animalField.appendChild(animalWithCloud);
        img.addEventListener('click', animalClick);
    });
}
// Функция обработки клика на животное
function animalClick(ev) {
    let selectedAnimal = ev.target.id; // ID выбранного животного
    let correctAnimal = correctOrder[userOrder.length]; // Ожидаемое следующее животное в порядке

    if (selectedAnimal === correctAnimal) {
        userOrder.push(selectedAnimal);
        ev.target.parentElement.style.opacity = '0'; // Скрываем животное и облако

        // После задержки удаляем элемент животного с облаком и добавляем у двери
        setTimeout(() => {
            ev.target.parentElement.remove();
            showAnimalAtDoor(ev.target.src); // Показываем животное у двери
        }, 500);
        if (userOrder.length === correctOrder.length) {
            // Все животные выбраны правильно
            showNotification("Поздравляем! Ты правильно упорядочил животных.", true);
            setTimeout(function() {
                window.location.href = 'zhiv2.html';
                score++;
                updateScore(); // Обновляем счет
            }, 2000);
            userOrder = [];
            sessionStorage.setItem('score', 0); // Сбрасываем счет
        }
        
    } else {
        // Выбрано неправильное животное
        showNotification("Неправильный порядок. Попробуй еще раз!", false);
    }
}

// Показываем животное у двери
function showAnimalAtDoor(animalSrc) {
    let doorElement = document.createElement('img');
    doorElement.src = animalSrc;
    doorElement.className = 'animalAtDoor';
    document.getElementById('teremok').appendChild(doorElement);

    // Задаём таймер для исчезновения животного у двери
    setTimeout(() => {
        doorElement.style.opacity = '0';
        setTimeout(() => {
            doorElement.remove(); // Удаляем элемент после исчезновения
        }, 2000); // Задержка до полного исчезновения
    }, 500); // Задержка перед началом исчезновения
}
// Функция для обновления счета на экране
function updateScore() {
    let scoreCounter = document.getElementById('scoreCounter');
    if (!document.getElementById('scoreImage')) {
        let scoreImage = new Image();
        scoreImage.id = 'scoreImage';
        scoreImage.src = 'img/apple.png';
        scoreImage.className = 'scoreImageClass'; // You will define this class in your CSS
        scoreCounter.appendChild(scoreImage);
    }
    let scoreText = document.getElementById('scoreText');
    if (!scoreText) {
        scoreText = document.createElement('div');
        scoreText.id = 'scoreText';
        scoreCounter.appendChild(scoreText);
    }
    scoreText.textContent = score;
    sessionStorage.setItem('score', score); // Update the score in session storage
}
// Функция для отображения уведомлений на экране
function showNotification(message, isCorrect) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block'; // Показываем уведомление
    
    // Добавляем класс в зависимости от типа уведомления
    notification.className = isCorrect ? 'correct-notification' : 'incorrect-notification';

    setTimeout(() => {
        notification.style.display = 'none'; // Скрываем уведомление после 3 секунд
    }, 3000);
}


function getRandomPosition(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function checkOverlap(newPosition, occupiedPositions, size) {
    return occupiedPositions.some(pos => {
        return newPosition.x < pos.x + size &&
               newPosition.x + size > pos.x &&
               newPosition.y < pos.y + size &&
               newPosition.y + size > pos.y;
    });
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