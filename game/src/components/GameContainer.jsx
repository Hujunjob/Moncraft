import React, { useEffect, useRef } from 'react'
import { Game } from 'phaser'
import { gameConfig } from '../game/GameConfig'
import { GameScene } from '../game/GameScene'

const GameContainer = ({ playerName }) => {
  const gameRef = useRef(null)
  const phaserGameRef = useRef(null)

  useEffect(() => {
    if (!phaserGameRef.current) {
      // Create Phaser game instance
      const config = {
        ...gameConfig,
        parent: gameRef.current,
        scene: [GameScene]
      }
      
      phaserGameRef.current = new Game(config)
      
      // Pass player name to the game
      if (phaserGameRef.current.scene.scenes[0]) {
        phaserGameRef.current.scene.scenes[0].playerName = playerName
      }
    }

    // Cleanup on unmount
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [playerName])

  return (
    <div className="game-container">
      <div 
        ref={gameRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} 
      />
    </div>
  )
}

export default GameContainer