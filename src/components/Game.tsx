import React, { useState, useEffect } from 'react';
import Board from './Board';
import InfoTooltip from './InfoTooltip';
import { checkWinner, getAIMove } from '../utils/gameLogic';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const Game: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameCount, setGameCount] = useState<number>(0);

  useEffect(() => {
    if (!isXNext && !checkWinner(board) && board.some(cell => cell === null)) {
      const aiMove = getAIMove(board);
      handleMove(aiMove);
    }
  }, [isXNext, board]);

  const handleMove = (index: number) => {
    if (checkWinner(board) || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    if (checkWinner(newBoard) || newBoard.every(cell => cell !== null)) {
      setGameCount(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const calculateWinProbability = (player: string) => {
    let winningLines = 0;
    let totalLines = 0;

    WINNING_COMBINATIONS.forEach(combo => {
      const [a, b, c] = combo;
      const comboState = [board[a], board[b], board[c]];
      const playerCount = comboState.filter(cell => cell === player).length;
      const emptyCount = comboState.filter(cell => cell === null).length;

      if (playerCount === 2 && emptyCount === 1) {
        winningLines += 1;
      }
      if (playerCount === 1 && emptyCount === 2) {
        winningLines += 0.2; // Potential future win
      }
      if (emptyCount > 0) {
        totalLines += 1;
      }
    });

    return winningLines / Math.max(totalLines, 1);
  };

  const calculateStats = () => {
    const winner = checkWinner(board);
    const isBoardFull = board.every(cell => cell !== null);

    if (winner === 'X') {
      return { player: 100, ai: 0, draw: 0 };
    } else if (winner === 'O') {
      return { player: 0, ai: 100, draw: 0 };
    } else if (isBoardFull) {
      return { player: 0, ai: 0, draw: 100 };
    }

    const playerProb = calculateWinProbability('X');
    const aiProb = calculateWinProbability('O');

    // Adjust probabilities based on whose turn it is
    const adjustedPlayerProb = isXNext ? playerProb : Math.max(0, playerProb - aiProb);
    const adjustedAiProb = !isXNext ? aiProb : Math.max(0, aiProb - playerProb);

    const drawProb = Math.max(0, 1 - adjustedPlayerProb - adjustedAiProb);

    const total = adjustedPlayerProb + adjustedAiProb + drawProb;
    return {
      player: (adjustedPlayerProb / total) * 100,
      ai: (adjustedAiProb / total) * 100,
      draw: (drawProb / total) * 100
    };
  };

  const stats = calculateStats();
  const winner = checkWinner(board);

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
      <div className="stats">
        <h2>Live Probabilities</h2>
        <p>Player Winning: {stats.player.toFixed(1)}%</p>
        <p>AI Winning: {stats.ai.toFixed(1)}%</p>
        <p>Draw: {stats.draw.toFixed(1)}%</p>
        <p>Games Played: {gameCount}</p>
      </div>
    </div>
  );
};

export default Game;