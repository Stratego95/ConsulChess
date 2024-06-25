import Piece from './piece.js';
import { isSameRow, isSameColumn, isSameDiagonal } from '../helpers'

export default class Consul extends Piece {
  constructor(player, name) {
    super(player, name, (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Chess_Blt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/5/5a/Chess_Bdt45.svg"));
  }

  isMovePossible(src, dest, squares) {
    if(!this.checkForMoveLength(src, dest)) return false
    if(!(isSameDiagonal(src, dest) || isSameRow(src, dest) || isSameColumn(src, dest))) return false
    const path = this.getSrcToDestPath(src, dest)

    let pathEmpty = true
    for (const i of path) {
      if (squares[i] !== null) pathEmpty = false;
    }

    let pathFullyOccupied = true

    for (const i of path) {
      if (squares[i] === null) pathFullyOccupied = false;
    }
  
    return pathEmpty || pathFullyOccupied
  }

  /**
   * get path between src and dest (srcq and dest exclusive)
   * @param  {num} src  
   * @param  {num} dest 
   * @return {[array]}      
   */
  getSrcToDestPath(src, dest) {
    let path = [], pathStart, pathEnd, incrementBy;
    if (src > dest) {
      pathStart = dest;
      pathEnd = src;
    }
    else {
      pathStart = src;
      pathEnd = dest;
    }

    if (Math.abs(src - dest) % 10 === 0) {
      incrementBy = 10;
      pathStart += 10;
    }
    else if (Math.abs(src - dest) % 11 === 0) {
      incrementBy = 11;
      pathStart += 11;
    }
    else if (Math.abs(src - dest) % 9 === 0) {
      incrementBy = 9;
      pathStart += 9;
    }
    else {
      incrementBy = 1;
      pathStart += 1;
    }

    for (let i = pathStart; i < pathEnd; i += incrementBy) {
      path.push(i);
    }
    return path;
  }

  checkForMoveLength(src, dest) {
    if (Math.abs(src - dest) % 10 === 0 && Math.abs(src - dest) > 30) {
      return false
    }
    else if (Math.abs(src - dest) % 11 === 0 && Math.abs(src - dest) > 33) {
     return false
    }
    else if (Math.abs(src - dest) % 9 === 0 && Math.abs(src - dest) > 27) {
      return false
    }
    else if (isSameRow(src, dest) && Math.abs(src - dest) > 3) {
      return false
    }
    return true
  }
}