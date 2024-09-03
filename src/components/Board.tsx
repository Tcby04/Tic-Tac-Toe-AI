import React from 'react';

interface BoardProps {
  board: (string | null)[];
  onMove: (index: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onMove }) => {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <button key={index} className="cell" onClick={() => onMove(index)}>
          {cell}
        </button>
      ))}
    </div>
  );
};

export default Board;