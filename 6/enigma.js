const readline = require('readline');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function mod(n, m) {
  return ((n % m) + m) % m;
}

const ROTORS = [
  { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' }, // Rotor I
  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' }, // Rotor II
  { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' }, // Rotor III
];
const REFLECTOR = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

function plugboardSwap(c, pairs) {
  for (const [a, b] of pairs) {
    if (c === a) return b;
    if (c === b) return a;
  }
  return c;
}

class Rotor {
  constructor(wiring, notch, ringSetting = 0, position = 0) {
    this.wiring = wiring;
    this.notch = notch;
    this.ringSetting = ringSetting;
    this.position = position;
  }
  
  step() {
    this.position = mod(this.position + 1, 26);
  }
  
  atNotch() {
    return alphabet[this.position] === this.notch;
  }
  
  forward(c) {
    const idx = mod(alphabet.indexOf(c) + this.position - this.ringSetting, 26);
    return this.wiring[idx];
  }
  
  backward(c) {
    const idx = this.wiring.indexOf(c);
    return alphabet[mod(idx - this.position + this.ringSetting, 26)];
  }
}

class Enigma {
  constructor(rotorIDs, rotorPositions, ringSettings, plugboardPairs) {
    this.rotors = rotorIDs.map(
      (id, i) =>
        new Rotor(
          ROTORS[id].wiring,
          ROTORS[id].notch,
          ringSettings[i],
          rotorPositions[i],
        ),
    );
    this.plugboardPairs = plugboardPairs;
  }
  
  stepRotors() {
    // Handle double-stepping: if middle rotor is at notch, it steps along with left rotor
    const shouldStepMiddle = this.rotors[1].atNotch();
    const shouldStepLeft = this.rotors[2].atNotch();
    
    // Always step rightmost rotor
    this.rotors[2].step();
    
    // Step middle rotor if rightmost is at notch, or if middle itself is at notch (double-stepping)
    if (shouldStepLeft || shouldStepMiddle) {
      this.rotors[1].step();
    }
    
    // Step leftmost rotor if middle rotor was at notch
    if (shouldStepMiddle) {
      this.rotors[0].step();
    }
  }
  
  encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    
    // Step rotors first (before encryption)
    this.stepRotors();
    
    // Apply plugboard
    c = plugboardSwap(c, this.plugboardPairs);
    
    // Forward through rotors (right to left)
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }

    // Through reflector
    c = REFLECTOR[alphabet.indexOf(c)];

    // Backward through rotors (left to right)
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }

    // Apply plugboard again (symmetric)
    c = plugboardSwap(c, this.plugboardPairs);

    return c;
  }
  
  process(text) {
    return text
      .toUpperCase()
      .split('')
      .map((c) => this.encryptChar(c))
      .join('');
  }
}

function promptEnigma() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter message: ', (message) => {
    rl.question('Rotor positions (e.g. 0 0 0): ', (posStr) => {
      const rotorPositions = posStr.split(' ').map(Number);
      rl.question('Ring settings (e.g. 0 0 0): ', (ringStr) => {
        const ringSettings = ringStr.split(' ').map(Number);
        rl.question('Plugboard pairs (e.g. AB CD): ', (plugStr) => {
          const plugPairs =
            plugStr
              .toUpperCase()
              .match(/([A-Z]{2})/g)
              ?.map((pair) => [pair[0], pair[1]]) || [];

          const enigma = new Enigma(
            [0, 1, 2],
            rotorPositions,
            ringSettings,
            plugPairs,
          );
          const result = enigma.process(message);
          console.log('Output:', result);
          rl.close();
        });
      });
    });
  });
}

// Export classes for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Enigma, Rotor, plugboardSwap, alphabet, ROTORS, REFLECTOR, mod };
}

if (require.main === module) {
  promptEnigma();
} 