import React, { useState } from 'react'
import GameContainer from './components/GameContainer'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [playerName, setPlayerName] = useState('')

  const startGame = () => {
    if (playerName.trim()) {
      setGameStarted(true)
    }
  }

  if (!gameStarted) {
    return (
      <div className="app">
        <div className="start-screen">
          <h1>RPG Multiplayer Game</h1>
          <div className="start-form">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && startGame()}
            />
            <button onClick={startGame} disabled={!playerName.trim()}>
              Start Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <GameContainer playerName={playerName} />
    </div>
  )
}

export default App