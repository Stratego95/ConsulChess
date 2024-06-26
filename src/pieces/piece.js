export default class Piece {
  constructor(player, name, iconUrl) {
    this.player = player;
    this.name = name;
    this.style = { backgroundImage: "url('" + iconUrl + "')", fontSize: "10px", textAlign: "left"};
  }

  getPlayer() {
    return this.player
  }

  getName() {
    return this.name
  }
}