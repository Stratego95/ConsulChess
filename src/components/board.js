import React from 'react';

import '../index.css';
import Square from './square.js';

const  defaultStyle = {
  fontSize: "10px",
  textAlign: "left",
}

export default class Board extends React.Component {

  

  renderSquare(i, squareShade, value) {

    value = this.getValueBasedOnSquareIdx(i)
    return <Square
      key={i}
      keyVal={value}
      style={this.props.squares[i] ? this.props.squares[i].style : defaultStyle}
      shade={squareShade}
      onClick={() => this.props.onClick(i)}
    />
  }

  getValueBasedOnSquareIdx(i) {
    if(i === 0) return "8"
    if(i === 10) return "7"
    if(i === 20) return "6"
    if(i === 30) return "5"
    if(i === 40) return "4"
    if(i === 50) return "3"
    if(i === 60) return "2"

    if(i === 70) return "1 a"

    if(i === 71) return "b"
    if(i === 72) return "c"
    if(i === 73) return "d"
    if(i === 74) return "e"
    if(i === 75) return "f"
    if(i === 76) return "g"
    if(i === 77) return "h"
    if(i === 78) return "i"
    if(i === 79) return "j"
  }

  render() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      const squareRows = [];
      for (let j = 0; j < 10; j++) {
        const squareShade = (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j)) ? "light-square" : "dark-square";
        squareRows.push(this.renderSquare((i * 10) + j, squareShade));
      }
      board.push(<div className="board-row" key={i}>{squareRows}</div>)
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}


function isEven(num) {
  return num % 2 === 0
}