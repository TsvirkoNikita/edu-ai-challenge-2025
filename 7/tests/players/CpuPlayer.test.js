const CpuPlayer = require('../../src/players/CpuPlayer');

describe('CpuPlayer', () => {
  let cpuPlayer;

  beforeEach(() => {
    cpuPlayer = new CpuPlayer();
  });

  describe('constructor', () => {
    it('should initialize with CPU name and hunt mode', () => {
      expect(cpuPlayer.name).toBe('CPU');
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
      expect(cpuPlayer.guesses).toEqual([]);
    });
  });

  describe('makeGuess', () => {
    it('should return a valid guess in hunt mode', () => {
      const guess = cpuPlayer.makeGuess();
      expect(guess).toMatch(/^\d\d$/);
      expect(cpuPlayer.guesses).toContain(guess);
    });

    it('should not make duplicate guesses', () => {
      const guesses = new Set();
      
      // Make multiple guesses and ensure no duplicates
      for (let i = 0; i < 10; i++) {
        const guess = cpuPlayer.makeGuess();
        expect(guesses.has(guess)).toBe(false);
        guesses.add(guess);
      }
    });

    it('should use target queue when in target mode', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = ['00', '01'];
      
      const guess = cpuPlayer.makeGuess();
      expect(guess).toBe('00');
      expect(cpuPlayer.targetQueue).toEqual(['01']);
    });

    it('should switch to hunt mode when target queue is empty', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = [];
      
      cpuPlayer.makeGuess();
      expect(cpuPlayer.mode).toBe('hunt');
    });
  });

  describe('makeRandomGuess', () => {
    it('should generate valid coordinates', () => {
      const guess = cpuPlayer.makeRandomGuess();
      const row = parseInt(guess[0]);
      const col = parseInt(guess[1]);
      
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(10);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(10);
    });
  });

  describe('processGuessResult', () => {
    it('should stay in hunt mode on miss', () => {
      cpuPlayer.processGuessResult('00', { hit: false, sunk: false });
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
    });

    it('should switch to target mode on hit', () => {
      cpuPlayer.processGuessResult('55', { hit: true, sunk: false });
      expect(cpuPlayer.mode).toBe('target');
      expect(cpuPlayer.targetQueue.length).toBeGreaterThan(0);
    });

    it('should return to hunt mode when ship is sunk', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = ['00', '01'];
      
      cpuPlayer.processGuessResult('55', { hit: true, sunk: true });
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
    });

    it('should return to hunt mode on miss with empty target queue', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = [];
      
      cpuPlayer.processGuessResult('55', { hit: false, sunk: false });
      expect(cpuPlayer.mode).toBe('hunt');
    });
  });

  describe('addAdjacentTargets', () => {
    beforeEach(() => {
      // Clear any existing guesses
      cpuPlayer.guesses = [];
    });

    it('should add valid adjacent positions', () => {
      cpuPlayer.addAdjacentTargets('55'); // Center position
      
      const expectedTargets = ['45', '65', '54', '56'];
      expectedTargets.forEach(target => {
        expect(cpuPlayer.targetQueue).toContain(target);
      });
    });

    it('should not add out of bounds positions', () => {
      cpuPlayer.addAdjacentTargets('00'); // Corner position
      
      // Should not contain invalid negative coordinates
      expect(cpuPlayer.targetQueue).not.toContain('-10');
      expect(cpuPlayer.targetQueue).not.toContain('0-1');
      
      // Should contain valid adjacent positions
      expect(cpuPlayer.targetQueue).toContain('10');
      expect(cpuPlayer.targetQueue).toContain('01');
      
      // Should only have valid positions
      expect(cpuPlayer.targetQueue.length).toBe(2);
    });

    it('should not add already guessed positions', () => {
      cpuPlayer.guesses = ['45', '65'];
      cpuPlayer.addAdjacentTargets('55');
      
      expect(cpuPlayer.targetQueue).not.toContain('45');
      expect(cpuPlayer.targetQueue).not.toContain('65');
      expect(cpuPlayer.targetQueue).toContain('54');
      expect(cpuPlayer.targetQueue).toContain('56');
    });

    it('should not add duplicate targets to queue', () => {
      cpuPlayer.targetQueue = ['54'];
      cpuPlayer.addAdjacentTargets('55');
      
      // Should not duplicate '54'
      const count54 = cpuPlayer.targetQueue.filter(target => target === '54').length;
      expect(count54).toBe(1);
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      expect(cpuPlayer.isValidPosition(0, 0)).toBe(true);
      expect(cpuPlayer.isValidPosition(5, 5)).toBe(true);
      expect(cpuPlayer.isValidPosition(9, 9)).toBe(true);
    });

    it('should return false for invalid positions', () => {
      expect(cpuPlayer.isValidPosition(-1, 0)).toBe(false);
      expect(cpuPlayer.isValidPosition(0, -1)).toBe(false);
      expect(cpuPlayer.isValidPosition(10, 0)).toBe(false);
      expect(cpuPlayer.isValidPosition(0, 10)).toBe(false);
    });
  });

  describe('getMode', () => {
    it('should return current mode', () => {
      expect(cpuPlayer.getMode()).toBe('hunt');
      
      cpuPlayer.mode = 'target';
      expect(cpuPlayer.getMode()).toBe('target');
    });
  });

  describe('getTargetQueue', () => {
    it('should return copy of target queue', () => {
      cpuPlayer.targetQueue = ['00', '01'];
      const queue = cpuPlayer.getTargetQueue();
      
      expect(queue).toEqual(['00', '01']);
      expect(queue).not.toBe(cpuPlayer.targetQueue); // Different reference
    });
  });

  describe('AI behavior integration', () => {
    it('should demonstrate hunt and target behavior cycle', () => {
      // Initially in hunt mode
      expect(cpuPlayer.getMode()).toBe('hunt');
      
      // Make a guess and hit
      const guess = cpuPlayer.makeGuess();
      cpuPlayer.processGuessResult(guess, { hit: true, sunk: false });
      
      // Should switch to target mode with adjacent targets
      expect(cpuPlayer.getMode()).toBe('target');
      expect(cpuPlayer.getTargetQueue().length).toBeGreaterThan(0);
      
      // Make another guess from target queue
      const targetGuess = cpuPlayer.makeGuess();
      cpuPlayer.processGuessResult(targetGuess, { hit: true, sunk: true });
      
      // Should return to hunt mode
      expect(cpuPlayer.getMode()).toBe('hunt');
      expect(cpuPlayer.getTargetQueue().length).toBe(0);
    });
  });
}); 