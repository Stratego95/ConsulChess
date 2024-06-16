import Piece from './piece.js';
import { isSameRow } from '../helpers'

export default class Knight extends Piece {
  constructor(player, name) {
    super(player, name, (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"));
  }

  isMovePossible(src, dest) {
    return ((src - 21 === dest && !isSameRow(src, dest)) ||
      (src - 19 === dest && !isSameRow(src, dest)) ||
      (src - 8 === dest && !isSameRow(src, dest)) ||
      (src - 12 === dest && !isSameRow(src, dest)) ||
      (src + 8 === dest && !isSameRow(src, dest)) ||
      (src + 12 === dest && !isSameRow(src, dest)) ||
      (src + 21 === dest && !isSameRow(src, dest)) ||
      (src + 19 === dest && !isSameRow(src, dest)))
  }

  /**
   * always returns empty array because of jumping
   * @return {[]}
   */
  getSrcToDestPath() {
    return [];
  }
}
