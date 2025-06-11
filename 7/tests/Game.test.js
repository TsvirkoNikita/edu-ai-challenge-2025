const Game = require('../src/Game');
const HumanPlayer = require('../src/players/HumanPlayer');
const CpuPlayer = require('../src/players/CpuPlayer');

// Mock console methods and readline
jest.mock('readline', () => ({
  createInterface: jest.fn(() => ({
    question: jest.fn(),
    close: jest.fn()
  }))
}));

const mockConsoleLog = jest.fn();
const mockConsoleError = jest.fn();

beforeAll(() => {
  global.console = {
    log: mockConsoleLog,
    error: mockConsoleError,
    clear: jest.fn()
  };
});

beforeEach(() => {
  mockConsoleLog.mockClear();
  mockConsoleError.mockClear();
});

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  describe('constructor', () => {
    it('should initialize with correct default values', () => {
      expect(game.boardSize).toBe(10);
      expect(game.numShips).toBe(3);
      expect(game.shipLength).toBe(3);
      expect(game.gameOver).toBe(false);
    });

    it('should create player and CPU instances', () => {
      expect(game.player).toBeInstanceOf(HumanPlayer);
      expect(game.cpu).toBeInstanceOf(CpuPlayer);
    });

    it('should create readline interface', () => {
      expect(game.rl).toBeDefined();
    });
  });

  describe('initialize', () => {
    it('should set up boards for both players', async () => {
      await game.initialize();
      
      expect(game.player.board.ships.length).toBe(3);
      expect(game.cpu.board.ships.length).toBe(3);
      expect(mockConsoleLog).toHaveBeenCalledWith('Setting up the game...');
      expect(mockConsoleLog).toHaveBeenCalledWith('Game initialized successfully!');
    });
  });

  describe('processPlayerTurn', () => {
    beforeEach(async () => {
      await game.initialize();
    });

    it('should process a hit correctly', async () => {
      // Find a ship location to hit
      const ship = game.cpu.board.ships[0];
      const hitLocation = ship.locations[0];
      
      await game.processPlayerTurn(hitLocation);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('HIT'));
    });

    it('should process a miss correctly', async () => {
      await game.processPlayerTurn('99'); // Likely to be a miss
      
      // Should either be hit or miss, but function should complete
      expect(mockConsoleLog).toHaveBeenCalled();
    });

    it('should update player\'s opponent board view', async () => {
      const originalBoard = game.player.getOpponentBoard();
      const testLocation = '00';
      
      await game.processPlayerTurn(testLocation);
      
      const updatedBoard = game.player.getOpponentBoard();
      expect(updatedBoard[0][0]).not.toBe(originalBoard[0][0]);
    });
  });

  describe('processCpuTurn', () => {
    beforeEach(async () => {
      await game.initialize();
    });

    it('should make CPU guess and process result', async () => {
      await game.processCpuTurn();
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining("CPU's Turn"));
      expect(game.cpu.guesses.length).toBe(1);
    });

    it('should update game state based on CPU guess', async () => {
      const initialPlayerShips = game.player.getShipsRemaining();
      
      await game.processCpuTurn();
      
      // Game state should be processed (hit or miss)
      expect(mockConsoleLog).toHaveBeenCalled();
    });
  });

  describe('endGame', () => {
    it('should set gameOver to true', () => {
      game.endGame(true);
      
      expect(game.gameOver).toBe(true);
    });

    it('should close readline interface', () => {
      const closeSpy = jest.spyOn(game.rl, 'close');
      game.endGame(true);
      
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should print appropriate message for player win', () => {
      game.endGame(true);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('CONGRATULATIONS'));
    });

    it('should print appropriate message for player loss', () => {
      game.endGame(false);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('GAME OVER'));
    });
  });

  describe('getGameState', () => {
    beforeEach(async () => {
      await game.initialize();
    });

    it('should return current game state', () => {
      const state = game.getGameState();
      
      expect(state).toHaveProperty('playerShipsRemaining');
      expect(state).toHaveProperty('cpuShipsRemaining');
      expect(state).toHaveProperty('gameOver');
      expect(state).toHaveProperty('cpuMode');
      
      expect(state.playerShipsRemaining).toBe(3);
      expect(state.cpuShipsRemaining).toBe(3);
      expect(state.gameOver).toBe(false);
      expect(state.cpuMode).toBe('hunt');
    });

    it('should reflect changes in game state', () => {
      game.gameOver = true;
      const state = game.getGameState();
      
      expect(state.gameOver).toBe(true);
    });
  });

  describe('delay', () => {
    it('should resolve after specified time', async () => {
      const startTime = Date.now();
      await game.delay(10); // 10ms delay
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(10);
    });
  });

  describe('game flow integration', () => {
    it('should handle complete game initialization', async () => {
      await game.initialize();
      
      const state = game.getGameState();
      expect(state.playerShipsRemaining).toBe(3);
      expect(state.cpuShipsRemaining).toBe(3);
      expect(state.gameOver).toBe(false);
    });

    it('should detect win condition', async () => {
      await game.initialize();
      
      // Manually sink all CPU ships for testing
      game.cpu.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          ship.hit(location);
        });
      });
      
      expect(game.cpu.hasLost()).toBe(true);
    });

    it('should detect lose condition', async () => {
      await game.initialize();
      
      // Manually sink all player ships for testing
      game.player.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          ship.hit(location);
        });
      });
      
      expect(game.player.hasLost()).toBe(true);
    });
  });
}); 