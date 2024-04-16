document.addEventListener('DOMContentLoaded', function() {
    const inputContainer = document.querySelector('.input-fields');
    const validValues = ['о животных', 'бытовая', 'волшебная'];

    restoreState();
    updateEventListeners();

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
            case 'бытовая':
                pageUrl = 'byt1.html';
                break;
            case 'волшебная':
                pageUrl = 'volsh1.html';
                break;
        }
        window.location.href = pageUrl;
    }
});