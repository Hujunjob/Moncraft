# RPG Multiplayer Game

A 2D RPG multiplayer game built with **React**, **Phaser**, **Vite**, and **Croquet** for real-time multiplayer functionality.

## Features

- **Real-time Multiplayer** - Multiple players can join and play together using Croquet
- **2D Tilemap World** - Large explorable world built with tilemaps
- **Smooth Camera Following** - Camera follows player with smooth movement
- **Player Movement** - WASD or Arrow key controls with visual feedback
- **Modern Tech Stack** - Vite + React + Phaser + Croquet

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React** - UI framework for game interface
- **Phaser 3** - 2D game engine for rendering and physics
- **Croquet** - Real-time multiplayer synchronization
- **JavaScript ES6+** - Modern JavaScript features

## Game Architecture

### Project Structure
```
src/
├── components/        # React components
│   └── GameContainer.jsx
├── game/             # Phaser game logic
│   ├── GameScene.js     # Main game scene
│   ├── GameConfig.js    # Phaser configuration
│   ├── Player.js        # Player character class
│   ├── WorldMap.js      # Tilemap world management
│   ├── CroquetModels.js # Croquet shared models
│   └── CroquetView.js   # Croquet view logic
├── assets/           # Game assets
│   ├── images/
│   ├── tilemaps/
│   └── sounds/
├── App.jsx           # Main React app
└── main.jsx          # React entry point
```

### Game Systems

1. **World System** - Tilemap-based 2D world with camera following
2. **Player System** - Character movement, animation states, and visual feedback
3. **Multiplayer System** - Real-time synchronization of player positions and states
4. **UI System** - React-based game interface with player info and connection status

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or copy this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Croquet API key (optional for local testing):
   - Copy `.env.example` to `.env`
   - Get a free API key from [https://croquet.io/keys](https://croquet.io/keys)
   - Add your API key to `.env`:
     ```
     VITE_CROQUET_API_KEY=your_api_key_here
     ```

### Running the Game

Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Game Controls

- **WASD** or **Arrow Keys** - Move player character
- **Mouse** - (Future: UI interactions)

## Multiplayer

The game uses Croquet for real-time multiplayer functionality:

- Players automatically join the same session
- Player positions and movements are synchronized in real-time
- Each player has a unique color and name
- Connection status is displayed in the game UI

## Development Notes

### Tilemap System
- Uses Phaser's tilemap system with JSON format
- 32x32 pixel tiles in a 40x30 grid (1280x960 world)
- Easily expandable with Tiled map editor

### Camera System
- Smooth following with lerp interpolation
- Configurable deadzone for natural movement
- Bounded to world limits

### Multiplayer Architecture
- **Model** (CroquetModels.js) - Shared game state
- **View** (CroquetView.js) - Player-specific rendering and input
- **Scene** (GameScene.js) - Phaser game logic integration

## Future Enhancements

- [ ] Proper sprite animations
- [ ] Chat system
- [ ] NPCs and interactions
- [ ] Inventory system
- [ ] Quest system
- [ ] Combat mechanics
- [ ] Audio system
- [ ] Better tilemap graphics
- [ ] Mobile touch controls

## License

MIT License - feel free to use this as a foundation for your own RPG games!