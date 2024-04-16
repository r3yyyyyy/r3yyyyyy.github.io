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
        { id: 'fox2', side: 'right', src: 'img/fox1.png', correctPair: 'kot' }
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
                    const taleKey = selectedAnimalId + '_' + this.id;
                    const fairyTale = fairyTales[taleKey];
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
                        }, 2000); // Ожидаем 1 секунду перед перенаправлением
                    }
                } else {
                    this.style.border = '2px solid red';
                    document.getElementById(selectedAnimalId).style.border = '2px solid red';
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
        infoText.innerText = 'Неправильное сочетание, пожалуйста, попробуйте еще раз';
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
