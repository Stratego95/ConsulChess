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
    squares[i] = new Pawn(2);
    squares[i + 50] = new Pawn(1);
  }
  squares[0] = new Rook(2);
  squares[9] = new Rook(2);
  squares[70] = new Rook(1);
  squares[79] = new Rook(1);

  squares[1] = new Knight(2);
  squares[8] = new Knight(2);
  squares[71] = new Knight(1);
  squares[78] = new Knight(1);

  squares[2] = new Bishop(2);
  squares[7] = new Bishop(2);
  squares[72] = new Bishop(1);
  squares[77] = new Bishop(1);

  squares[3] = new Consul(2);
  squares[6] = new Consul(2);
  squares[73] = new Consul(1);
  squares[76] = new Consul(1);

  squares[4] = new Queen(2);
  squares[5] = new King(2);

  squares[74] = new Queen(1);
  squares[75] = new King(1);

  return squares;
}