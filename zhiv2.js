let score = parseInt(sessionStorage.getItem('score')) || 0;
updateScore();
document.addEventListener('DOMContentLoaded', () => {
    const infoContainer = document.createElement('div');
    const infoImage = document.createElement('img');
    const infoText = document.createElement('p');
    infoContainer.appendChild(infoImage);
    infoContainer.appendChild(infoText);
    document.body.appendChild(infoContainer);
    infoImage.classList.add('infoimage');
    infoContainer.classList.add('info-container');
    infoContainer.style.display = 'none';

    const fairyTales = {
        'fox_wolf': { name: 'Лисичка-сестричка и Волк', imgSrc: 'img/foxwolf.jpg' },
        'fox_crane': { name: 'Лиса и Журавль', imgSrc: 'img/lisazhyr.jpg' },
        'petyh_sobaka': { name: 'Петух и Собака', imgSrc: 'img/petyhsobaka.jpg' },
        'kot_fox2': { name: 'Кот и Лиса', imgSrc: 'img/kotfox.jpg' }
    };

    const animals = [
        { id: 'fox', side: 'left', src: 'img/fox2.png', correctPairs: ['wolf', 'crane'] },
        { id: 'petyh', side: 'left', src: 'img/petyh.png', correctPairs: ['sobaka'] },
        { id: 'kot', side: 'left', src: 'img/kot.png', correctPairs: ['fox2'] },
        { id: 'crane', side: 'right', src: 'img/zhyravl.png', correctPair: 'fox' },
        { id: 'sobaka', side: 'right', src: 'img/sobaka2.png', correctPair: 'petyh' },
        { id: 'wolf', side: 'right', src: 'img/wolf2.png', correctPair: 'fox' },
        { id: 'fox2', side: 'right', src: 'img/fox2.png', correctPair: 'kot' }
    ];

    let selectedAnimalId = null;
    let correctConnections = 0; // Счетчик правильных соединений
    animals.forEach(animal => {
        const img = document.createElement('img');
        img.src = animal.src;
        img.id = animal.id;
        img.dataset.correctPairs = Array.isArray(animal.correctPairs) ? animal.correctPairs.join(',') : animal.correctPair;
        img.classList.add('animal', animal.side);
        document.body.appendChild(img);

        img.addEventListener('click', function() {
            if (this.classList.contains('left')) {
                resetBorders();
                if (selectedAnimalId === this.id) {
                    selectedAnimalId = null;
                    this.style.border = 'none';
                } else {
                    selectedAnimalId = this.id;
                    this.style.border = '2px solid blue';
                }
            } else if (selectedAnimalId) {
                const correctPairs = this.dataset.correctPairs.split(',');
                if (correctPairs.includes(selectedAnimalId)) {
                    this.style.border = '2px solid green';
                    document.getElementById(selectedAnimalId).style.border = '2px solid green';
                    infoContainer.style.border = '2px solid green';
                    const taleKey = selectedAnimalId + '_' + this.id;
                    const fairyTale = fairyTales[taleKey];
                    const correctSound = document.getElementById('correctSound');
        correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
        correctSound.play(); // Воспроизводим звук при правильном слове
                    if (fairyTale) {
                        infoImage.src = fairyTale.imgSrc;
                        infoText.innerText = fairyTale.name;
                        infoImage.style.display = 'block'; // Показываем изображение
                        infoContainer.style.display = 'block';
                        setTimeout(() => {
                            infoContainer.style.display = 'none';
                        }, 4000);
                    }
                    correctConnections++; // Увеличиваем счетчик правильных соединений
                    if (correctConnections === 4) {
                        // Если совершено 5 правильных соединений, перенаправляем на страницу byt5.html
                        setTimeout(() => {
                            window.location.href = 'zhiv3.html';
                            score++;
                            updateScore();
                        }, 2000); // Ожидаем 1 секунду перед перенаправлением
                    }
                } else {
                    this.style.border = '2px solid red';
                    document.getElementById(selectedAnimalId).style.border = '2px solid red';
                    infoContainer.style.border = '2px solid red';
                    // Если пара неправильная, очищаем текст и скрываем контейнер
                    infoText.innerText = '';
                    infoImage.style.display='none';
                    infoContainer.style.display = 'none';
                    showErrorMessage();
                }
                setTimeout(() => {
                    this.style.border = 'none';
                    document.getElementById(selectedAnimalId).style.border = 'none';
                }, 4000);
                selectedAnimalId = null;
            }
        });
    });
    function resetBorders() {
        animals.forEach(animal => {
            const animalElement = document.getElementById(animal.id);
            if (animalElement) {
                animalElement.style.border = 'none';
            }
        });
        infoContainer.style.display = 'none';
    }

    function showErrorMessage() {
        infoText.innerText = 'Неправильное сочетание, попробуй еще раз.';
        const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.volume = 0.3; // Устанавливаем громкость на 0.5
                incorrectSound.play(); // Воспроизводим звук при неправильном слове
        infoText.style.marginLeft = '0'; // Установка margin-left в 0
        infoText.style.textIndent = '0'; // Установка text-indent в 0
        infoContainer.style.display = 'block';
        setTimeout(() => {
            infoContainer.style.display = 'none';
        }, 4000);
    }
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