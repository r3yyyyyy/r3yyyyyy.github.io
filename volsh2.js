let score = parseInt(sessionStorage.getItem('score')) || 0;
const correctImages = ['klubok', 'kovsam', 'skatsam', 'shapnev', 'gussam', 'sapogskor'];
const incorrectImages = ['vedron', 'palkasam', 'iglasam', 'krsap'];

const imageCaptions = {
    'klubok': 'Волшебный клубок',
    'kovsam': 'Ковер-самолет',
    'skatsam': 'Скатерть-самобранка',
    'shapnev': 'Шапка-невидимка',
    'gussam': 'Гусли-самогуды',
    'sapogskor': 'Сапоги-скороходы',
    'vedron': 'Ведро-непроливайка',
    'palkasam': 'Палка-самокопалка',
    'iglasam': 'Иголка-самошвейка',
    'krsap': 'Летающие сандалии'
};

let userSelection = []; // Хранит выбранные изображения

document.addEventListener('DOMContentLoaded', () => {
    updateScore();
    populateAnimalField();
});

function populateAnimalField() {
    const animalField = document.getElementById('animalField');
    const fieldWidth = animalField.offsetWidth;
    const fieldHeight = animalField.offsetHeight;
    const imageSize = 150; // Размер изображения
    let occupiedPositions = [];

    // Добавляем правильные изображения
    correctImages.forEach(image => {
        addImageToField(image, fieldWidth, fieldHeight, imageSize, occupiedPositions);
    });

    // Добавляем неправильные изображения
    incorrectImages.forEach(image => {
        addImageToField(image, fieldWidth, fieldHeight, imageSize, occupiedPositions);
    });
}

function addImageToField(imageName, fieldWidth, fieldHeight, imageSize, occupiedPositions) {
    let position;
    do {
        position = {
            x: getRandomPosition(0, fieldWidth - imageSize),
            y: getRandomPosition(0, fieldHeight - imageSize)
        };
    } while (checkOverlap(position, occupiedPositions, imageSize));

    occupiedPositions.push(position);

    let animalWithCloud = document.createElement('div');
    animalWithCloud.className = 'animalOnCloud';
    animalWithCloud.style.left = `${position.x}px`;
    animalWithCloud.style.top = `${position.y}px`;

    let img = document.createElement('img');
    img.src = `img/${imageName}.png`;
    img.alt = imageName;
    img.className = 'animalImage';
    animalWithCloud.appendChild(img);

    let cloudImg = document.createElement('img');
    cloudImg.className = 'cloudImage';
    animalWithCloud.insertBefore(cloudImg, img);

    // Создаем элемент для надписи
    let nameText = document.createElement('div');
    nameText.className = 'animalName';
    nameText.textContent = imageCaptions[imageName]; // Получаем надпись из объекта по названию изображения
    animalWithCloud.appendChild(nameText); // Добавляем надпись над изображением

    animalField.appendChild(animalWithCloud);
    img.addEventListener('click', imageClick);
}

function imageClick(event) {
    const clickedImage = event.target;
    const imageName = clickedImage.alt;

    if (correctImages.includes(imageName)) {
        if (!userSelection.includes(imageName)) {
            userSelection.push(imageName);
            clickedImage.parentElement.style.opacity = '0'; // Скрываем изображение и облако
            const correctSound = document.getElementById('correctSound');
            correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
            correctSound.play(); // Воспроизводим звук при правильном слове
            setTimeout(() => {
                clickedImage.parentElement.remove();
                showAnimalAtDoor(clickedImage.src); // Показываем изображение у двери
            }, 500);
            
            if (userSelection.length === correctImages.length) {
                showNotification("Поздравляем! Ты правильно выбрал все изображения.",true);
                setTimeout(() => {
                    window.location.href = 'volsh3.html';
                }, 2000);
                score++;
                    updateScore();
                userSelection = [];
            }
        }
    } else if (incorrectImages.includes(imageName)) {
        showNotification("Неправильно. Попробуй еще раз!", false);
        const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.volume = 0.3; // Устанавливаем громкость на 0.5
                incorrectSound.play(); // Воспроизводим звук при неправильном слове
    }
}

function showAnimalAtDoor(animalSrc) {
    let doorElement = document.createElement('img');
    doorElement.src = animalSrc;
    doorElement.className = 'animalAtDoor';
    document.getElementById('chest').appendChild(doorElement);

    setTimeout(() => {
        doorElement.style.opacity = '0';
        setTimeout(() => {
            doorElement.remove();
        }, 2000);
    }, 500);
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