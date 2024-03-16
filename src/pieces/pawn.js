import Piece from './piece.js';
import { isSameDiagonal, isPathClean } from '../helpers'

export default class Pawn extends Piece {
  constructor(player) {
    super(player, (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg"));
    this.initialPositions = {
      1: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
      2: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    }
  }

  isMovePossible(src, dest, squares, isDestEnemyOccupied) {
    if (this.player === 1) {
      if ((dest === src - 10 && !isDestEnemyOccupied) || (dest === src - 20 && !isDestEnemyOccupied && this.initialPositions[1].indexOf(src) !== -1 && isPathClean(this.getSrcToDestPath(src, dest), squares))) {
        return true;
      }
      else if (isDestEnemyOccupied && isSameDiagonal(src, dest) && (dest === src - 11 || dest === src - 9)) {
        return true;
      }
    }
    else if (this.player === 2) {
      if ((dest === src + 10 && !isDestEnemyOccupied) || (dest === src + 20 && !isDestEnemyOccupied && this.initialPositions[2].indexOf(src) !== -1 && isPathClean(this.getSrcToDestPath(src, dest), squares))) {
        return true;
      }
      else if (isDestEnemyOccupied && isSameDiagonal(src, dest) && (dest === src + 11 || dest === src + 9)) {
        return true;
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
}