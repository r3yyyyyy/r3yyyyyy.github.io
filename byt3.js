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
        'head_master': { name: '— Ты всему дому голова — так вот тебе гусиная голова.' },
        'hocks_mistress': { name: '— Тебе дома сидеть, за домом глядеть — вот тебе гузка.' },
        'paws_sons': { name: '— Вот вам по ножке — топтать отцовские дорожки.' },
        'wings_daughters': { name: '— Вам с отцом, с матерью не век жить — вырастете, полетите прочь, свое гнездо вить.' },
        'other_self': { name: 'Остальное себе взял. А мужик сер да глуп — мне глодать хлуп.' }
    };

    const animals = [
        { id: 'head', side: 'left', text: 'голова', correctPairs: ['master'] },
        { id: 'hocks', side: 'left', text: 'гузка', correctPairs: ['mistress'] },
        { id: 'paws', side: 'left', text: 'лапки', correctPairs: ['sons'] },
        { id: 'wings', side: 'left', text: 'крылышки', correctPairs: ['daughters'] },
        { id: 'other', side: 'left', text: 'остальное', correctPairs: ['self'] },
        { id: 'master', side: 'right', src: 'img/master.png', correctPair: 'head', width: '150px' },
        { id: 'mistress', side: 'right', src: 'img/mistress.png', correctPair: 'hocks', width: '150px' },
        { id: 'sons', side: 'right', src: 'img/sons.png', correctPair: 'paws', width: '150px' },
        { id: 'daughters', side: 'right', src: 'img/daughters.png', correctPair: 'wings', width: '150px' },
        { id: 'self', side: 'right', src: 'img/self.png', correctPair: 'other', width: '150px' }
    ];

    let selectedAnimalId = null;
    let correctConnections = 0;

    animals.forEach(animal => {
        const div = document.createElement('div');
        if (animal.side === 'left') {
            div.textContent = animal.text;
        } else {
            const img = document.createElement('img');
            img.src = animal.src;
            div.appendChild(img);
        }
        div.id = animal.id;
        div.dataset.correctPairs = Array.isArray(animal.correctPairs) ? animal.correctPairs.join(',') : animal.correctPair;
        div.classList.add('animal', animal.side);
        document.body.appendChild(div);

        div.addEventListener('click', function() {
            if (this.classList.contains('left')) {
                resetBorders();
                if (selectedAnimalId === this.id) {
                    selectedAnimalId = null;
                } else {
                    selectedAnimalId = this.id;
                    this.style.border = '3px solid blue';
                }
            } else if (selectedAnimalId) {
                const correctPairs = this.dataset.correctPairs.split(',');
                if (correctPairs.includes(selectedAnimalId)) {
                    this.style.border = '2px solid green';
                    document.getElementById(selectedAnimalId).style.border = '2px solid green';
                    infoContainer.style.border = '2px solid green';
                    const taleKey = selectedAnimalId + '_' + this.id;
                    const correctSound = document.getElementById('correctSound');
        correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
        correctSound.play(); // Воспроизводим звук при правильном слове
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
                            window.location.href = 'byt4.html';
                            score++;
                            updateScore();
                        }, 2000);
                    }
                } else {
                    this.style.border = '2px solid red';
                    document.getElementById(selectedAnimalId).style.border = '2px solid red';
                    infoContainer.style.border = '2px solid red';
                    infoText.innerText = 'Неправильное сочетание, попробуй еще раз.';
                    const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.volume = 0.3; // Устанавливаем громкость на 0.5
                incorrectSound.play(); // Воспроизводим звук при неправильном слове
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
