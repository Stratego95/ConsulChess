import Piece from './piece.js';
import { isSameDiagonal, isSameRow } from '../helpers'

export default class King extends Piece {
  constructor(player, name) {
    super(player, name, (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"));
    this.hasMoved = false
    this.castleInfo = {
     isCastling:  false,
     allowedSource: -1,
     allowedDestinations: [],
     possibleNormalKingMove: false
    }
  }

  isMovePossible(src, dest, squares, checkForOpponentsCastle) {
    const canMoveRegular = ((src - 11 === dest && isSameDiagonal(src, dest)) ||
      src - 10 === dest ||
      (src - 9 === dest && isSameDiagonal(src, dest)) ||
      (src + 1 === dest && isSameRow(src, dest)) ||
      (src + 11 === dest && isSameDiagonal(src, dest)) ||
      src + 10 === dest ||
      (src + 9 === dest && isSameDiagonal(src, dest)) ||
      (src - 1 === dest && isSameRow(src, dest)))

    if(checkForOpponentsCastle) return canMoveRegular;
    const castleInfo = this.canCastle(src, dest, squares);
    if(castleInfo.canCastle){
      this.castleInfo.isCastling = true;
      this.castleInfo.allowedSource = castleInfo.allowedSource;  
      this.castleInfo.allowedDestinations = castleInfo.allowedDestinations;  
      this.castleInfo.possibleNormalKingMove = castleInfo.possibleNormalKingMove;  
    } 
    if(canMoveRegular || castleInfo.canCastle) this.hasMoved = true; 
    return canMoveRegular || castleInfo.canCastle;
  }

  /**
   * always returns empty array because of one step
   * @return {[]}
   */
  getSrcToDestPath(src, dest) {

    if(this.player === 1) {
      return dest > src ? [76,77,78] : [71,72,73,74];
    }

    if(this.player === 2) {
      return dest > src ? [6,7,8] : [1,2,3,4];
    }

    return []
  }

  checkIfDestinationIsValid(dest) {
    if(this.player === 1) {
      return [71,72,73,74,76,77,78].includes(dest);
    }

    if(this.player === 2) {
      return [1,2,3,4,6,7,8].includes(dest);
    }

    return []
  }

  canCastle(src, dest, squares) {
    // check if king has moved already
    if(this.hasMoved) return {canCastle: false};
    
    let rookIdx = -1;

    // getting the rook relevant for castling
    rookIdx = this.getRookIdx(src, dest, squares);

    if(squares[rookIdx] === null) return {canCastle: false};

    // check if square has rook and whether it has moved
    if(Object.hasOwn(squares[rookIdx], "hasMoved") && squares[rookIdx].hasMoved) return {canCastle: false};

    // check if path is clear
    const validDestination = this.checkIfDestinationIsValid(dest);
    if(!validDestination) return {canCastle: false};

    const path = this.getSrcToDestPath(src, dest);
    for (const i of path) {
      if (squares[i] !== null) return {canCastle: false};
    }

    // check if king is in check
    if(this.isCheck(src, dest, squares)) return {canCastle: false};

    const allowedDestinations = this.getRookDestination(src, dest, squares, rookIdx);

    const possibleNormalKingMove = Math.abs(src - dest) === 1;

    return {canCastle: true, allowedSource: rookIdx, allowedDestinations: allowedDestinations, possibleNormalKingMove: possibleNormalKingMove};
  }

  getRookIdx(src, dest) {
    if(this.player === 1) {
      return dest > src ? 79 : 70;
    }

    if(this.player === 2) {
      return dest > src ? 9 : 0;
    }
  }

  isCheck(src, dest, squares) {
    let relevantSquares = []

    if(this.player === 1) {
      if (dest > src) {
        relevantSquares = Array.from({ length: dest - src }, (_, index) => src + 1 + index);
      } else {
        relevantSquares = Array.from({ length: src - dest }, (_, index) => src - 1 - index);
      }
    }

    if(this.player === 2) {
      if (dest > src) {
        relevantSquares = Array.from({ length: dest - src }, (_, index) => src + 1 + index);
      } else {
        relevantSquares = Array.from({ length: src - dest }, (_, index) => src - 1 - index);
      }
    }

    const opponent = this.player === 1 ? 2 : 1

    for(let i = 0; i < squares.length; i++) {
      if(squares[i] !== null && squares[i].player === opponent) {
        for(const relevantSquare of relevantSquares) {
          if(squares[i].isMovePossible(i, relevantSquare, squares, undefined, true)) return true;
        }
      }
    }

    return false
  }

  getRookDestination(src, dest, squares, rookIdx) {
    let allowedDestinations = [];
    if(rookIdx === 70)
    {
      for(let i = dest + 1; i < 80; i++) {
          if(squares[i] === null || i === src) {
            allowedDestinations.push(i); 
          } 
          else {
            // exit for loop
            break
          }
      }
    }

    if(rookIdx === 79)
    {
      for(let i = dest - 1; i >= 70; i--) {
          if(squares[i] === null || i === src) {
            allowedDestinations.push(i); 
          } 
          else {
            // exit for loop
            break
          }
      }
    }

    if(rookIdx === 0)
    {
      for(let i = dest + 1; i < 10; i++) {
          if(squares[i] === null || i === src) {
            allowedDestinations.push(i); 
          } 
          else {
            // exit for loop
            break
          }
      }
    }

    if(rookIdx === 9)
    {
      for(let i = dest - 1; i >= 0; i--) {
          if(squares[i] === null || i === src) {
            allowedDestinations.push(i); 
          } 
          else {
            // exit for loop
            break
          }
      }
    }
    return allowedDestinations;
  } 
}
