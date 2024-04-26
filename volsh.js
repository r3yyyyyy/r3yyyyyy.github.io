let score = parseInt(sessionStorage.getItem('score')) || 0;
updateScore();

document.addEventListener('DOMContentLoaded', function () {
    const charactersArea = document.getElementById('charactersArea');
    const leftArea = document.getElementById('leftArea');
    const rightArea = document.getElementById('rightArea');

    const leftCharacters = [];
    const rightCharacters = [];

    const characters = [
        { name: 'carevna', image: 'img/carevna.png', id: 'carevna', isMagic: true },
        { name: 'kolobok', image: 'img/kolobok.png', id: 'kolobok', isMagic: false },
        { name: 'belka', image: 'img/belka.png', id: 'belka', isMagic: false },
        { name: 'bura', image: 'img/bura.png', isMagic: false },
        { name: 'zol', image: 'img/zol.png', isMagic: false },
        { name: 'carev', image: 'img/carev.png', isMagic: true },
        { name: 'leop', image: 'img/leop.png', isMagic: false },
        { name: 'nezn', image: 'img/nezn.png', isMagic: false }
    ];

    function loadCharacter(character) {
        const characterElement = document.createElement('div');
        characterElement.classList.add('character-container');

        const charImg = document.createElement('img');
        charImg.src = character.image;
        charImg.classList.add('character');
        charImg.alt = character.name;

        characterElement.appendChild(charImg);

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('character-input');
        input.placeholder = 'волшебная или нет?';

        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                validateInput(input, character, characterElement);
            }
        });

        characterElement.appendChild(input);

        charactersArea.appendChild(characterElement);
    }

    function loadNextCharacter() {
        if (characters.length > 0) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const nextCharacter = characters.splice(randomIndex, 1)[0];
            loadCharacter(nextCharacter);
        } else {
            console.log('Все персонажи обработаны!');
            setTimeout(function () {
                window.location.href = 'volsh2.html';
                score++;
                updateScore();
            }, 1000);
        }
    }

    function validateInput(input, character, characterElement) {
        const inputText = input.value.toLowerCase().trim();
        const isMagic = inputText === 'да';
        const isNonMagic = inputText === 'нет';

        if ((isMagic && character.isMagic) || (isNonMagic && !character.isMagic)) {
            input.remove();

            if (isMagic) {
                leftArea.appendChild(characterElement);
                leftCharacters.push(characterElement);
                if (leftCharacters.length > 1) {
                    leftCharacters.shift().remove();
                }
                const correctSound = document.getElementById('correctSound');
        correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
        correctSound.play(); // Воспроизводим звук при правильном слове
            } else {
                rightArea.appendChild(characterElement);
                rightCharacters.push(characterElement);
                if (rightCharacters.length > 1) {
                    rightCharacters.shift().remove();
                }
                const correctSound = document.getElementById('correctSound');
        correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
        correctSound.play(); // Воспроизводим звук при правильном слове
            }

            loadNextCharacter();
        } else {
            showNotification("Неверно. Попробуй еще раз!");
            const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.volume = 0.3; // Устанавливаем громкость на 0.5
                incorrectSound.play(); // Воспроизводим звук при неправильном слове
        }
    }

    loadNextCharacter();
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

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
document.getElementById("helpButton").addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById("overlay1").style.display = "block";
    event.stopPropagation();
});

document.addEventListener('click', function(event) {
    var overlay = document.getElementById("overlay1");
    var helpContent = document.getElementById("helpContent");
    if (event.target !== helpContent && !helpContent.contains(event.target)) {
        overlay.style.display = "none";
    }
});

document.getElementById("overlay1").addEventListener('click', function(event) {
    document.getElementById("overlay1").style.display = "none";
    event.stopPropagation();
});

document.getElementById("helpContent").addEventListener('click', function(event) {
    event.stopPropagation();
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