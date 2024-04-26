let score = parseInt(sessionStorage.getItem('score')) || 0;
updateScore();
const blocks = document.querySelectorAll('.draggable');
const dropzones = document.querySelectorAll('.dropzone');
const storage = document.getElementById('storage'); // Получаем область хранения блоков

let draggedBlock = null;
let draggedFromContainer = null; // Храним ссылку на контейнер, из которого перемещен блок
let initialBlocks = null; // Сохраняем изначальное состояние блоков
let correctCount = 0; // Счетчик верно собранных блоков

blocks.forEach(block => {
  block.addEventListener('dragstart', (e) => {
    draggedBlock = e.currentTarget; // Изменено на e.currentTarget
    draggedFromContainer = e.target.parentNode; // Сохраняем ссылку на контейнер, из которого перемещен блок
    setTimeout(() => {
      block.classList.add('dragging');
    }, 0);

    // Устанавливаем данные для перетаскивания
    e.dataTransfer.setData('text/plain', ''); // Пустая строка, так как данные не используются

    // Добавляем проверку типа блока при начале перемещения
    const type = e.currentTarget.dataset.type; // Изменено на e.currentTarget
    const dropzoneId = e.currentTarget.dataset.containerId; // Изменено на e.currentTarget

    // Запрещаем перемещение блока в неподходящие контейнеры
    if (type === 'title' && dropzoneId !== 'container1') {
      e.preventDefault();
    } else if (type === 'hint' && dropzoneId !== 'container2') {
      e.preventDefault();
    } else if (type === 'image' && dropzoneId !== 'container3') {
      e.preventDefault();
    }
  });

  block.addEventListener('dragend', () => {
    block.classList.remove('dragging');
  });
});

dropzones.forEach(dropzone => {
  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
  });

  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    if (!draggedBlock) return;
    const type = draggedBlock.dataset.type; // Получаем тип перемещаемого блока

    // Проверяем, можно ли переместить блок в данный контейнер
    if (
      (type === 'title' && dropzone.id === 'container1') ||
      (type === 'hint' && dropzone.id === 'container2') ||
      (type === 'image' && dropzone.id === 'container3')
    ) {
      if (dropzone.children.length > 0) return;
      dropzone.appendChild(draggedBlock);
      if (document.querySelectorAll('.dropzone > .draggable').length === 3) {
        checkBlocks();
      }
      // Применяем стили для блока при перемещении
      
      draggedBlock.style.height = '90%';
      draggedBlock.style.top = '50%';
      draggedBlock.style.boxSizing = 'border-box'; // Учитываем padding и border в размере блока
      
      // Скрываем надпись при перемещении блока в контейнер
      dropzone.querySelector('.dropzone-text').style.display = 'none';
    } else {
      // Возвращаем блок в исходный контейнер
      draggedFromContainer.appendChild(draggedBlock);
    }
  });
});

function checkBlocks() {
  const container1 = document.getElementById('container1');
  const container2 = document.getElementById('container2');
  const container3 = document.getElementById('container3');

  initialBlocks = { // Сохраняем изначальное состояние блоков перед проверкой
    container1: Array.from(container1.querySelectorAll('.draggable')),
    container2: Array.from(container2.querySelectorAll('.draggable')),
    container3: Array.from(container3.querySelectorAll('.draggable'))
  };

  const allBlocks = initialBlocks.container1.concat(initialBlocks.container2, initialBlocks.container3);

  const classNames = allBlocks.map(block => block.classList[1]);

  const isSameClass = classNames.every(className => className === classNames[0]);

  if (!isSameClass) {
    dropzones.forEach(dropzone => {
      dropzone.style.border = '2px solid red';
      const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.volume = 0.3; // Устанавливаем громкость на 0.5
                incorrectSound.play(); // Воспроизводим звук при неправильном слове
      dropzone.innerHTML = '';
    });
    // Возвращаем блоки на место в область хранения
    initialBlocks.container1.forEach(block => {
      const type = block.dataset.type;
      if (type === 'title') {
        document.querySelector('.title-group').appendChild(block);
      } else if (type === 'hint') {
        document.querySelector('.hint-group').appendChild(block);
      } else if (type === 'image') {
        document.querySelector('.image-group').appendChild(block);
      }
    });
    initialBlocks.container2.forEach(block => {
      const type = block.dataset.type;
      if (type === 'title') {
        document.querySelector('.title-group').appendChild(block);
      } else if (type === 'hint') {
        document.querySelector('.hint-group').appendChild(block);
      } else if (type === 'image') {
        document.querySelector('.image-group').appendChild(block);
      }
    });
    initialBlocks.container3.forEach(block => {
      const type = block.dataset.type;
      if (type === 'title') {
        document.querySelector('.title-group').appendChild(block);
      } else if (type === 'hint') {
        document.querySelector('.hint-group').appendChild(block);
      } else if (type === 'image') {
        document.querySelector('.image-group').appendChild(block);
      }
    });

    // Сбрасываем счетчик верных ответов, так как блоки собраны неверно
    correctCount = 0;
  } else {
    allBlocks.forEach(block => block.remove());
    dropzones.forEach(dropzone => dropzone.style.border = '2px solid green');
    const correctSound = document.getElementById('correctSound');
                correctSound.volume = 0.3; // Устанавливаем громкость на 0.5
                correctSound.play(); // Воспроизводим звук при правильном слове
    
    // Увеличиваем счетчик верных ответов
    correctCount++;
    
    // Проверяем, все ли блоки собраны верно
    if (correctCount === 5) {
      // Показываем уведомление о правильном ответе и переходим на следующую страницу
      showNotification('Верно! Ты молодец!', true);
    }
  }
}

function showNotification(message, isSuccess) {
  const overlay = document.getElementById('overlay');
  const notification = document.getElementById('notification');

  notification.textContent = message;
  notification.className = isSuccess ? 'success' : 'failure';
  overlay.style.display = 'block';
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
    overlay.style.display = 'none';
    if (isSuccess) {
      // Переадресация пользователя на следующий уровень
      window.location.href = 'page2.html?from=zhiv5.html';
      score++;
      updateScore();
    }
  }, 3000);
}
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

// Функция для случайного перемешивания массива
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Получаем блоки внутри каждой группы и перемешиваем их
const titleBlocks = Array.from(document.querySelectorAll('.title-group .draggable'));
const hintBlocks = Array.from(document.querySelectorAll('.hint-group .draggable'));
const imageBlocks = Array.from(document.querySelectorAll('.image-group .draggable'));

shuffle(titleBlocks);
shuffle(hintBlocks);
shuffle(imageBlocks);

// Вставляем перемешанные блоки обратно в DOM
const titleGroup = document.querySelector('.title-group');
const hintGroup = document.querySelector('.hint-group');
const imageGroup = document.querySelector('.image-group');

titleBlocks.forEach(block => titleGroup.appendChild(block));
hintBlocks.forEach(block => hintGroup.appendChild(block));
imageBlocks.forEach(block => {
  const imageSrc = block.dataset.src;
  const imgElement = document.createElement('img');
  imgElement.src = imageSrc;
  imgElement.width = '120'; // Устанавливаем ширину изображения
  block.textContent = ''; // Очищаем текстовое содержимое блока
  block.appendChild(imgElement);
  imageGroup.appendChild(block);
});
