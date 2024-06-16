import Bishop from '../pieces/bishop.js';
import King from '../pieces/king.js';
import Knight from '../pieces/knight.js';
import Pawn from '../pieces/pawn.js';
import Queen from '../pieces/queen.js';
import Rook from '../pieces/rook.js';
import Consul from '../pieces/consul.js';

export default function initialiseChessBoard() {
  const squares = Array(80).fill(null);

  for (let i = 10; i < 20; i++) {
    squares[i] = new Pawn(2, "P");
    squares[i + 50] = new Pawn(1, "P");
  }
  squares[0] = new Rook(2, "R");
  squares[9] = new Rook(2, "R");
  squares[70] = new Rook(1, "R");
  squares[79] = new Rook(1, "R");

  squares[1] = new Knight(2, "N");
  squares[8] = new Knight(2, "N");
  squares[71] = new Knight(1, "N");
  squares[78] = new Knight(1, "N");

  squares[2] = new Bishop(2, "B");
  squares[7] = new Bishop(2, "B");
  squares[72] = new Bishop(1, "B");
  squares[77] = new Bishop(1, "B");

  squares[3] = new Consul(2, "C");
  squares[6] = new Consul(2, "C");
  squares[73] = new Consul(1, "C");
  squares[76] = new Consul(1, "C");

  squares[4] = new Queen(2, "Q");
  squares[5] = new King(2, "K");

  squares[74] = new Queen(1, "Q");
  squares[75] = new King(1, "K");

  return squares;
}