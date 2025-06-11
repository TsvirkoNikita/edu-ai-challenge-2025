const Player = require('./Player');

/**
 * CPU Player class with hunt and target AI strategy
 */
class CpuPlayer extends Player {
  constructor() {
    super('CPU');
    this.mode = 'hunt';
    this.targetQueue = [];
    this.guesses = [];
  }

  /**
   * Makes a guess using the CPU's AI strategy
   * @returns {string} - The guess location
   */
  makeGuess() {
    let guess;

    if (this.mode === 'target' && this.targetQueue.length > 0) {
      guess = this.targetQueue.shift();
      
      // Skip if already guessed
      if (this.guesses.includes(guess)) {
        if (this.targetQueue.length === 0) {
          this.mode = 'hunt';
        }
        return this.makeGuess(); // Recursive call to get next guess
      }
    } else {
      this.mode = 'hunt';
      guess = this.makeRandomGuess();
    }

    this.guesses.push(guess);
    return guess;
  }

  /**
   * Makes a random guess for hunt mode
   * @returns {string} - Random valid guess
   */
  makeRandomGuess() {
    let guess;
    do {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      guess = `${row}${col}`;
    } while (this.guesses.includes(guess));
    
    return guess;
  }

  /**
   * Processes the result of a guess and updates AI state
   * @param {string} guess - The guess that was made
   * @param {Object} result - Result of the guess {hit, sunk}
   */
  processGuessResult(guess, result) {
    if (result.hit) {
      if (result.sunk) {
        // Ship was sunk, return to hunt mode
        this.mode = 'hunt';
        this.targetQueue = [];
      } else {
        // Hit but not sunk, switch to target mode
        this.mode = 'target';
        this.addAdjacentTargets(guess);
      }
    } else if (this.mode === 'target' && this.targetQueue.length === 0) {
      // Miss in target mode with no more targets
      this.mode = 'hunt';
    }
  }

  /**
   * Adds adjacent locations to the target queue
   * @param {string} guess - The location that was hit
   */
  addAdjacentTargets(guess) {
    const row = parseInt(guess[0]);
    const col = parseInt(guess[1]);
    
    const adjacentPositions = [
      { r: row - 1, c: col },     // Up
      { r: row + 1, c: col },     // Down
      { r: row, c: col - 1 },     // Left
      { r: row, c: col + 1 }      // Right
    ];

    for (const pos of adjacentPositions) {
      if (this.isValidPosition(pos.r, pos.c)) {
        const adjGuess = `${pos.r}${pos.c}`;
        if (!this.guesses.includes(adjGuess) && !this.targetQueue.includes(adjGuess)) {
          this.targetQueue.push(adjGuess);
        }
      }
    }
  }

  /**
   * Checks if a position is valid and not already guessed
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} - True if valid
   */
  isValidPosition(row, col) {
    return row >= 0 && row < 10 && col >= 0 && col < 10;
  }

  /**
   * Gets the current AI mode
   * @returns {string} - Current mode ('hunt' or 'target')
   */
  getMode() {
    return this.mode;
  }

  /**
   * Gets the current target queue
   * @returns {string[]} - Array of target locations
   */
  getTargetQueue() {
    return [...this.targetQueue];
  }
}

module.exports = CpuPlayer; 