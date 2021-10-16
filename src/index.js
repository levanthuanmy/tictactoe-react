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
  render() {
    return (
      <>
        {this.props.map.map((i) => (
          <div key={i} className="board-row">
            {i.map((j) => (
              <label key={j}>
                <Square
                  value={this.props.squares[j]}
                  onClick={() => this.props.onClick(j)}
                  styleSquare={this.props.styleSquare[j]}
                />
              </label>
            ))}
          </div>
        )
        )}
      </>
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
    let history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    let styleSquare = this.state.styleSquare.slice()
    const lastMove = [i % this.state.size, Math.floor(i / this.state.size)]

    if (calculateWinner(this.state.size, squares) || squares[i]) {
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
    winner?.map(item => {
      styleSquare[item] += " active-square"
      return null
    })
    this.setState({
      styleSquare: styleSquare,
    })
  }

  jumpTo(step) {
    let history = this.state.history.slice(0, step + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    let styleSquare = this.state.styleSquare.slice()
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
    const toggle = this.state.isAscending ? "Ascending Order" : "Descending Order"
    const moves = history?.map((items, move) => {
      if (this.state.isAscending) {
        move = history.length - 1 - move
      }
      const desc = move ?
        <div style={{ textAlign: 'start' }}>
          Go to move #{move}
          <br />
          X: {history[move].lastMove[0]}, Y: {history[move].lastMove[1]}
          <br /> Player: {current.squares[history[move].lastMove[0] + history[move].lastMove[1] * this.state.size]}
        </div>
        :
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
      status = "Draw!"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O")
    }
    return (
      <>
        <div className="game">
          <div className="game-info">
            <div className="status">{status}</div>
            <p>Current size: {this.state.size}x{this.state.size}</p>
            <div className="btn-wrapper">
              <button onClick={() => this.createMap(this.state.size + 1)}>Increase the size of the board by 1 unit</button>
              <button onClick={() => this.createMap(this.state.size - 1)}>Decrease the size of the board by 1 unit (min 3)</button>
              <button onClick={() => this.createMap(3)}>Reset size</button>
              <button onClick={this.toggle}>{toggle}</button>
            </div>
            <ol className="wrapper-history">{moves}</ol>
          </div>
          <div className="game-board">
            <Board
              map={this.state.map}
              squares={current?.squares}
              onClick={i => this.handleClick(i)}
              styleSquare={this.state.styleSquare}
            />
          </div>
        </div>
      </>
    )
  }
}

ReactDOM.render(<Game />, document.getElementById("root"))

function calculateWinner(size = 3, squares) {
  const numOfStreaks = size < 5 ? 3 : 5 // board size < 5x5 => rule is 3 || 5 
  const leng = size * size || squares.length
  let winPostions = []
  let winCheck = false

  for (let pos = 0; pos < leng; pos++) {
    if (!squares[pos]) {
      continue
    }
    winCheck = true
    winPostions = [pos]
    for (let point = 1; point < numOfStreaks; point++) {
      if (
        pos + point * (size + 1) > leng ||
        squares[pos] !== squares[pos + point * (size + 1)]
      ) {
        winCheck = false
        break
      }
      winPostions.push(pos + point * (size + 1))
    }
    if (winCheck) return winPostions
  }

  for (let pos = 0; pos < leng; pos++) {
    if (!squares[pos] || pos % size < (numOfStreaks - 1)) {
      continue
    }
    winCheck = true
    winPostions = [pos]
    for (let point = 1; point < numOfStreaks; point++) {
      let nextPosition = pos + point * (size - 1)
      if (nextPosition < 0 || squares[pos] !== squares[nextPosition]) {
        winCheck = false
        break
      }
      winPostions.push(nextPosition)
    }
    if (winCheck) return winPostions
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - numOfStreaks + 1; j++) {
      const pos = i * size + j
      if (!squares[pos]) {
        continue
      }
      winCheck = true
      winPostions = [pos]
      for (let point = 1; point < numOfStreaks; point++) {
        if (squares[pos] !== squares[pos + point]) {
          winCheck = false
          break
        }
        winPostions.push(pos + point)
      }
      if (winCheck) return winPostions
    }
  }

  for (let j = 0; j < size - numOfStreaks + 1; j++) {
    for (let i = 0; i < size; i++) {
      const pos = j * size + i
      if (!squares[pos]) {
        continue
      }
      winCheck = true
      winPostions = [pos]
      for (let point = 1; point < numOfStreaks; point++) {
        if (squares[pos] !== squares[pos + point * size]) {
          winCheck = false
          break
        }
        winPostions.push(pos + point * size)
      }
      if (winCheck) return winPostions
    }
  }

  return null
}

