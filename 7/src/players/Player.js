const Board = require('../models/Board');

/**
 * Base Player class with common functionality
 */
class Player {
  constructor(name) {
    this.name = name;
    this.board = new Board();
  }

  /**
   * Initializes the player's board with ships
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   */
  initializeBoard(numShips, shipLength) {
    this.board.placeShipsRandomly(numShips, shipLength);
  }

  /**
   * Processes an opponent's guess on this player's board
   * @param {string} guess - The guess location
   * @returns {Object} - Result of the guess
   */
  receiveAttack(guess) {
    return this.board.processGuess(guess);
  }

  /**
   * Gets the number of ships remaining
   * @returns {number} - Ships remaining
   */
  getShipsRemaining() {
    return this.board.getShipsRemaining();
  }

  /**
   * Checks if the player has lost (all ships sunk)
   * @returns {boolean} - True if player has lost
   */
  hasLost() {
    return this.getShipsRemaining() === 0;
  }

  /**
   * Gets the player's board grid
   * @returns {string[][]} - Board grid
   */
  getBoard() {
    return this.board.getGrid();
  }
}

module.exports = Player; 