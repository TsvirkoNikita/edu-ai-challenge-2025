const HumanPlayer = require('../../src/players/HumanPlayer');

describe('HumanPlayer', () => {
  let humanPlayer;

  beforeEach(() => {
    humanPlayer = new HumanPlayer();
  });

  describe('constructor', () => {
    it('should initialize with Player name and opponent board', () => {
      expect(humanPlayer.name).toBe('Player');
      expect(humanPlayer.opponentBoard).toBeDefined();
      expect(humanPlayer.opponentBoard.length).toBe(10);
      expect(humanPlayer.opponentBoard[0].length).toBe(10);
    });

    it('should initialize opponent board with water (~)', () => {
      const allWater = humanPlayer.opponentBoard.every(row => 
        row.every(cell => cell === '~')
      );
      expect(allWater).toBe(true);
    });
  });

  describe('validateGuess', () => {
    it('should return valid for correct input format', () => {
      const result = humanPlayer.validateGuess('34');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('');
    });

    it('should return invalid for null input', () => {
      const result = humanPlayer.validateGuess(null);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('two digits');
    });

    it('should return invalid for empty input', () => {
      const result = humanPlayer.validateGuess('');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('two digits');
    });

    it('should return invalid for wrong length input', () => {
      const result = humanPlayer.validateGuess('1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('two digits');
    });

    it('should return invalid for too long input', () => {
      const result = humanPlayer.validateGuess('123');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('two digits');
    });

    it('should return invalid for non-numeric input', () => {
      const result = humanPlayer.validateGuess('ab');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('valid coordinates');
    });

    it('should return invalid for out of bounds coordinates', () => {
      let result = humanPlayer.validateGuess('99');
      expect(result.valid).toBe(true); // 99 is valid (9,9)

      result = humanPlayer.validateGuess('9a');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('valid coordinates');
    });

    it('should return invalid for negative coordinates', () => {
      const result = humanPlayer.validateGuess('-1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('valid coordinates');
    });
  });

  describe('updateOpponentBoard', () => {
    it('should mark hit (X) on opponent board', () => {
      humanPlayer.updateOpponentBoard('34', true);
      expect(humanPlayer.opponentBoard[3][4]).toBe('X');
    });

    it('should mark miss (O) on opponent board', () => {
      humanPlayer.updateOpponentBoard('56', false);
      expect(humanPlayer.opponentBoard[5][6]).toBe('O');
    });

    it('should handle multiple updates', () => {
      humanPlayer.updateOpponentBoard('00', true);
      humanPlayer.updateOpponentBoard('99', false);
      
      expect(humanPlayer.opponentBoard[0][0]).toBe('X');
      expect(humanPlayer.opponentBoard[9][9]).toBe('O');
    });
  });

  describe('getOpponentBoard', () => {
    it('should return a copy of the opponent board', () => {
      const board = humanPlayer.getOpponentBoard();
      expect(board).toEqual(humanPlayer.opponentBoard);
      expect(board).not.toBe(humanPlayer.opponentBoard); // Different reference
    });

    it('should reflect updates made to opponent board', () => {
      humanPlayer.updateOpponentBoard('12', true);
      const board = humanPlayer.getOpponentBoard();
      expect(board[1][2]).toBe('X');
    });
  });
}); 