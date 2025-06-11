const Player = require('../../src/players/Player');

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer');
  });

  describe('constructor', () => {
    it('should initialize with name and board', () => {
      expect(player.name).toBe('TestPlayer');
      expect(player.board).toBeDefined();
      expect(player.board.size).toBe(10);
    });
  });

  describe('initializeBoard', () => {
    it('should place ships on the board', () => {
      player.initializeBoard(2, 3);
      expect(player.board.ships.length).toBe(2);
      expect(player.board.ships[0].locations.length).toBe(3);
    });
  });

  describe('receiveAttack', () => {
    beforeEach(() => {
      player.initializeBoard(1, 3);
    });

    it('should process an attack and return result', () => {
      const ship = player.board.ships[0];
      const firstLocation = ship.locations[0];
      
      const result = player.receiveAttack(firstLocation);
      expect(result).toHaveProperty('hit');
      expect(result).toHaveProperty('sunk');
      expect(result).toHaveProperty('alreadyGuessed');
      expect(result.hit).toBe(true);
    });

    it('should return miss for invalid location', () => {
      const result = player.receiveAttack('99');
      expect(result.hit).toBe(false);
    });
  });

  describe('getShipsRemaining', () => {
    it('should return correct number of ships remaining', () => {
      player.initializeBoard(3, 3);
      expect(player.getShipsRemaining()).toBe(3);
    });

    it('should decrease when ships are sunk', () => {
      player.initializeBoard(1, 3);
      const ship = player.board.ships[0];
      
      // Sink the ship
      ship.locations.forEach(location => {
        player.receiveAttack(location);
      });
      
      expect(player.getShipsRemaining()).toBe(0);
    });
  });

  describe('hasLost', () => {
    it('should return false when ships remain', () => {
      player.initializeBoard(1, 3);
      expect(player.hasLost()).toBe(false);
    });

    it('should return true when all ships are sunk', () => {
      player.initializeBoard(1, 3);
      const ship = player.board.ships[0];
      
      // Sink the ship
      ship.locations.forEach(location => {
        player.receiveAttack(location);
      });
      
      expect(player.hasLost()).toBe(true);
    });
  });

  describe('getBoard', () => {
    it('should return the board grid', () => {
      const board = player.getBoard();
      expect(Array.isArray(board)).toBe(true);
      expect(board.length).toBe(10);
      expect(board[0].length).toBe(10);
    });
  });
}); 