import { useState } from "react";

function Square({ value, onSquareClick, pos, line }) {
  return (
    <button
      className={`square ${line && line.includes(pos) && "bg"}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ isXNext, squares, onPlay }) {
  function handleClick(i, pos) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = isXNext ? "X" : "O";
    onPlay(nextSquares, pos);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else if (checkDraw(squares)) {
    status = "Draw! Start again";
  } else {
    status = "Next player: " + (isXNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {[...Array(3)].map((item, i) => (
        <div className="board-row" key={i}>
          {[...Array(3)].map((_, j) => (
            <Square
              key={`${j + i * 3}sq`}
              value={squares[j + i * 3]}
              pos={j + i * 3}
              onSquareClick={() => handleClick(j + i * 3, [i, j])}
              line={winner}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { sort: 1, squares: Array(9).fill(null), coord: null }
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const isXNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, pos) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { sort: history.length, squares: nextSquares, coord: pos }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setHistory([...history.slice(0, nextMove + 1)]);
  }

  function handleAscendingClick() {
    setIsAscending(!isAscending);
  }

  const sortHistory = isAscending
    ? history.slice().sort((a, b) => a.sort - b.sort)
    : history.slice().sort((a, b) => b.sort - a.sort);

  const moves = sortHistory.map((hist, move) => {
    let description;
    if (move > 0) {
      description = `Go to move # ${hist.sort} (row: ${
        hist.coord ? hist.coord[0] + 1 : 0
      } col: ${hist.coord ? hist.coord[1] + 1 : 0})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {history.length - 1 === move ? (
          <p style={{ marginTop: "0.25rem" }}>
            You are at move #{move} (row: {hist.coord ? hist.coord[0] + 1 : 0}{" "}
            col: {hist.coord ? hist.coord[1] + 1 : 0})
          </p>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board isXNext={isXNext} squares={currentSquares} onPlay={handlePlay} />
        <button style={{ marginTop: "1rem" }} onClick={handleAscendingClick}>
          {isAscending ? "Descending Order" : "Ascending Order"}
        </button>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function checkDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) return false;
  }

  return true;
}
