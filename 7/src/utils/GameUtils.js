/**
 * Utility functions for game display and formatting
 */
class GameUtils {
  /**
   * Prints both boards side by side
   * @param {string[][]} opponentBoard - The opponent's board view
   * @param {string[][]} playerBoard - The player's board
   */
  static printBoards(opponentBoard, playerBoard) {
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    // Print header
    const header = '  ' + Array.from({length: 10}, (_, i) => i).join(' ');
    console.log(header + '     ' + header);

    // Print rows
    for (let i = 0; i < 10; i++) {
      let rowStr = `${i} `;
      
      // Opponent board
      for (let j = 0; j < 10; j++) {
        rowStr += opponentBoard[i][j] + ' ';
      }
      
      rowStr += `    ${i} `;
      
      // Player board
      for (let j = 0; j < 10; j++) {
        rowStr += playerBoard[i][j] + ' ';
      }
      
      console.log(rowStr);
    }
    console.log('\n');
  }

  /**
   * Prints a single board
   * @param {string[][]} board - The board to print
   * @param {string} title - Title for the board
   */
  static printBoard(board, title = 'BOARD') {
    console.log(`\n   --- ${title} ---`);
    
    // Print header
    const header = '  ' + Array.from({length: 10}, (_, i) => i).join(' ');
    console.log(header);

    // Print rows
    for (let i = 0; i < 10; i++) {
      let rowStr = `${i} `;
      for (let j = 0; j < 10; j++) {
        rowStr += board[i][j] + ' ';
      }
      console.log(rowStr);
    }
    console.log('\n');
  }

  /**
   * Formats a coordinate string for display
   * @param {string} coord - Coordinate string like "34"
   * @returns {string} - Formatted coordinate like "(3,4)"
   */
  static formatCoordinate(coord) {
    return `(${coord[0]},${coord[1]})`;
  }

  /**
   * Clears the console (works in most terminals)
   */
  static clearConsole() {
    console.clear();
  }

  /**
   * Prints a welcome message
   */
  static printWelcome() {
    console.log('\n='.repeat(50));
    console.log('           🚢 SEA BATTLE GAME 🚢');
    console.log('='.repeat(50));
    console.log('Try to sink all 3 enemy ships!');
    console.log('Enter coordinates like: 00, 34, 98');
    console.log('='.repeat(50));
  }

  /**
   * Prints game over message
   * @param {boolean} playerWon - True if player won
   */
  static printGameOver(playerWon) {
    console.log('\n' + '='.repeat(50));
    if (playerWon) {
      console.log('🎉 CONGRATULATIONS! You sunk all enemy ships! 🎉');
    } else {
      console.log('💥 GAME OVER! The CPU sunk all your ships! 💥');
    }
    console.log('='.repeat(50));
  }
}

module.exports = GameUtils; 