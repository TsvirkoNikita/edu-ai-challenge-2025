const Ship = require('./Ship');

/**
 * Board class managing the game board state and ship placement
 */
class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = this.createGrid();
    this.ships = [];
    this.guesses = [];
  }

  /**
   * Creates an empty grid filled with water (~)
   * @returns {string[][]} - Empty grid
   */
  createGrid() {
    return Array(this.size).fill(null).map(() => 
      Array(this.size).fill('~')
    );
  }

  /**
   * Places ships randomly on the board
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   */
  placeShipsRandomly(numShips, shipLength) {
    let placedShips = 0;
    
    while (placedShips < numShips) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const startPos = this.getRandomStartPosition(shipLength, orientation);
      
      if (startPos && this.canPlaceShip(startPos, shipLength, orientation)) {
        const ship = this.createShip(startPos, shipLength, orientation);
        this.ships.push(ship);
        this.markShipOnGrid(ship);
        placedShips++;
      }
    }
  }

  /**
   * Gets a random valid start position for a ship
   * @param {number} shipLength - Length of the ship
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {Object|null} - {row, col} or null if invalid
   */
  getRandomStartPosition(shipLength, orientation) {
    const maxRow = orientation === 'vertical' ? this.size - shipLength : this.size - 1;
    const maxCol = orientation === 'horizontal' ? this.size - shipLength : this.size - 1;
    
    return {
      row: Math.floor(Math.random() * (maxRow + 1)),
      col: Math.floor(Math.random() * (maxCol + 1))
    };
  }

  /**
   * Checks if a ship can be placed at the given position
   * @param {Object} startPos - {row, col}
   * @param {number} shipLength - Length of the ship
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {boolean} - True if ship can be placed
   */
  canPlaceShip(startPos, shipLength, orientation) {
    for (let i = 0; i < shipLength; i++) {
      const row = startPos.row + (orientation === 'vertical' ? i : 0);
      const col = startPos.col + (orientation === 'horizontal' ? i : 0);
      
      if (row >= this.size || col >= this.size || this.grid[row][col] !== '~') {
        return false;
      }
    }
    return true;
  }

  /**
   * Creates a ship with the given parameters
   * @param {Object} startPos - {row, col}
   * @param {number} shipLength - Length of the ship
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {Ship} - New ship instance
   */
  createShip(startPos, shipLength, orientation) {
    const locations = [];
    
    for (let i = 0; i < shipLength; i++) {
      const row = startPos.row + (orientation === 'vertical' ? i : 0);
      const col = startPos.col + (orientation === 'horizontal' ? i : 0);
      locations.push(`${row}${col}`);
    }
    
    return new Ship(locations);
  }

  /**
   * Marks a ship on the grid (for player's own board)
   * @param {Ship} ship - Ship to mark
   */
  markShipOnGrid(ship) {
    ship.locations.forEach(location => {
      const row = parseInt(location[0]);
      const col = parseInt(location[1]);
      this.grid[row][col] = 'S';
    });
  }

  /**
   * Processes a guess and returns the result
   * @param {string} guess - The guess location (e.g., "34")
   * @returns {Object} - {hit: boolean, sunk: boolean, alreadyGuessed: boolean}
   */
  processGuess(guess) {
    if (this.guesses.includes(guess)) {
      return { hit: false, sunk: false, alreadyGuessed: true };
    }

    this.guesses.push(guess);
    const row = parseInt(guess[0]);
    const col = parseInt(guess[1]);

    for (const ship of this.ships) {
      if (ship.hit(guess)) {
        this.grid[row][col] = 'X';
        return { hit: true, sunk: ship.isSunk(), alreadyGuessed: false };
      }
    }

    this.grid[row][col] = 'O';
    return { hit: false, sunk: false, alreadyGuessed: false };
  }

  /**
   * Checks if the given coordinates are valid
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} - True if valid
   */
  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Gets the number of ships remaining (not sunk)
   * @returns {number} - Number of ships remaining
   */
  getShipsRemaining() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  /**
   * Gets the current state of the grid
   * @returns {string[][]} - Copy of the grid
   */
  getGrid() {
    return this.grid.map(row => [...row]);
  }

  /**
   * Checks if a guess has been made
   * @param {string} guess - The guess to check
   * @returns {boolean} - True if already guessed
   */
  hasGuessed(guess) {
    return this.guesses.includes(guess);
  }
}

module.exports = Board; 