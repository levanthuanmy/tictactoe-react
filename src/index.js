import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className={props.styleSquare} onClick={props.onClick}>
      {props.value}
    </button>
  )                                                                                                                                                                                                                                                                                      
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        styleSquare={this.props.styleSquare[i]}
      />
    )
  }
  // Two loops to create the board! Took so long to do this so don't forget it!!!
  render() {

    const rows = this.props.map.map((i) => {

      var cells = i.map((j) => {
        return (<label key={j.toString()}>{this.renderSquare(j)}</label>)
      })
      return (
        <div key={i.toString()} className="board-row">
          {cells}
        </div>
      )
    })

    return (
      <div>
        {rows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      size: 3,
      map: [[0, 1, 2], [3, 4, 5], [6, 7, 8]],

      history: [
        {
          squares: Array(9).fill(null),
          lastMove: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      styleSquare: Array(9).fill("square"),
      isAscending: false,
    }
    this.toggle = this.toggle.bind(this)
  }

  createMap = (size = 3) => {
    if (size < 3) return
    this.jumpTo(0)
    const leng = size * size
    const resMap = []
    for (let i = 0; i < leng; i++) {
      const row = []
      for (let j = i; j < size + i; j++) {
        row.push(j)
      }
      resMap.push(row)
      i += size - 1
    }
    this.setState({
      size: size,
      map: resMap,
      history: [
        {
          squares: Array(leng).fill(null),
          lastMove: null,
        }
      ],
      styleSquare: Array(leng).fill("square"),

    })
  }

  handleClick(i) {
    var history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    var styleSquare = this.state.styleSquare.slice()
    const lastMove = [i % 3, Math.floor(i / 3)]

    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? "X" : "O"
    const winner = calculateWinner(this.state.size, squares)

    this.setState({
      history: history = history.concat([
        {
          squares: squares,
          lastMove: lastMove,
        }
      ]),
      stepNumber: history.length - 1,
      
      xIsNext: !this.state.xIsNext,
    })

    if (winner) {
      this.onWin(winner, styleSquare)
    }

  }

  onWin(winner, styleSquare) {
    console.log(winner)
    winner.map(item => {
      styleSquare[item] += " active-square"
      return null
    })
    this.setState({
      styleSquare: styleSquare,
    })
  }

  jumpTo(step) {
    var history = this.state.history.slice(0, step + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    var styleSquare = this.state.styleSquare.slice()
    const winner = calculateWinner(this.state.size, squares)

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })

    if (winner) {
      this.onWin(winner, styleSquare)
    } else {
      this.setState({
        styleSquare: Array(this.state.size * this.state.size).fill("square"),
      })
    }

  }

  toggle() {
    this.setState({
      isAscending: !this.state.isAscending,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(this.state.size, current?.squares)

    const toggle = this.state.isAscending ? "Ascending" : "Descending"

    const moves = history?.map((step, move) => {
      if (this.state.isAscending) {
        move = history.length - 1 - move
      }

      const desc = move ?
        'Go to move #' + move + ' at position (' + history[move].lastMove.toString() + ')' :
        'Go to game start'
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} className="hightlight-btn">{desc}</button>
          </li>
        )
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      }

    })

    let status
    if (winner) {
      status = "Winner: " + current?.squares[winner[0]]
    } else if (!current?.squares?.includes(null)) {
      status = "Its a draw!"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O")
    }

    return (<>
      <div className="btn-wrapper">
        <button onClick={() => this.createMap(this.state.size + 1)}>Increase the size of the board by 1 unit</button>
        <button onClick={() => this.createMap(this.state.size - 1)}>Decrease the size of the board by 1 unit (min 3)</button>
      </div>
      <div className="game">
        <div className="game-board">
          <Board
            map={this.state.map}
            squares={current?.squares}
            onClick={i => this.handleClick(i)}
            styleSquare={this.state.styleSquare}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <button onClick={this.toggle}>{toggle}</button>
          <ol>{moves}</ol>
        </div>
      </div></>
    )
  }
}


ReactDOM.render(<Game />, document.getElementById("root"))

function calculateWinner(size = 3, squares) {
  console.log(squares)
  if (!squares) return null
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c]
    }
  }
  return null
}

