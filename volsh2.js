let score = parseInt(sessionStorage.getItem('score')) || 0;
const correctImages = ['klubok', 'skatert', 'carpet', 'shapka', 'sapogi', 'gusli'];
const incorrectImages = ['sandali', 'igla','lopatav', 'vedro' ];


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

            setTimeout(() => {
                clickedImage.parentElement.remove();
                showAnimalAtDoor(clickedImage.src); // Показываем изображение у двери
            }, 500);
            
            if (userSelection.length === correctImages.length) {
                showNotification("Поздравляем! Вы правильно выбрали все изображения.");
                setTimeout(() => {
                    window.location.href = 'volsh3.html';
                }, 2000);
                score++;
                    updateScore();
                userSelection = [];
            }
        }
    } else if (incorrectImages.includes(imageName)) {
        showNotification("Неправильное изображение. Попробуйте еще раз!");
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

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
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
