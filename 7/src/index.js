#!/usr/bin/env node

const Game = require('./Game');

/**
 * Main entry point for the Sea Battle game
 */
async function main() {
  try {
    const game = new Game();
    await game.start();
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nThanks for playing Sea Battle! 👋');
  process.exit(0);
});

// Start the game
if (require.main === module) {
  main();
}

module.exports = { Game }; 