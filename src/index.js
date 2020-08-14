import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

function Square(props) {
  return (
    <button
      className={props.winningSquare ? "winning-square" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningSquare={
          this.props.winningSquares
            ? this.props.winningSquares.includes(i)
            : null
        }
      />
    );
  }

  render() {
    const nineSquares = [];
    for (var i = 0; i < 3; i++) {
      const templist = [];
      for (var j = 0; j < 3; j++) {
        templist.push(this.renderSquare(i * 3 + j));
      }
      nineSquares.push(<div className="board-row">{templist}</div>);
    }

    return (
      <div>
        <div className="board-row">{nineSquares}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      winningSquares: null,
      currentMove: [null, null],
      ascending_order: true,
    };
  }

  handleClick(i) {
    this.setState({
      currentMove: [Math.floor(i / 3), Math.floor(i % 3)],
    });
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);
    if (winner || squares[i]) {
      if (winner) {
        this.setState({
          winningSquares: winner.slice(1, 4),
        });
      }
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      winningSquares: step + 1 === this.state.history.length ? [] : null,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? "move-color" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner[0];
    } else if (history.length === 10 && this.state.stepNumber === 9) {
      status = "Game is a draw.";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={this.state.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            Current move:
            <div>Row: {this.state.currentMove[0]}</div>
            <div>Column:{this.state.currentMove[1]}</div>
          </div>
          <div>
            <button
              onClick={() =>
                this.setState({ ascending_order: !this.state.ascending_order })
              }
            >
              {this.state.ascending_order ? "ASC" : "DESC"}
            </button>
          </div>
          <ol>
            {this.state.ascending_order ? moves : moves.slice().reverse()}
          </ol>
        </div>
      </div>
    );
  }
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
