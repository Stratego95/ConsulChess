import React from 'react';
import Modal from 'react-modal';
import '../index.css';
import Rook from '../pieces/rook';
import Knight from '../pieces/knight';
import Bishop from '../pieces/bishop';
import Consul from '../pieces/consul';
import Queen from '../pieces/queen';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('game');

export default function PiecePicker(props) {
  const [modalIsOpen, setIsOpen] = React.useState(true);
  const [rook, setRook] = React.useState({})
  const [knight, setKnight] = React.useState({})
  const [bishop, setBishop] = React.useState({})
  const [consul, setConsul] = React.useState({})
  const [queen, setQueen] = React.useState({})
  const [currentPlayer, setCurrentPlayer] = React.useState(0)

  React.useEffect(() => {
    setCurrentPlayer(props.player === 1 ? 2 : 1)
    const player = props.player === 1 ? 2 : 1 
    setRook(new Rook(player, "R"))
    setKnight(new Knight(player, "N"))
    setBishop(new Bishop(player, "B"))
    setConsul(new Consul(player, "C"))
    setQueen(new Queen(player, "Q"))
  }, [props.player])

  function closeModal() {
    setIsOpen(false);
  }

  const handleOnClick = (piece, player) => {
    props.pieceChosen(piece, player)
    closeModal()
  }

  return (
    <div>
       {modalIsOpen && <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Modal"
      >
        <h2>Choose Piece</h2>
        <button className={"square other-square" } onClick={() => handleOnClick(rook.name, currentPlayer)} style={ rook.style}> </button>
        <button className={"square other-square" } onClick={() => handleOnClick(knight.name, currentPlayer)} style={ knight.style}> </button>
        <button className={"square other-square" } onClick={() => handleOnClick(bishop.name, currentPlayer)} style={ bishop.style}> </button>
        <button className={"square other-square" } onClick={() => handleOnClick(consul.name, currentPlayer)} style={ consul.style}> </button>
        <button className={"square other-square" } onClick={() => handleOnClick(queen.name, currentPlayer)} style={ queen.style}> </button>
        </Modal> }
    </div>
  );
}