import React, { useRef, useEffect, useState } from "react";
import "../scss/morpion.scss"
import Swal from "sweetalert2";
const TicTacToe = ({ gameData,participants }) => {
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
  const [winner, setWinner] = useState(null);
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
    context.strokeStyle = "#40128B"; 
    context.stroke();

    context.beginPath();
    context.moveTo((col + 1) * cellSize - padding, row * cellSize + padding);
    context.lineTo(col * cellSize + padding, (row + 1) * cellSize - padding);
    context.strokeStyle = "#40128B"; 
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
    context.strokeStyle = "#F24C3D"; 
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
        setWinner(player === PLAYER_1 ? participants.player1 : participants.player2);

       if( winner === JSON.parse(localStorage.getItem('auth')).userName) {
        Swal.fire({
          icon : 'success',
          title: 'Gagnant',
          showCancelButton: true,
          text : `Félicitation ${winner} vous avez gagné.`,
          confirmButtonText: 'Nouvelle partie',
          cancelButtonText: `Fermer`,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          } 
        })
       }else{
        Swal.fire({
          icon : 'error',
          title: 'Game Over',
          showCancelButton: true,
          text : player === PLAYER_1 ? participants.player1 : participants.player2,
          confirmButtonText: 'Nouvelle partie',
          cancelButtonText: `Fermer`,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          } 
        })
       }
       
        break;
      }
    }

    // Vérifier si tous les champs sont remplis sans victoire
    let isBoardFull = true;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (gameBoard[row][col] === EMPTY) {
          isBoardFull = false;
          break;
        }
      }
      if (!isBoardFull) {
        break;
      }
    }
    if (isBoardFull && !gameOver) {
      setGameOver(true);
      setWinner("null");
      Swal.fire({
        icon : 'success',
        title: 'Terminé',
        text : "Match nul",
        showCancelButton: true,
        confirmButtonText: 'Nouvelle partie',
        cancelButtonText: `Fermer`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          window.location.reload();
        } 
      })
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
    <div>
     
        <table className="morpion-player-table">
          <thead>
            <tr>
              <td className="player1">Player 1</td>
              <td className="player2">Player 2</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{participants.player1}</td>
              <td>{participants.player2}</td>
            </tr>
          </tbody>
        </table>
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
