# 🚢 Sea Battle Game - Modernized Edition

A completely refactored and modernized version of the classic Battleship game, built with modern JavaScript (ES6+) and comprehensive unit tests.

## 🎯 Game Overview

Sea Battle is a turn-based strategy game where you try to sink all enemy ships before the CPU sinks yours. The game features:

- **10x10 grid** battlefield
- **3 ships** of length 3 each for both player and CPU
- **Smart AI opponent** with hunt and target modes
- **Text-based interface** with clear visual feedback
- **Turn-based gameplay** with coordinate input (e.g., "00", "34", "98")

## 🚀 Quick Start

### Prerequisites
- Node.js 14.0.0 or higher

### Installation & Play
```bash
# Clone or download the project
cd sea-battle-game

# Install dependencies
npm install

# Start playing!
npm start
```

### Development
```bash
# Run tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 🎮 How to Play

1. **Setup**: Ships are automatically placed randomly for both you and the CPU
2. **Your Turn**: Enter coordinates like `34` to attack row 3, column 4
3. **Feedback**: 
   - 🎯 **HIT** - You struck an enemy ship!
   - 💧 **MISS** - Your shot hit water
   - 🎉 **SUNK** - You completely destroyed a ship!
4. **CPU Turn**: The AI makes its move automatically
5. **Victory**: Sink all enemy ships to win!

### Board Legend
- `~` Water (unexplored)
- `S` Your ships
- `X` Hits (yours or enemy's)
- `O` Misses

## 🏗️ Architecture

The game is built with a modern, modular architecture:

```
src/
├── models/
│   ├── Ship.js          # Ship entity with hit tracking
│   └── Board.js         # Game board with ship placement
├── players/
│   ├── Player.js        # Base player class
│   ├── HumanPlayer.js   # Human player with input validation
│   └── CpuPlayer.js     # AI player with hunt/target strategy
├── utils/
│   └── GameUtils.js     # Display and formatting utilities
├── Game.js              # Main game orchestrator
└── index.js             # Application entry point
```

## 🤖 AI Strategy

The CPU opponent uses a sophisticated two-mode AI:

### Hunt Mode
- Randomly searches for ships across the board
- Switches to Target Mode when a ship is hit

### Target Mode
- Systematically attacks adjacent cells around hits
- Maintains a queue of potential targets
- Returns to Hunt Mode when a ship is sunk

## 🧪 Testing

The project includes comprehensive unit tests with **85.71% coverage**:

```bash
# Run all tests
npm test

# Generate coverage report
npm run test:coverage

# View detailed coverage in browser
open coverage/lcov-report/index.html
```

### Test Coverage by Component
- **Ship Model**: 100% coverage
- **Board Model**: 100% coverage  
- **Player Classes**: 95%+ coverage
- **Game Logic**: 85%+ coverage
- **Utilities**: 100% coverage

## 🛠️ Modern JavaScript Features

This refactored version showcases modern JavaScript:

- **ES6+ Classes** for object-oriented design
- **let/const** instead of var
- **Arrow functions** for cleaner syntax
- **Template literals** for string formatting
- **Async/await** for asynchronous operations
- **Module system** for better organization
- **Destructuring** for cleaner code

## 📊 Code Quality

- **JSDoc documentation** throughout
- **Consistent coding style** with ESLint
- **Separation of concerns** with clear modules
- **Single responsibility principle** for each class
- **Comprehensive error handling**
- **Input validation and sanitization**

## 🎯 Original Game Compatibility

All original game mechanics are preserved:
- ✅ 10x10 grid layout
- ✅ 3 ships of length 3 each
- ✅ Coordinate input format (e.g., "00", "34")
- ✅ Turn-based gameplay
- ✅ CPU hunt and target AI modes
- ✅ Text-based display format
- ✅ Win/lose conditions

## 🔧 Configuration

The game can be easily configured by modifying constants in `Game.js`:

```javascript
constructor() {
  this.boardSize = 10;    // Board dimensions
  this.numShips = 3;      // Number of ships per player
  this.shipLength = 3;    // Length of each ship
}
```

## 🎭 Example Gameplay

```
==================================================
           🚢 SEA BATTLE GAME 🚢
==================================================
Try to sink all 3 enemy ships!
Enter coordinates like: 00, 34, 98
==================================================

   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    0 S S S ~ ~ ~ ~ ~ ~ ~
1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    3 ~ ~ ~ S S S ~ ~ ~ ~
4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    7 S S S ~ ~ ~ ~ ~ ~ ~
8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

Enter your guess (e.g., 00): 45
🎯 HIT at (4,5)!

--- CPU's Turn ---
🌊 CPU MISS at (1,2).
```

## 🤝 Contributing

This is a refactored educational project. Feel free to:
- Add new features (different ship sizes, multiplayer, GUI)
- Improve the AI strategy
- Enhance the display format
- Add new game modes

## 📄 License

MIT License - feel free to use this code for learning and educational purposes.

## 🏆 Project Goals Achieved

- ✅ **Modernized codebase** with ES6+ features
- ✅ **Proper separation of concerns** with modular architecture  
- ✅ **Comprehensive unit tests** with 85.71% coverage
- ✅ **Enhanced code quality** with documentation and linting
- ✅ **Preserved original gameplay** mechanics
- ✅ **Improved maintainability** and extensibility

---

*Happy sailing, Captain! 🚢⚓* 