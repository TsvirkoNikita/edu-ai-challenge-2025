const Board = require('../../src/models/Board');

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should initialize with default size 10', () => {
      expect(board.size).toBe(10);
      expect(board.grid.length).toBe(10);
      expect(board.grid[0].length).toBe(10);
    });

    it('should initialize with custom size', () => {
      const customBoard = new Board(5);
      expect(customBoard.size).toBe(5);
      expect(customBoard.grid.length).toBe(5);
    });

    it('should initialize empty ships and guesses arrays', () => {
      expect(board.ships).toEqual([]);
      expect(board.guesses).toEqual([]);
    });
  });

  describe('createGrid', () => {
    it('should create grid filled with water (~)', () => {
      const grid = board.createGrid();
      expect(grid.every(row => row.every(cell => cell === '~'))).toBe(true);
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      expect(board.isValidPosition(0, 0)).toBe(true);
      expect(board.isValidPosition(5, 5)).toBe(true);
      expect(board.isValidPosition(9, 9)).toBe(true);
    });

    it('should return false for invalid positions', () => {
      expect(board.isValidPosition(-1, 0)).toBe(false);
      expect(board.isValidPosition(0, -1)).toBe(false);
      expect(board.isValidPosition(10, 0)).toBe(false);
      expect(board.isValidPosition(0, 10)).toBe(false);
    });
  });

  describe('getRandomStartPosition', () => {
    it('should return valid positions for horizontal orientation', () => {
      const pos = board.getRandomStartPosition(3, 'horizontal');
      expect(pos.row).toBeGreaterThanOrEqual(0);
      expect(pos.row).toBeLessThan(10);
      expect(pos.col).toBeGreaterThanOrEqual(0);
      expect(pos.col).toBeLessThanOrEqual(7); // 10 - 3 = 7
    });

    it('should return valid positions for vertical orientation', () => {
      const pos = board.getRandomStartPosition(3, 'vertical');
      expect(pos.row).toBeGreaterThanOrEqual(0);
      expect(pos.row).toBeLessThanOrEqual(7); // 10 - 3 = 7
      expect(pos.col).toBeGreaterThanOrEqual(0);
      expect(pos.col).toBeLessThan(10);
    });
  });

  describe('canPlaceShip', () => {
    it('should return true for valid horizontal placement', () => {
      const startPos = { row: 0, col: 0 };
      expect(board.canPlaceShip(startPos, 3, 'horizontal')).toBe(true);
    });

    it('should return true for valid vertical placement', () => {
      const startPos = { row: 0, col: 0 };
      expect(board.canPlaceShip(startPos, 3, 'vertical')).toBe(true);
    });

    it('should return false when ship goes out of bounds horizontally', () => {
      const startPos = { row: 0, col: 8 };
      expect(board.canPlaceShip(startPos, 3, 'horizontal')).toBe(false);
    });

    it('should return false when ship goes out of bounds vertically', () => {
      const startPos = { row: 8, col: 0 };
      expect(board.canPlaceShip(startPos, 3, 'vertical')).toBe(false);
    });

    it('should return false when trying to place on occupied cell', () => {
      board.grid[0][0] = 'S';
      const startPos = { row: 0, col: 0 };
      expect(board.canPlaceShip(startPos, 3, 'horizontal')).toBe(false);
    });
  });

  describe('createShip', () => {
    it('should create ship with correct horizontal locations', () => {
      const startPos = { row: 0, col: 0 };
      const ship = board.createShip(startPos, 3, 'horizontal');
      expect(ship.locations).toEqual(['00', '01', '02']);
    });

    it('should create ship with correct vertical locations', () => {
      const startPos = { row: 0, col: 0 };
      const ship = board.createShip(startPos, 3, 'vertical');
      expect(ship.locations).toEqual(['00', '10', '20']);
    });
  });

  describe('placeShipsRandomly', () => {
    it('should place the specified number of ships', () => {
      board.placeShipsRandomly(2, 3);
      expect(board.ships.length).toBe(2);
    });

    it('should mark ships on grid', () => {
      board.placeShipsRandomly(1, 3);
      const shipCells = board.grid.flat().filter(cell => cell === 'S');
      expect(shipCells.length).toBe(3);
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      // Place a ship manually for testing
      const ship = board.createShip({ row: 0, col: 0 }, 3, 'horizontal');
      board.ships.push(ship);
      board.markShipOnGrid(ship);
    });

    it('should return alreadyGuessed true for repeated guess', () => {
      board.processGuess('00');
      const result = board.processGuess('00');
      expect(result.alreadyGuessed).toBe(true);
    });

    it('should return hit true when hitting a ship', () => {
      const result = board.processGuess('00');
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(board.grid[0][0]).toBe('X');
    });

    it('should return miss when not hitting a ship', () => {
      const result = board.processGuess('99');
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(board.grid[9][9]).toBe('O');
    });

    it('should return sunk true when ship is completely hit', () => {
      board.processGuess('00');
      board.processGuess('01');
      const result = board.processGuess('02');
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
    });
  });

  describe('getShipsRemaining', () => {
    it('should return correct number of ships remaining', () => {
      board.placeShipsRandomly(3, 3);
      expect(board.getShipsRemaining()).toBe(3);
      
      // Sink one ship
      const ship = board.ships[0];
      ship.locations.forEach(loc => board.processGuess(loc));
      expect(board.getShipsRemaining()).toBe(2);
    });
  });

  describe('hasGuessed', () => {
    it('should return true if guess was made', () => {
      board.processGuess('00');
      expect(board.hasGuessed('00')).toBe(true);
    });

    it('should return false if guess was not made', () => {
      expect(board.hasGuessed('00')).toBe(false);
    });
  });

  describe('getGrid', () => {
    it('should return a copy of the grid', () => {
      const grid = board.getGrid();
      expect(grid).toEqual(board.grid);
      expect(grid).not.toBe(board.grid); // Different reference
    });
  });
}); 