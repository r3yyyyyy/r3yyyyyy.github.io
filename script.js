let score = parseInt(sessionStorage.getItem('score')) || 0;

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

    // Проверяем, если значение счета равно 15, отображаем overlay3
    if (score === 15) {
        event.preventDefault();
    document.getElementById("overlay3").style.display = "block";
    event.stopPropagation(); // Предотвращаем всплытие события
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const inputContainer = document.querySelector('.input-fields');
    const validValues = ['о животных', 'бытовые', 'волшебные'];

    restoreState();
    updateEventListeners();
    updateScore();

    // Проверяем, откуда пришел пользователь
    const urlParams = new URLSearchParams(window.location.search);
    const fromPage = urlParams.get('from');

    if (fromPage === 'zhiv5.html') {
        removeElement('.storybook-button[value="о животных"]');
        removeInputFields();
    } else if (fromPage === 'byt5.html') {
        removeElement('.storybook-button[value="бытовые"]');
        removeInputFields();
    } else if (fromPage === 'volsh5.html') {
        removeElement('.storybook-button[value="волшебные"]');
        removeInputFields();
    }
    
    function removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
            saveState(element.value);
        }
    }
    
    function removeInputFields() {
        document.querySelectorAll('.input-fields input').forEach(inputField => {
            inputField.remove();
        });
    }
    
    function saveState(value) {
        const hiddenElements = JSON.parse(localStorage.getItem('hiddenElements')) || [];
        if (!hiddenElements.includes(value)) {
            hiddenElements.push(value);
            localStorage.setItem('hiddenElements', JSON.stringify(hiddenElements));
        }
    }
    
    function updateEventListeners() {
        document.querySelectorAll('.input-fields input:not([hidden])').forEach(inputField => {
            inputField.removeEventListener('keypress', handleKeypress);
            inputField.addEventListener('keypress', handleKeypress);
        });
    }

    function handleKeypress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputField = event.target;
            const value = inputField.value.trim().toLowerCase();

            if (validValues.includes(value) && !buttonExists(value)) {
                createButton(inputField, value);
                inputField.hidden = true; // Скрываем поле ввода
                saveState();
                manageInputFields();
            }
        }
    }

    function createButton(inputField, value) {
        const button = document.createElement('button');
        const upperCaseValue = value.toUpperCase(); // Преобразуем текст в верхний регистр
        button.textContent = upperCaseValue;
        button.value = value;
        button.classList.add('storybook-button');
        inputField.parentNode.insertBefore(button, inputField.nextSibling);
        button.addEventListener('click', () => navigateToStory(value));
    }

    function buttonExists(value) {
        return Array.from(document.querySelectorAll('.storybook-button')).some(button => button.value === value);
    }

    function saveState() {
        const buttons = Array.from(document.querySelectorAll('.storybook-button')).map(button => button.value);
        sessionStorage.setItem('buttons', JSON.stringify(buttons));
    }

    function restoreState() {
        const buttonsValues = JSON.parse(sessionStorage.getItem('buttons')) || [];
        buttonsValues.forEach(value => {
            if (!buttonExists(value)) {
                const inputField = document.querySelector('.input-fields input') || document.createElement('input');
                inputField.type = 'text';
                inputField.value = value;
                inputField.hidden = true;
                createButton(inputField, value);
            }
        });

        manageInputFields();
    }

    function manageInputFields() {
        const existingInputs = document.querySelectorAll('.input-fields input');
        const buttonsCount = document.querySelectorAll('.storybook-button').length;

        // Удаляем все существующие поля ввода
        existingInputs.forEach(input => input.remove());

        // Создаем необходимое количество полей ввода
        const inputsToCreate = 3 - buttonsCount;
        for (let i = 0; i < inputsToCreate; i++) {
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputContainer.appendChild(inputField);
        }

        updateEventListeners(); // Обновляем обработчики событий для новых полей ввода
    }

    function navigateToStory(value) {
        let pageUrl = '';
        switch (value) {
            case 'о животных':
                pageUrl = 'zhiv1.html';
                break;
            case 'бытовые':
                pageUrl = 'byt1.html';
                break;
            case 'волшебные':
                pageUrl = 'volsh1.html';
                break;
        }
        // Добавляем параметр "from" в URL при переходе на другую страницу
        const fromPage = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
        window.location.href = `${pageUrl}?from=${fromPage}`;
    }
});

// Обработчик события для открытия overlay1 при клике на кнопку helpButton
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


// Обработчик события для открытия overlay2 при клике на кнопку anotherButton
document.getElementById("infoButton").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("overlay2").style.display = "block";
    event.stopPropagation(); // Предотвращаем всплытие события
});

// Добавляем обработчик события для скрытия overlay2 при клике на любую область кроме content2
document.addEventListener("click", function(event) {
    var overlay = document.getElementById("overlay2");
    var content = document.getElementById("content2");
    if (event.target !== content && !content.contains(event.target)) {
        overlay.style.display = "none";
    }
});

// Обработчик события для закрытия overlay2 при клике на сам overlay2
document.getElementById("overlay2").addEventListener("click", function(event) {
    document.getElementById("overlay2").style.display = "none";
    event.stopPropagation(); // Предотвращаем всплытие события
});

// Предотвращаем закрытие overlay2 при клике внутри content2
document.getElementById("infoContent").addEventListener("click", function(event) {
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
// Добавляем обработчик события для скрытия overlay1 при клике на любую область кроме helpContent
document.addEventListener("click", function(event) {
    var overlay = document.getElementById("overlay3");
    var helpContent = document.getElementById("congratsContent");
    if (event.target !== helpContent && !helpContent.contains(event.target)) {
        overlay.style.display = "none";
    }
});

// Обработчик события для закрытия overlay1 при клике на сам overlay1
document.getElementById("overlay3").addEventListener("click", function(event) {
    document.getElementById("overlay3").style.display = "none";
    event.stopPropagation(); // Предотвращаем всплытие события
});

// Предотвращаем закрытие overlay1 при клике внутри helpContent
document.getElementById("congratsContent").addEventListener("click", function(event) {
    event.stopPropagation(); // Предотвращаем всплытие события
});

