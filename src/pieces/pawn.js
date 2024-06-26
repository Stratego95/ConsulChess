import Piece from './piece.js';
import { isSameDiagonal, isPathClean } from '../helpers'

export default class Pawn extends Piece {
  constructor(player, name) {
    super(player, name, (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg"));
    this.initialPositions = {
      1: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
      2: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    }
    this.pawnConversionHappened = false;
  }

  isMovePossible(src, dest, squares, isDestEnemyOccupied, notation, whiteFallenSoldiers, blackFallenSoldiers) {
    if (this.player === 1) {
      if ((dest === src - 10 && !isDestEnemyOccupied) || (dest === src - 20 && !isDestEnemyOccupied && this.initialPositions[1].indexOf(src) !== -1 && isPathClean(this.getSrcToDestPath(src, dest), squares))) {
        this.checkAndHandlePawnConversion(dest, isDestEnemyOccupied, squares, whiteFallenSoldiers, blackFallenSoldiers);
        return true;
      }
      else if (isDestEnemyOccupied && isSameDiagonal(src, dest) && (dest === src - 11 || dest === src - 9)) {
        this.checkAndHandlePawnConversion(dest, isDestEnemyOccupied, squares, whiteFallenSoldiers, blackFallenSoldiers);
        return true;
      }
      else if (this.checkForEnPassant(src, dest, squares, notation, whiteFallenSoldiers, blackFallenSoldiers)) {
        return true
      }
    }
    else if (this.player === 2) {
      if ((dest === src + 10 && !isDestEnemyOccupied) || (dest === src + 20 && !isDestEnemyOccupied && this.initialPositions[2].indexOf(src) !== -1 && isPathClean(this.getSrcToDestPath(src, dest), squares))) {
        this.checkAndHandlePawnConversion(dest, isDestEnemyOccupied, squares, whiteFallenSoldiers, blackFallenSoldiers);
        return true;
      }
      else if (isDestEnemyOccupied && isSameDiagonal(src, dest) && (dest === src + 11 || dest === src + 9)) {
        this.checkAndHandlePawnConversion(dest, isDestEnemyOccupied, squares, whiteFallenSoldiers, blackFallenSoldiers);
        return true;
      }
      else if (this.checkForEnPassant(src, dest, squares, notation, whiteFallenSoldiers, blackFallenSoldiers)) {
        return true
      }
    }
    return false;
  }

  getSrcToDestPath(src, dest) {
    if (dest === src - 20) {
      return [src - 10];
    }
    else if (dest === src + 20) {
      return [src + 10];
    }
    return [];
  }

  checkForEnPassant(src, dest, squares, notation, whiteFallenSoldiers, blackFallenSoldiers) {
    if(!notation || !notation.length) return false;
    const lastMove = notation[notation.length-1];
    if (lastMove.name !== "P") return false;
    if (!isSameDiagonal(src, dest)) return false;

    if (this.player === 1) {
      if (lastMove.destSquare - lastMove.srcSquare !== 20) return false;

      if (dest === src - 11) {
        if (src - lastMove.destSquare !== 1) return false;
        blackFallenSoldiers.push(squares[lastMove.destSquare]);
        squares[lastMove.destSquare] = null;
        return true;
      }

      if (dest === src - 9) {
        if (lastMove.destSquare - src !== 1) return false;
        blackFallenSoldiers.push(squares[lastMove.destSquare]);
        squares[lastMove.destSquare] = null;
        return true;
      }

      return false;
    }

    if (this.player === 2) {
      if (lastMove.srcSquare - lastMove.destSquare !== 20) return false;

      if (dest === src + 11) {
        if (lastMove.destSquare - src !== 1) return false;
        whiteFallenSoldiers.push(squares[lastMove.destSquare])
        squares[lastMove.destSquare] = null;
        return true;
      }

      if (dest === src + 9) {
        if (src - lastMove.destSquare !== 1) return false;
        whiteFallenSoldiers.push(squares[lastMove.destSquare])
        squares[lastMove.destSquare] = null;
        return true;
      }

      return false;
    }
  }

  checkAndHandlePawnConversion(dest, isDestEnemyOccupied, squares, whiteFallenSoldiers, blackFallenSoldiers) {
    if (this.player === 1) {
     if(dest < 10) {
      this.pawnConversionHappened = true;
      if (isDestEnemyOccupied) blackFallenSoldiers.push(squares[dest]);
     }
    }
    else if (this.player === 2) {
      if(dest > 69) {
        this.pawnConversionHappened = true;
        if (isDestEnemyOccupied) whiteFallenSoldiers.push(squares[dest]);
     }
    }
  }
}