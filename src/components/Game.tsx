import React, { useState, useEffect } from 'react';
import Board from './Board';
import InfoTooltip from './InfoTooltip';
import { checkWinner, getAIMove } from '../utils/gameLogic';

const Game: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (!isXNext && !winner) {
      const aiMove = getAIMove(board);
      handleMove(aiMove);
    }
  }, [isXNext, winner, board]);

  const handleMove = (index: number) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div>
      <h1>
        Tic Tac Toe: AI vs Human
        <InfoTooltip />
      </h1>
      <Board board={board} onMove={handleMove} />
      {winner && <p>{winner === 'X' ? 'You win!' : 'AI wins!'}</p>}
      {!winner && board.every(cell => cell) && <p>It's a draw!</p>}
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default Game;