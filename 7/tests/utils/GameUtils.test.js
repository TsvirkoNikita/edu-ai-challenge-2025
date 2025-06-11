const GameUtils = require('../../src/utils/GameUtils');

// Mock console methods to avoid cluttering test output
const mockConsoleLog = jest.fn();
const mockConsoleClear = jest.fn();

beforeAll(() => {
  global.console = {
    log: mockConsoleLog,
    clear: mockConsoleClear
  };
});

beforeEach(() => {
  mockConsoleLog.mockClear();
  mockConsoleClear.mockClear();
});

describe('GameUtils', () => {
  const mockBoard = [
    ['~', '~', 'X', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', 'O']
  ];

  const mockPlayerBoard = [
    ['S', 'S', 'S', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
    ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~']
  ];

  describe('printBoards', () => {
    it('should call console.log to print both boards', () => {
      GameUtils.printBoards(mockBoard, mockPlayerBoard);
      
      expect(mockConsoleLog).toHaveBeenCalled();
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('OPPONENT BOARD'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('YOUR BOARD'));
    });

    it('should print header with column numbers', () => {
      GameUtils.printBoards(mockBoard, mockPlayerBoard);
      
      const headerCall = mockConsoleLog.mock.calls.find(call => 
        call[0].includes('0 1 2 3 4 5 6 7 8 9')
      );
      expect(headerCall).toBeDefined();
    });

    it('should print all 10 rows', () => {
      GameUtils.printBoards(mockBoard, mockPlayerBoard);
      
      // Check that rows 0-9 are printed (with row numbers)
      for (let i = 0; i < 10; i++) {
        const rowCall = mockConsoleLog.mock.calls.find(call => 
          call[0].startsWith(`${i} `)
        );
        expect(rowCall).toBeDefined();
      }
    });
  });

  describe('printBoard', () => {
    it('should print a single board with default title', () => {
      GameUtils.printBoard(mockBoard);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('BOARD'));
    });

    it('should print a single board with custom title', () => {
      GameUtils.printBoard(mockBoard, 'TEST BOARD');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('TEST BOARD'));
    });

    it('should print header and all rows', () => {
      GameUtils.printBoard(mockBoard);
      
      // Check header
      const headerCall = mockConsoleLog.mock.calls.find(call => 
        call[0].includes('0 1 2 3 4 5 6 7 8 9')
      );
      expect(headerCall).toBeDefined();
      
      // Check all rows
      for (let i = 0; i < 10; i++) {
        const rowCall = mockConsoleLog.mock.calls.find(call => 
          call[0].startsWith(`${i} `)
        );
        expect(rowCall).toBeDefined();
      }
    });
  });

  describe('formatCoordinate', () => {
    it('should format coordinate string correctly', () => {
      expect(GameUtils.formatCoordinate('34')).toBe('(3,4)');
      expect(GameUtils.formatCoordinate('00')).toBe('(0,0)');
      expect(GameUtils.formatCoordinate('99')).toBe('(9,9)');
    });

    it('should handle edge cases', () => {
      expect(GameUtils.formatCoordinate('12')).toBe('(1,2)');
      expect(GameUtils.formatCoordinate('78')).toBe('(7,8)');
    });
  });

  describe('clearConsole', () => {
    it('should call console.clear', () => {
      GameUtils.clearConsole();
      
      expect(mockConsoleClear).toHaveBeenCalled();
    });
  });

  describe('printWelcome', () => {
    it('should print welcome message with game title', () => {
      GameUtils.printWelcome();
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('SEA BATTLE GAME'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Try to sink all 3 enemy ships!'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Enter coordinates like: 00, 34, 98'));
    });

    it('should print decorative borders', () => {
      GameUtils.printWelcome();
      
      const borderCall = mockConsoleLog.mock.calls.find(call => 
        call[0].includes('='.repeat(50))
      );
      expect(borderCall).toBeDefined();
    });
  });

  describe('printGameOver', () => {
    it('should print win message when player won', () => {
      GameUtils.printGameOver(true);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('CONGRATULATIONS'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('You sunk all enemy ships'));
    });

    it('should print lose message when player lost', () => {
      GameUtils.printGameOver(false);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('GAME OVER'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('CPU sunk all your ships'));
    });

    it('should print decorative borders for both outcomes', () => {
      GameUtils.printGameOver(true);
      
      const borderCall = mockConsoleLog.mock.calls.find(call => 
        call[0].includes('='.repeat(50))
      );
      expect(borderCall).toBeDefined();
      
      mockConsoleLog.mockClear();
      
      GameUtils.printGameOver(false);
      
      const borderCall2 = mockConsoleLog.mock.calls.find(call => 
        call[0].includes('='.repeat(50))
      );
      expect(borderCall2).toBeDefined();
    });
  });
}); 