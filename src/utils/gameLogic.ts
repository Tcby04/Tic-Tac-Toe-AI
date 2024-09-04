export function checkWinner(board: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function minimax(board: (string | null)[], depth: number, isMaximizing: boolean): number {
  const winner = checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (board.every(cell => cell)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

export const getAIMove = (board: (string | null)[], aiSymbol: 'X' | 'O'): number => {
  const humanSymbol = aiSymbol === 'X' ? 'O' : 'X';
  
  // Check for winning move
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const newBoard = [...board];
      newBoard[i] = aiSymbol;
      if (checkWinner(newBoard) === aiSymbol) {
        return i;
      }
    }
  }

  // Check for blocking move
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const newBoard = [...board];
      newBoard[i] = humanSymbol;
      if (checkWinner(newBoard) === humanSymbol) {
        return i;
      }
    }
  }

  // Play center if available
  if (board[4] === null) {
    return 4;
  }

  // Play corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Play any available side
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter(i => board[i] === null);
  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }

  // If we reach here, there are no moves available (shouldn't happen in a normal game)
  return -1; // or throw an error
};
