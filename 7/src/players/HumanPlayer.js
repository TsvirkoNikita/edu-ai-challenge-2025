const Player = require('./Player');

/**
 * Human Player class handling user input and validation
 */
class HumanPlayer extends Player {
  constructor() {
    super('Player');
    this.opponentBoard = Array(10).fill(null).map(() => Array(10).fill('~'));
  }

  /**
   * Validates a guess input
   * @param {string} guess - The guess input
   * @returns {Object} - {valid: boolean, message: string}
   */
  validateGuess(guess) {
    if (!guess || guess.length !== 2) {
      return {
        valid: false,
        message: 'Input must be exactly two digits (e.g., 00, 34, 98).'
      };
    }

    const row = parseInt(guess[0]);
    const col = parseInt(guess[1]);

    if (isNaN(row) || isNaN(col) || row < 0 || row >= 10 || col < 0 || col >= 10) {
      return {
        valid: false,
        message: 'Please enter valid coordinates between 0 and 9.'
      };
    }

    return { valid: true, message: '' };
  }

  /**
   * Updates the opponent board view based on attack result
   * @param {string} guess - The guess location
   * @param {boolean} hit - Whether it was a hit
   */
  updateOpponentBoard(guess, hit) {
    const row = parseInt(guess[0]);
    const col = parseInt(guess[1]);
    this.opponentBoard[row][col] = hit ? 'X' : 'O';
  }

  /**
   * Gets the opponent board view
   * @returns {string[][]} - Opponent board view
   */
  getOpponentBoard() {
    return this.opponentBoard.map(row => [...row]);
  }
}

module.exports = HumanPlayer; 