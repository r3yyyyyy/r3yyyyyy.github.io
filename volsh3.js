let score = parseInt(sessionStorage.getItem('score')) || 0;

updateScore();

document.addEventListener('DOMContentLoaded', () => {
    const infoContainer = document.createElement('div');
    const infoText = document.createElement('p');
    infoContainer.appendChild(infoText);
    document.body.appendChild(infoContainer);
    infoContainer.classList.add('info-container');
    infoContainer.style.display = 'none';

    const fairyTales = {
        'one_oneone': { name: 'Гуси-Лебеди' },
        'two_twotwo': { name: 'Гуси-Лебеди' },
        'three_threethree': { name: 'Сестрица Алёнушка и братец Иванушка' },
        'four_fourfour': { name: 'Иван-царевич и Серый Волк' },
        'five_fivefive': { name: 'Царевна-лягушка' }
    };

    const animals = [
        { id: 'one', side: 'left', text: '', correctPairs: ['oneone'] },
        { id: 'two', side: 'left', text: '', correctPairs: ['twotwo'] },
        { id: 'three', side: 'left', text: '', correctPairs: ['threethree'] },
        { id: 'four', side: 'left', text: '', correctPairs: ['fourfour'] },
        { id: 'five', side: 'left', text: '', correctPairs: ['fivefive'] },
        { id: 'oneone', side: 'right', text: 'Мышка', correctPair: 'one' },
        { id: 'twotwo', side: 'right', text: 'Девочка', correctPair: 'two' },
        { id: 'threethree', side: 'right', text: 'Козлёночек', correctPair: 'three' },
        { id: 'fourfour', side: 'right', text: 'Серый Волк', correctPair: 'four' },
        { id: 'fivefive', side: 'right', text: 'Василиса Премудрая', correctPair: 'five' }
    ];

    let selectedAnimalId = null;
    let audioPlaying = false; // Флаг для отслеживания состояния воспроизведения звука
    let audio; // Переменная для хранения объекта Audio
    let correctConnections = 0; // Счетчик правильных соединений
    animals.forEach(animal => {
        const div = document.createElement('div');
        div.textContent = animal.text;
        div.id = animal.id;
        div.dataset.correctPairs = Array.isArray(animal.correctPairs) ? animal.correctPairs.join(',') : animal.correctPair;
        div.classList.add('animal', animal.side);
        document.body.appendChild(div);

        // Добавляем значок звука только для первых пяти элементов
        if (animal.id === 'one' || animal.id === 'two' || animal.id === 'three' || animal.id === 'four' || animal.id === 'five') {
            const soundIcon = document.createElement('img');
            soundIcon.src = 'img/sound-icon.png';
            soundIcon.classList.add('sound-icon');
            div.appendChild(soundIcon);

            soundIcon.addEventListener('click', function(event) {
                event.stopPropagation();
                const soundFileName = `sound/${animal.id}.mp3`;

                // Переключаем состояние воспроизведения звука
                if (audioPlaying) {
                    audio.pause();
                    audioPlaying = false;
                } else {
                    audio = new Audio(soundFileName);
                    audio.play();
                    audioPlaying = true;

                    // Устанавливаем обработчик завершения воспроизведения звука
                    audio.onended = function() {
                        audioPlaying = false;
                    };
                }
            });
        }

        div.addEventListener('click', function() {
            if (this.classList.contains('left')) {
                resetBorders();
                if (selectedAnimalId === this.id) {
                    selectedAnimalId = null;
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
                    if (fairyTale) {
                        infoText.innerText = fairyTale.name;
                        infoContainer.style.display = 'block';
                        setTimeout(() => {
                            infoContainer.style.display = 'none';
                        }, 4000);
                    }
                    correctConnections++;
                    if (correctConnections === 5) {
                        setTimeout(() => {
                            window.location.href = 'volsh4.html';
                            score++;
                            updateScore();
                        }, 2000); // Здесь 1000 миллисекунд (1 секунда) - время ожидания перед переходом
                    }
                } else {
                    this.style.border = '2px solid red';
                    document.getElementById(selectedAnimalId).style.border = '2px solid red';
                    infoText.innerText = 'Неправильное сочетание, попробуй еще раз.';
                    infoContainer.style.border = '2px solid red';
                    infoText.style.marginLeft = '10'; // Установка margin-left в 0
                    infoText.style.textIndent = '0'; // Установка text-indent в 0
                    infoContainer.style.display = 'block';
                    setTimeout(() => {
                        infoContainer.style.display = 'none';
                    }, 4000);
                }
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