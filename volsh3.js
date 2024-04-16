const score = parseInt(sessionStorage.getItem('score')) || 0;

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
        'three_threethre': { name: 'Сестрица Алёнушка и братец Иванушка' },
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
        { id: 'threethree', side: 'right', text: 'Иванушка', correctPair: 'three' },
        { id: 'fourfour', side: 'right', text: 'Волк', correctPair: 'four' },
        { id: 'fivefive', side: 'right', text: 'Царевна-Лягушка', correctPair: 'five' }
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
                        }, 2000); // Здесь 1000 миллисекунд (1 секунда) - время ожидания перед переходом
                    }
                } else {
                    this.style.border = '2px solid red';
                    document.getElementById(selectedAnimalId).style.border = '2px solid red';
                    infoText.innerText = 'Неправильное сочетание, пожалуйста, попробуйте еще раз';
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
