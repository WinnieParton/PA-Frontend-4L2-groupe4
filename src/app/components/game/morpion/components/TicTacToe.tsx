import React, { useRef, useEffect, useState } from "react";

const TicTacToe = ({ gameData }) => {
  const BOARD_SIZE = 3;
  const EMPTY = 0;
  const PLAYER_1 = 1;
  const PLAYER_2 = 2;

  const [gameBoard, setGameBoard] = useState([
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]
  ]);

  const [gameOver, setGameOver] = useState(false);
  const currentPlayerRef = useRef(PLAYER_1);
  const canvasRef = useRef(null);

  const drawLines = (context, display) => {
    display.content.forEach((line) => {
      if (line.tag === "line") {
        context.beginPath();
        context.moveTo(line.x1, line.y1);
        context.lineTo(line.x2, line.y2);
        context.stroke();
      }
    });
  };

  const drawCross = (context, row, col, cellSize, padding) => {
    context.beginPath();
    context.moveTo(col * cellSize + padding, row * cellSize + padding);
    context.lineTo((col + 1) * cellSize - padding, (row + 1) * cellSize - padding);
    context.stroke();

    context.beginPath();
    context.moveTo((col + 1) * cellSize - padding, row * cellSize + padding);
    context.lineTo(col * cellSize + padding, (row + 1) * cellSize - padding);
    context.stroke();
  };

  const drawCircle = (context, row, col, cellSize, padding) => {
    context.beginPath();
    context.arc(
      col * cellSize + cellSize / 2,
      row * cellSize + cellSize / 2,
      cellSize / 2 - padding,
      0,
      2 * Math.PI
    );
    context.stroke();
  };

  const checkWinCondition = (player) => {
    // Vérifier les conditions de victoire
    const lines = [
      // lignes horizontales
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      // lignes verticales
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      // lignes diagonales
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]]
    ];

    for (let line of lines) {
      let win = true;
      for (let [row, col] of line) {
        if (gameBoard[row][col] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        setGameOver(true);
        break;
      }
    }
  };

  const handleClick = (event) => {
    if (gameOver) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const cellSize = rect.width / BOARD_SIZE;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (gameBoard[row][col] === EMPTY) {
      if (currentPlayerRef.current === PLAYER_1) {
        drawCross(context, row, col, cellSize, 10);
        gameBoard[row][col] = PLAYER_1;
        checkWinCondition(PLAYER_1);
        currentPlayerRef.current = PLAYER_2;
      } else if (currentPlayerRef.current === PLAYER_2) {
        drawCircle(context, row, col, cellSize, 10);
        gameBoard[row][col] = PLAYER_2;
        checkWinCondition(PLAYER_2);
        currentPlayerRef.current = PLAYER_1;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const display = gameData.displays[0];

    drawLines(context, display);

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [gameData]);

  return (
    <div className="app">
      {gameOver && <div className="game-over">Game Over</div>}
      <canvas
        ref={canvasRef}
        id="gameCanvas"
        width={gameData.displays[0].width}
        height={gameData.displays[0].height}
      ></canvas>
    </div>
  );
};

export default TicTacToe;
