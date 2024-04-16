document.addEventListener('DOMContentLoaded', function() {
    const puzzleContainers = document.querySelectorAll('.puzzle-container');
    const connector = document.querySelector('.connector');
    const blockSize = 100; // Размер блока пазла (ширина и высота)
    const piecesInRow = 3; // Количество кусочков пазла в строке
    const columnWidth = window.innerWidth / 3;
  
    // Перемешаем кусочки пазла в нужные позиции в нижней части экрана
    puzzleContainers.forEach(container => {
      const pieces = container.querySelectorAll('.puzzle-piece');
      pieces.forEach((piece, index) => {
        let column;
        if (index % piecesInRow === 0) {
          column = 0; // Левая колонка
        } else if (index % piecesInRow === 1) {
          column = 1; // Центральная колонка
        } else {
          column = 2; // Правая колонка
        }
        piece.style.left = column * columnWidth + 'px';
        piece.style.top = (index % piecesInRow) * blockSize + 'px';
      });
    });
  
    let draggedPiece = null;
  
    document.querySelectorAll('.puzzle-piece').forEach(piece => {
      piece.addEventListener('mousedown', function(e) {
        draggedPiece = this;
        this.style.position = 'absolute';
        this.style.zIndex = '1000';
        document.body.append(this);
        moveAt(e.pageX, e.pageY);
        document.addEventListener('mousemove', onMouseMove);
        this.addEventListener('mouseup', onMouseUp);
      });
  
      function moveAt(pageX, pageY) {
        draggedPiece.style.left = pageX - blockSize / 2 + 'px';
        draggedPiece.style.top = pageY - blockSize / 2 + 'px';
      }
  
      function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
        checkAndConnectPieces();
      }
  
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        draggedPiece.onmouseup = null;
        checkAndConnectPieces();
        draggedPiece = null;
      }
    });
  
    function checkAndConnectPieces() {
      const draggedPieceNumber = +draggedPiece.dataset.number;
      const connectedPieces = [draggedPiece];
  
      puzzleContainers.forEach(container => {
        const pieces = container.querySelectorAll('.puzzle-piece');
        pieces.forEach(piece => {
          if (piece === draggedPiece) return;
          const pieceNumber = +piece.dataset.number;
          if (Math.abs(draggedPieceNumber - pieceNumber) === 1 &&
              Math.floor(draggedPieceNumber / piecesInRow) === Math.floor(pieceNumber / piecesInRow)) {
            connectedPieces.push(piece);
          }
        });
      });
  
      if (connectedPieces.length === piecesInRow) {
        connectedPieces.sort((a, b) => +a.dataset.number - +b.dataset.number);
        const minX = connectedPieces[0].offsetLeft;
        const minY = connectedPieces[0].offsetTop;
        connectedPieces.forEach((piece, index) => {
          piece.style.left = minX + index * blockSize + 'px';
          piece.style.top = minY + 'px';
        });
        // Проверяем, если соединенные кусочки пазла находятся в области коннектора
        if (minX >= connector.offsetLeft && minX + 3 * blockSize <= connector.offsetLeft + connector.offsetWidth) {
          connectedPieces.forEach(piece => {
            connector.appendChild(piece);
          });
        }
      }
    }
  });
  