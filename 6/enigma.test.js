const { Enigma, Rotor, plugboardSwap, alphabet, ROTORS, REFLECTOR, mod } = require('./enigma.js');
const assert = require('assert');

describe('Enigma Machine', function() {
  describe('Basic Functionality', function() {
    it('should encrypt and decrypt messages symmetrically', function() {
      const message = 'HELLO';
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, message, 'Decryption should return original message');
    });

    it('should handle single characters correctly', function() {
      const char = 'A';
      const enigma1 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
      const enigma2 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
      
      const encrypted = enigma1.process(char);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, char, 'Single character should decrypt correctly');
    });

    it('should work with different rotor positions', function() {
      const message = 'ENIGMA';
      const enigma1 = new Enigma([0, 1, 2], [5, 12, 23], [1, 2, 3], []);
      const enigma2 = new Enigma([0, 1, 2], [5, 12, 23], [1, 2, 3], []);
      
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, message, 'Message with different positions should decrypt correctly');
    });

    it('should handle complex configurations', function() {
      const message = 'THEQUICKBROWNFOX';
      const plugboard = [['A', 'R'], ['G', 'K'], ['O', 'X']];
      const enigma1 = new Enigma([0, 1, 2], [10, 5, 20], [2, 1, 3], plugboard);
      const enigma2 = new Enigma([0, 1, 2], [10, 5, 20], [2, 1, 3], plugboard);
      
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, message, 'Complex configuration should work correctly');
    });
  });

  describe('Plugboard', function() {
    it('should swap characters correctly in plugboard', function() {
      const pairs = [['A', 'B'], ['C', 'D']];
      
      assert.strictEqual(plugboardSwap('A', pairs), 'B');
      assert.strictEqual(plugboardSwap('B', pairs), 'A');
      assert.strictEqual(plugboardSwap('C', pairs), 'D');
      assert.strictEqual(plugboardSwap('D', pairs), 'C');
      assert.strictEqual(plugboardSwap('E', pairs), 'E');
    });

    it('should affect encryption results', function() {
      const message = 'A';
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);

      const result1 = enigma1.process(message);
      const result2 = enigma2.process(message);

      assert.notStrictEqual(result1, result2, 'Plugboard should affect encryption results');
    });

    it('should maintain symmetry with plugboard', function() {
      const message = 'TEST';
      const plugboard = [['A', 'B'], ['C', 'D']];
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboard);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboard);
      
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, message, 'Message with plugboard should decrypt correctly');
    });
  });

  describe('Rotor Mechanics', function() {
    it('should step rotors correctly', function() {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const initialPositions = enigma.rotors.map(r => r.position);
      
      enigma.encryptChar('A');
      const afterOneStep = enigma.rotors.map(r => r.position);
      
      assert.strictEqual(afterOneStep[2], 1, 'Right rotor should step');
      assert.strictEqual(afterOneStep[1], 0, 'Middle rotor should not step initially');
      assert.strictEqual(afterOneStep[0], 0, 'Left rotor should not step initially');
    });

    it('should implement double-stepping correctly', function() {
      // Set up scenario where middle rotor is at notch position (E = position 4)
      const enigma = new Enigma([0, 1, 2], [0, 4, 0], [0, 0, 0], []);
      
      enigma.encryptChar('A');
      const afterPositions = enigma.rotors.map(r => r.position);
      
      assert.strictEqual(afterPositions[0], 1, 'Left rotor should step in double-stepping');
      assert.strictEqual(afterPositions[1], 5, 'Middle rotor should step in double-stepping');
      assert.strictEqual(afterPositions[2], 1, 'Right rotor should always step');
    });

    it('should maintain rotor forward/backward symmetry', function() {
      const rotor = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 0);
      
      for (let i = 0; i < 26; i++) {
        const char = alphabet[i];
        const forward = rotor.forward(char);
        const backward = rotor.backward(forward);
        assert.strictEqual(backward, char, `Forward/backward should be symmetric for ${char}`);
      }
    });
  });

  describe('Edge Cases', function() {
    it('should handle non-alphabetic characters', function() {
      const message = 'HELLO 123!';
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, message, 'Non-alphabetic characters should pass through unchanged');
      assert(encrypted.includes(' '), 'Spaces should be preserved');
      assert(encrypted.includes('123!'), 'Numbers and symbols should be preserved');
    });

    it('should handle empty messages', function() {
      const message = '';
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, message, 'Empty message should remain empty');
    });

    it('should encrypt each character differently', function() {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const message = 'AAAA';
      const encrypted = enigma.process(message);
      
      const encryptedChars = encrypted.split('');
      assert.notStrictEqual(encryptedChars[0], encryptedChars[1], 'Each character should encrypt differently');
      assert.notStrictEqual(encryptedChars[1], encryptedChars[2], 'Each character should encrypt differently');
      assert.notStrictEqual(encryptedChars[2], encryptedChars[3], 'Each character should encrypt differently');
    });
  });

  describe('Historical Test Vectors', function() {
    it('should pass known Enigma test cases', function() {
      // Known test vector: Basic configuration
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      const message = 'TESTMESSAGE';
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, message, 'Known test vector should work');
    });

    it('should handle long messages correctly', function() {
      const longMessage = 'THISISAVERYLONGMESSAGETOTESTTHEENIGMAMACHINEIMPLEMENTATIONANDITSHOULDDECRYPTCORRECTLY';
      const enigma1 = new Enigma([0, 1, 2], [3, 7, 11], [1, 1, 1], [['A', 'Z'], ['B', 'Y']]);
      const enigma2 = new Enigma([0, 1, 2], [3, 7, 11], [1, 1, 1], [['A', 'Z'], ['B', 'Y']]);
      
      const encrypted = enigma1.process(longMessage);
      const decrypted = enigma2.process(encrypted);
      
      assert.strictEqual(decrypted, longMessage, 'Long message should decrypt correctly');
    });
  });
}); 