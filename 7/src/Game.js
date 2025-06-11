const readline = require('readline');
const HumanPlayer = require('./players/HumanPlayer');
const CpuPlayer = require('./players/CpuPlayer');
const GameUtils = require('./utils/GameUtils');

/**
 * Main Game class that orchestrates the Sea Battle game
 */
class Game {
  constructor() {
    this.boardSize = 10;
    this.numShips = 3;
    this.shipLength = 3;
    
    this.player = new HumanPlayer();
    this.cpu = new CpuPlayer();
    this.gameOver = false;
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Initializes the game by setting up boards and ships
   */
  async initialize() {
    console.log('Setting up the game...');
    
    // Place ships for both players
    this.player.initializeBoard(this.numShips, this.shipLength);
    this.cpu.initializeBoard(this.numShips, this.shipLength);
    
    console.log('Game initialized successfully!');
    GameUtils.printWelcome();
  }

  /**
   * Starts the main game loop
   */
  async start() {
    await this.initialize();
    await this.gameLoop();
  }

  /**
   * Main game loop handling turns
   */
  async gameLoop() {
    while (!this.gameOver) {
      // Check win conditions
      if (this.cpu.hasLost()) {
        this.endGame(true);
        break;
      }
      if (this.player.hasLost()) {
        this.endGame(false);
        break;
      }

      // Display current state
      GameUtils.printBoards(
        this.player.getOpponentBoard(),
        this.player.getBoard()
      );

      // Player's turn
      const playerGuess = await this.getPlayerGuess();
      if (playerGuess) {
        await this.processPlayerTurn(playerGuess);
        
        // Check if CPU lost after player's turn
        if (this.cpu.hasLost()) {
          continue; // Will be caught by win condition check
        }

        // CPU's turn
        await this.processCpuTurn();
      }
    }
  }

  /**
   * Gets a valid guess from the player
   * @returns {Promise<string|null>} - Player's guess or null if invalid
   */
  getPlayerGuess() {
    return new Promise((resolve) => {
      this.rl.question('Enter your guess (e.g., 00): ', (answer) => {
        const validation = this.player.validateGuess(answer);
        
        if (!validation.valid) {
          console.log('❌ ' + validation.message);
          resolve(null);
          return;
        }

        // Check if already guessed
        if (this.player.getOpponentBoard()[parseInt(answer[0])][parseInt(answer[1])] !== '~') {
          console.log('❌ You already guessed that location!');
          resolve(null);
          return;
        }

        resolve(answer);
      });
    });
  }

  /**
   * Processes the player's turn
   * @param {string} guess - Player's guess
   */
  async processPlayerTurn(guess) {
    const result = this.cpu.receiveAttack(guess);
    
    // Update player's view of opponent board
    this.player.updateOpponentBoard(guess, result.hit);
    
    if (result.hit) {
      if (result.sunk) {
        console.log(`🎯 DIRECT HIT! You sunk an enemy ship at ${GameUtils.formatCoordinate(guess)}!`);
      } else {
        console.log(`🎯 HIT at ${GameUtils.formatCoordinate(guess)}!`);
      }
    } else {
      console.log(`💧 MISS at ${GameUtils.formatCoordinate(guess)}.`);
    }
  }

  /**
   * Processes the CPU's turn
   */
  async processCpuTurn() {
    console.log("\n--- CPU's Turn ---");
    
    const cpuGuess = this.cpu.makeGuess();
    const result = this.player.receiveAttack(cpuGuess);
    
    // Update CPU's AI based on result
    this.cpu.processGuessResult(cpuGuess, result);
    
    if (result.hit) {
      if (result.sunk) {
        console.log(`💥 CPU SUNK your ship at ${GameUtils.formatCoordinate(cpuGuess)}!`);
      } else {
        console.log(`💥 CPU HIT at ${GameUtils.formatCoordinate(cpuGuess)}!`);
      }
    } else {
      console.log(`🌊 CPU MISS at ${GameUtils.formatCoordinate(cpuGuess)}.`);
    }

    // Add a small delay for better UX
    await this.delay(1000);
  }

  /**
   * Ends the game with win/lose message
   * @param {boolean} playerWon - True if player won
   */
  endGame(playerWon) {
    this.gameOver = true;
    
    // Show final board state
    GameUtils.printBoards(
      this.player.getOpponentBoard(),
      this.player.getBoard()
    );
    
    GameUtils.printGameOver(playerWon);
    this.rl.close();
  }

  /**
   * Utility method to add delays
   * @param {number} ms - Milliseconds to wait
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gets current game state for testing
   * @returns {Object} - Current game state
   */
  getGameState() {
    return {
      playerShipsRemaining: this.player.getShipsRemaining(),
      cpuShipsRemaining: this.cpu.getShipsRemaining(),
      gameOver: this.gameOver,
      cpuMode: this.cpu.getMode()
    };
  }
}

module.exports = Game; 