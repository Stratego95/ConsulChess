export default class Piece {
  constructor(player, name, iconUrl) {
    this.player = player;
    this.name = name;
    this.style = { backgroundImage: "url('" + iconUrl + "')" };
  }

  getPlayer() {
    return this.player
  }

  getName() {
    return this.name
  }
}