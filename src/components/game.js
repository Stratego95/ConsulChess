import React from 'react';
import '../index.css';
import Board from './board.js';
import King from '../pieces/king'
import Queen from '../pieces/queen'
import FallenSoldierBlock from './fallen-soldier-block.js';
import initialiseChessBoard from '../helpers/board-initialiser.js';
import PiecePicker from './../helpers/piecepickermodal'
import Knight from '../pieces/knight.js';
import Rook from '../pieces/rook.js';
import Bishop from '../pieces/bishop.js';
import Consul from '../pieces/consul.js';

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: initialiseChessBoard(),
      whiteFallenSoldiers: [],
      blackFallenSoldiers: [],
      player: 1,
      sourceSelection: -1,
      status: '',
      turn: 'white',
      castleInfo: { isCastling: false },
      notation: [],
      showPiecePicker: false,
      destSquare: -1
    }
  }

  handleClick(i) {
    const srcSquare = this.state.sourceSelection;

    const squares = [...this.state.squares];

    if(this.state.castleInfo.isCastling) {
      const lastMove = this.state.notation[this.state.notation.length-1];
      this.handleCastling(i, lastMove);
      return;
    }

    if (srcSquare === -1) {
      if ((!squares[i] || squares[i].player !== this.state.player)) {
        this.setState({ status: "Wrong selection. Choose player " + this.state.player + " pieces." });
        if (squares[i]) {
          squares[i].style = { ...squares[i].style, backgroundColor: "" };
        }
      }
      else {
        squares[i].style = { ...squares[i].style, backgroundColor: "RGB(111,143,114)" }; // Emerald from http://omgchess.blogspot.com/2015/09/chess-board-color-schemes.html
        this.setState({
          status: "Choose destination for the selected piece",
          sourceSelection: i
        })
      }
      return
    }

    squares[srcSquare].style = { ...squares[srcSquare].style, backgroundColor: "" };

    if (squares[i] && squares[i].player === this.state.player) {
      this.setState({
        status: "Wrong selection. Choose valid source and destination again.",
        sourceSelection: -1,
      });
    }
    else {

      const whiteFallenSoldiers = [];
      const blackFallenSoldiers = [];
      const isDestEnemyOccupied = Boolean(squares[i]);
      const destSquare = i;
      const notation = this.state.notation;
      const isMovePossible = squares[srcSquare].isMovePossible(srcSquare, destSquare, squares, isDestEnemyOccupied, notation, whiteFallenSoldiers, blackFallenSoldiers);
      const castleInfo = Object.hasOwn(squares[srcSquare], "castleInfo") ? squares[srcSquare].castleInfo : {};

      this.handlePawnConversion(squares, srcSquare, destSquare)

      if (isMovePossible) {
        if (!(squares[srcSquare].name === "P" && squares[srcSquare].pawnConversionHappened) ) {
          if (squares[destSquare] !== null) {
            if (squares[destSquare].player === 1) {
              whiteFallenSoldiers.push(squares[destSquare]);
            }
            else {
              blackFallenSoldiers.push(squares[destSquare]);
            }
          }
        }
          // update notation
          const name = squares[srcSquare].getName();
          const playerS = squares[srcSquare].getPlayer();
          const moveNumber = notation.length + 1;
          notation.push({moveNumber, playerS, name, srcSquare, destSquare})
  
        if (!(squares[srcSquare].name === "P" && squares[srcSquare].pawnConversionHappened) ) {
          squares[destSquare] = squares[srcSquare];
        }
        squares[srcSquare] = null;

        if (castleInfo.isCastling) {
          return this.resetForCastling(destSquare, castleInfo, squares)
        }

        

        const isCheckMe = this.isCheckForPlayer(squares, this.state.player)
        
        if (isCheckMe) {
          this.setState(oldState => ({
            status: "Wrong selection. Choose valid source and destination again. Now you have a check!",
            sourceSelection: -1,
          }))
        } else {
          let player = this.state.player === 1 ? 2 : 1;
          let turn = this.state.turn === 'white' ? 'black' : 'white';

          this.setState(oldState => ({
            sourceSelection: -1,
            squares,
            whiteFallenSoldiers: [...oldState.whiteFallenSoldiers, ...whiteFallenSoldiers],
            blackFallenSoldiers: [...oldState.blackFallenSoldiers, ...blackFallenSoldiers],
            player,
            status: '',
            turn,
            notation
          }));
        }
      }
      else {
        this.setState({
          status: "Wrong selection. Choose valid source and destination again.",
          sourceSelection: -1,
        });
      }
    }
  }

  getKingPosition(squares, player) {
    return squares.reduce((acc, curr, i) =>
      acc || //King may be only one, if we had found it, returned his position
      ((curr //current squre mustn't be a null
        && (curr.getPlayer() === player)) //we are looking for aspecial king 
        && (curr instanceof King)
        && i), // returned position if all conditions are completed
      null)
  }

  isCheckForPlayer(squares, player) {
    const opponent = player === 1 ? 2 : 1
    const playersKingPosition = this.getKingPosition(squares, player)
    const canPieceKillPlayersKing = (piece, i) => piece.isMovePossible(i, playersKingPosition, squares, true)
    return squares.reduce((acc, curr, idx) =>
      acc ||
      (curr &&
        (curr.getPlayer() === opponent) &&
        canPieceKillPlayersKing(curr, idx)
        && true),
      false)
  }

  handleCastling(destSquare, lastMove) {
    const srcSquare = this.state.sourceSelection;
    const squares = [...this.state.squares];
    const castling = this.state.castleInfo.allowedDestinations.includes(destSquare)
    let kingMove = false
    if(castling) {
      squares[destSquare] = squares[srcSquare];
      squares[srcSquare] = null;
      squares[destSquare].style = { ...squares[destSquare].style, backgroundColor: "" };
  }
  
  if (this.state.castleInfo.possibleNormalKingMove) {
    squares[lastMove.destSquare].style = { ...squares[lastMove.destSquare].style, backgroundColor: "" };
    if(lastMove.destSquare === destSquare) {
      kingMove = true
      squares[destSquare].style = { ...squares[destSquare].style, backgroundColor: "" };
      squares[srcSquare].style = { ...squares[srcSquare].style, backgroundColor: "" };
    }
  }
  
  if(!kingMove && !castling) return

  let player = this.state.player === 1 ? 2 : 1;
  let turn = this.state.turn === 'white' ? 'black' : 'white';
  this.setState(oldState => ({
    sourceSelection: -1,
    squares,
    player,
    status: '',
    turn,
    castleInfo: { isCastling: false }
  }));
  }

  resetForCastling(i, castleInfo, squares) {
      squares[castleInfo.allowedSource].style = { ...squares[castleInfo.allowedSource].style, backgroundColor: "RGB(111,143,114)" }; // Emerald from http://omgchess.blogspot.com/2015/09/chess-board-color-schemes.html

      if (castleInfo.possibleNormalKingMove) {
        squares[i].style = { ...squares[i].style, backgroundColor: "RGB(111,143,114)" }; // Emerald from http://omgchess.blogspot.com/2015/09/chess-board-color-schemes.html
      }

      squares[i].castleInfo = {
        isCastling:  false,
        allowedSource: -1,
        allowedDestinations: []
       }

      this.setState({
        castleInfo: castleInfo,
        sourceSelection: castleInfo.allowedSource,
        squares,
        status: "Choose destination for the castle rook",
      });
      return
  }

  handlePawnConversion(squares, srcSquare, destSquare) {
    if (!(squares[srcSquare].name === "P" && squares[srcSquare].pawnConversionHappened)) return
    this.setState({
      showPiecePicker: true,
      destSquare
    })
  }

  handlePieceChosen(piece, player) {
    const squares = this.state.squares
    const destSquare = this.state.destSquare
    if(destSquare === -1) return
    
    if(piece === "R") squares[destSquare] = new Rook(player,"R");
    if(piece === "N") squares[destSquare] = new Knight(player,"N")
    if(piece === "B") squares[destSquare] = new Bishop(player,"B")
    if(piece === "C") squares[destSquare] = new Consul(player,"C")
    if(piece === "Q") squares[destSquare] = new Queen(player,"Q")

      this.setState({
        showPiecePicker: false,
        squares,
        destSquare: -1
      })
  }

  render() {

    return (
      <div>
        <div>
        {this.state.showPiecePicker && <PiecePicker player={this.state.player} pieceChosen={(piece, player) => this.handlePieceChosen(piece, player)} /> }
        </div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={this.state.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <h3>Turn</h3>
            <div id="player-turn-box" style={{ backgroundColor: this.state.turn }}>

            </div>
            <div className="game-status">{this.state.status}</div>

            <div className="fallen-soldier-block">

              {<FallenSoldierBlock
                whiteFallenSoldiers={this.state.whiteFallenSoldiers}
                blackFallenSoldiers={this.state.blackFallenSoldiers}
              />
              }
            </div>

          </div>
        </div>

        <div className="icons-attribution">
          <div> <small> Chess Icons And Favicon (extracted) By en:User:Cburnett [<a href="http://www.gnu.org/copyleft/fdl.html">GFDL</a>, <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA-3.0</a>, <a href="http://opensource.org/licenses/bsd-license.php">BSD</a> or <a href="http://www.gnu.org/licenses/gpl.html">GPL</a>], <a href="https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces">via Wikimedia Commons</a> </small></div>
        </div>
      </div>


    );
  }
}

