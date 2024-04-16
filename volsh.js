let score = parseInt(sessionStorage.getItem('score')) || 0;
        updateScore();

        document.addEventListener('DOMContentLoaded', function () {
            
            const characters = [
                { name: 'carevna', image: 'img/carevna.png', id: 'carevna', isMagic: true },
                { name: 'bura', image: 'img/bura.png', isMagic: true },
                { name: 'zol', image: 'img/zol.png', isMagic: true },
                { name: 'carev', image: 'img/carev.png', isMagic: false },
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

                // Распределение появления персонажей в зависимости от их количества и положения
                const charactersInLeftArea = document.querySelectorAll('.left-area-character');
                const charactersInRightArea = document.querySelectorAll('.right-area-character');

                const charactersInLeftAreaCount = charactersInLeftArea.length;
                const charactersInRightAreaCount = charactersInRightArea.length;

                if (charactersInLeftAreaCount < 3) {
                    characterElement.style.top = `${charactersInLeftAreaCount * 150}px`;
                    characterElement.style.left = '50px'; // Отступ слева
                    characterElement.classList.add('left-area-character');
                } else {
                    characterElement.style.top = `${(charactersInRightAreaCount - 3) * 150}px`;
                    characterElement.style.right = '50px'; // Отступ справа
                    characterElement.classList.add('right-area-character');
                }
            }

            function loadNextCharacter() {
                if (characters.length > 0) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    const nextCharacter = characters.splice(randomIndex, 1)[0];
                    loadCharacter(nextCharacter);
                } else {
                    console.log('Все персонажи обработаны!');
                    // Перенаправление на другую страницу
                    setTimeout(function() {
                        window.location.href = 'volsh2.html';
                    }, 1000);
                }
            }

            function validateInput(input, character, characterElement) {
                const inputText = input.value.toLowerCase().trim();
                const isMagic = inputText === 'волшебная';
                const isNonMagic = inputText === 'неволшебная';
            
                if ((isMagic && character.isMagic) || (isNonMagic && !character.isMagic)) {
                    if (isMagic) {
                        leftArea.appendChild(characterElement);
                        characterElement.classList.add('left-area-character');
                    } else {
                        rightArea.appendChild(characterElement);
                        characterElement.classList.add('right-area-character');
                    }
                    input.remove(); // Удаление поля ввода
                    loadNextCharacter(); // Загрузка следующего персонажа
                    score++;
                    updateScore();
                } else {
                    showNotification("Неверно. Попробуйте еще раз!");;
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

        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.style.display = 'block'; // Показываем уведомление
            setTimeout(() => {
                notification.style.display = 'none'; // Скрываем уведомление после 3 секунд
            }, 3000);
        }