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
        'babka_babka1_babka2': { name: 'Бабка' },
        'vnychka_vnychka1_vnychka2': { name: 'Внучка' },
        'kyrochka_kyrochka1_kyrochka2': { name: 'Курочка' },
        'mblwka_mblwka1_mblwka2': { name: 'Мышка' },
        'zayc_zayc1_zayc2': { name: 'Зайка' }
    };

    const animals = [
        { id: 'babka', side: 'left', text: '', correctPairs: ['babka1','babka2'] },
        { id: 'vnychka', side: 'left', text: '', correctPairs: ['vnychka1','vnychka2'] },
        { id: 'kyrochka', side: 'left', text: '', correctPairs: ['kyrochka1','kyrochka2'] },
        { id: 'mblwka', side: 'left', text: '', correctPairs: ['mblwka1','mblwka2'] },
        { id: 'zayc', side: 'left', text: '', correctPairs: ['zayc1','zayc2'] },
        { id: 'babka1', side: 'right', text: 'Бабка', correctPairs: ['babka','babka2'] },
        { id: 'vnychka1', side: 'right', text: 'Внучка', correctPairs: ['vnychka','vnychka2'] },
        { id: 'kyrochka1', side: 'right', text: 'Курочка', correctPairs: ['kyrochka','kyrochka2'] },
        { id: 'mblwka1', side: 'right', text: 'Мышка', correctPairs: ['mblwka','mblwka2'] },
        { id: 'zayc1', side: 'right', text: 'Зайка', correctPairs: ['zayc','zayc2']},
        { id: 'babka2', side: 'center', image: 'img/babka2.png', correctPairs: ['babka','babka1']},
        { id: 'vnychka2', side: 'center', image: 'img/vnychka2.png', correctPairs: ['vnychka','vnychka1']},
        { id: 'kyrochka2', side: 'center', image: 'img/kyrochka2.png', correctPairs: ['kyrochka','kyrochka1']},
        { id: 'mblwka2', side: 'center', image: 'img/mblwka2.png', correctPairs: ['mblwka','mblwka1']},
        { id: 'zayc2', side: 'center', image: 'img/zayc2.png', correctPairs: ['zayc','zayc1']}
    ];

    let selectedLeftAnimalId = null;
    let selectedCenterAnimalId = null;
    let selectedRightAnimalId = null;
    let correctConnections = 0;
    let soundPlaying = false; // Флаг для отслеживания проигрывания звука

    animals.forEach(animal => {
        const div = document.createElement('div');
        if (animal.side === 'center') {
            const img = document.createElement('img');
            img.src = animal.image;
            div.appendChild(img);
            div.classList.add('center');
        } else {
            div.textContent = animal.text;
        }
        div.id = animal.id;
        div.dataset.correctPairs = Array.isArray(animal.correctPairs) ? animal.correctPairs.join(',') : animal.correctPair;
        div.classList.add('animal', animal.side);
        document.body.appendChild(div);

        if (animal.side === 'left') {
            const soundIcon = document.createElement('img');
            soundIcon.src = 'img/sound-icon.png';
            soundIcon.classList.add('sound-icon');
            div.appendChild(soundIcon);

            soundIcon.addEventListener('click', function(event) {
                event.stopPropagation();
                const soundFileName = `sound/${animal.id}.mp3`;

                if (!soundPlaying) {
                    const audio = new Audio(soundFileName);
                    audio.play();
                    soundPlaying = true;
                    // Сброс флага после окончания воспроизведения
                    audio.addEventListener('ended', function() {
                        soundPlaying = false;
                    });
                } else {
                    audio.pause(); // При повторном нажатии останавливаем воспроизведение
                    soundPlaying = false;
                }
            });

            div.addEventListener('click', function() {
                resetBorders();
                if (selectedLeftAnimalId === this.id) {
                    selectedLeftAnimalId = null;
                    this.style.border = 'none';
                } else {
                    selectedLeftAnimalId = this.id;
                    this.style.border = '4px solid blue';
                }
            });
        } else if (animal.side === 'center') {
            div.addEventListener('click', function() {
                resetBordersCenters(); // Сброс всех выделений на центральных элементах
                if (selectedLeftAnimalId !== null && selectedRightAnimalId !== null) {
                    if (selectedCenterAnimalId === this.id) {
                        selectedCenterAnimalId = null;
                        this.style.border = 'none';
                    } else {
                        selectedCenterAnimalId = this.id;
                        this.style.border = '4px solid blue';
                        checkConnection();
                    }
                } else if (selectedLeftAnimalId !== null) {
                    selectedCenterAnimalId = this.id;
                    this.style.border = '4px solid blue';
                }
            });
            
            function resetBordersCenters() {
                animals.filter(animal => animal.side === 'center').forEach(animal => {
                    const animalElement = document.getElementById(animal.id);
                    if (animalElement) {
                        animalElement.style.border = 'none';
                    }
                });
            }
            
            
        } else if (animal.side === 'right') {
            div.addEventListener('click', function() {
                if (selectedLeftAnimalId !== null && selectedCenterAnimalId !== null) {
                    if (selectedRightAnimalId === this.id) {
                        selectedRightAnimalId = null;
                        this.style.border = 'none';
                    } else {
                        selectedRightAnimalId = this.id;
                        this.style.border = '4px solid blue';
                        checkConnection();
                    }
                } else if (selectedCenterAnimalId !== null) {
                    selectedRightAnimalId = this.id;
                    this.style.border = '4px solid blue';
                }
            });
        }
    });

    function checkConnection() {
        const leftAnimal = document.getElementById(selectedLeftAnimalId);
        const centerAnimal = document.getElementById(selectedCenterAnimalId);
        const rightAnimal = document.getElementById(selectedRightAnimalId);
        
        const leftCorrectPairs = leftAnimal.dataset.correctPairs.split(',');
        const centerCorrectPairs = centerAnimal.dataset.correctPairs.split(',');
        const rightCorrectPairs = rightAnimal.dataset.correctPairs.split(',');

        if (leftCorrectPairs.includes(centerAnimal.id) && centerCorrectPairs.includes(rightAnimal.id)) {
            leftAnimal.style.border = '8px solid green';
            centerAnimal.style.border = '8px solid green';
            rightAnimal.style.border = '8px solid green';

            const taleKey = selectedLeftAnimalId + '_' + selectedCenterAnimalId + '_' + selectedRightAnimalId;
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
                    window.location.href = 'byt5.html';
                    score++;
                    updateScore();
                }, 2000);
            }
        } else {
            leftAnimal.style.border = '4px solid red';
            centerAnimal.style.border = '4px solid red';
            rightAnimal.style.border = '4px solid red';
            infoText.innerText = 'Неправильное сочетание, попробуй еще раз.';
            infoContainer.style.border = '2px solid red';
            infoText.style.marginLeft = '10'; // Установка margin-left в 0
            infoText.style.textIndent = '0'; // Установка text-indent в 0
            infoContainer.style.display = 'block';
            setTimeout(() => {
                infoContainer.style.display = 'none';
            }, 4000);
        }

        selectedLeftAnimalId = null;
        selectedCenterAnimalId = null;
        selectedRightAnimalId = null;
    }

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
