import { View } from "@croquet/croquet"

export class RPGGameView extends View {
  constructor(model) {
    super(model)
    this.model = model
    this.gameScene = null
    this.localPlayerId = this.viewId
    this.otherPlayers = new Map() // Map of playerId -> sprite
    
    // Subscribe to model events
    this.subscribe(this.model.id, "player-joined", this.onPlayerJoined)
    this.subscribe(this.model.id, "player-left", this.onPlayerLeft)
    this.subscribe(this.model.id, "player-moved", this.onPlayerMoved)
    this.subscribe(this.model.id, "player-updated", this.onPlayerUpdated)
    this.subscribe(this.model.id, "game-started", this.onGameStarted)
    this.subscribe(this.model.id, "chat-received", this.onChatReceived)
    
    console.log(`RPG Game View initialized for player ${this.localPlayerId}`)
  }

  setGameScene(scene) {
    this.gameScene = scene
    
    // Create sprites for existing players
    const allPlayers = this.model.getAllPlayers()
    allPlayers.forEach(playerData => {
      if (playerData.id !== this.localPlayerId) {
        this.createOtherPlayerSprite(playerData)
      }
    })
  }

  onPlayerJoined(data) {
    const { playerId, playerData, allPlayers } = data
    
    console.log(`Player joined: ${playerId}`)
    
    // Create sprite for other players (not local player)
    if (playerId !== this.localPlayerId && this.gameScene) {
      this.createOtherPlayerSprite(playerData)
    }
    
    // Update UI with player count
    if (this.gameScene && this.gameScene.updatePlayerCount) {
      this.gameScene.updatePlayerCount(allPlayers.length)
    }
  }

  onPlayerLeft(data) {
    const { playerId, allPlayers } = data
    
    console.log(`Player left: ${playerId}`)
    
    // Remove sprite for other players
    if (this.otherPlayers.has(playerId)) {
      const sprite = this.otherPlayers.get(playerId)
      sprite.destroy()
      this.otherPlayers.delete(playerId)
    }
    
    // Update UI with player count
    if (this.gameScene && this.gameScene.updatePlayerCount) {
      this.gameScene.updatePlayerCount(allPlayers.length)
    }
  }

  onPlayerMoved(data) {
    const { playerId, playerData } = data
    
    // Update other players' positions (not local player)
    if (playerId !== this.localPlayerId && this.otherPlayers.has(playerId)) {
      const sprite = this.otherPlayers.get(playerId)
      
      // Smooth movement towards target position
      this.gameScene.tweens.add({
        targets: sprite,
        x: playerData.x,
        y: playerData.y,
        duration: 100,
        ease: 'Power2',
        onUpdate: () => {
          // Update name position during movement
          if (sprite.nameText) {
            sprite.nameText.setPosition(sprite.x, sprite.y - 20)
          }
        }
      })
      
      // Update visual state
      this.updateOtherPlayerVisuals(sprite, playerData)
    }
  }

  onPlayerUpdated(data) {
    const { playerId, playerData } = data
    
    // Update other players' data
    if (playerId !== this.localPlayerId && this.otherPlayers.has(playerId)) {
      const sprite = this.otherPlayers.get(playerId)
      this.updateOtherPlayerVisuals(sprite, playerData)
      
      // Update name text if it changed
      if (sprite.nameText && playerData.name) {
        sprite.nameText.setText(playerData.name)
      }
    }
  }

  onGameStarted(data) {
    console.log("Game started!", data)
  }

  onChatReceived(data) {
    const { playerId, playerName, message, timestamp } = data
    
    // Display chat message in game
    if (this.gameScene && this.gameScene.displayChatMessage) {
      this.gameScene.displayChatMessage(playerName, message)
    }
  }

  createOtherPlayerSprite(playerData) {
    if (!this.gameScene) return
    
    // Generate random color for each player (excluding black and very dark colors)
    const generateRandomColor = () => {
      const minBrightness = 0x40 // Minimum brightness to avoid too dark colors
      const r = Math.floor(Math.random() * (0xFF - minBrightness)) + minBrightness
      const g = Math.floor(Math.random() * (0xFF - minBrightness)) + minBrightness  
      const b = Math.floor(Math.random() * (0xFF - minBrightness)) + minBrightness
      return (r << 16) | (g << 8) | b
    }
    
    // Create sprite for other player
    const sprite = this.gameScene.physics.add.sprite(playerData.x, playerData.y, 'player')
    sprite.setDisplaySize(24, 24)
    sprite.setTint(generateRandomColor()) // Random color for other players
    sprite.setDepth(99)
    
    // Store the base color for this player
    sprite.baseColor = sprite.tintTopLeft
    
    // Add player name text
    const nameText = this.gameScene.add.text(0, -20, playerData.name, {
      fontSize: '12px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 4, right: 4, top: 2, bottom: 2 }
    })
    nameText.setOrigin(0.5)
    
    // Make name follow sprite
    sprite.nameText = nameText
    
    this.otherPlayers.set(playerData.id, sprite)
    
    console.log(`Created sprite for player ${playerData.id}`)
  }

  updateOtherPlayerVisuals(sprite, playerData) {
    // If player is moving, use slightly modified base color, otherwise use base color
    if (playerData.isMoving && sprite.baseColor) {
      // Create a slightly darker version of the base color when moving
      const baseColor = sprite.baseColor
      const r = Math.max(0, ((baseColor >> 16) & 0xFF) - 0x20)
      const g = Math.max(0, ((baseColor >> 8) & 0xFF) - 0x20)
      const b = Math.max(0, (baseColor & 0xFF) - 0x20)
      const movingColor = (r << 16) | (g << 8) | b
      sprite.setTint(movingColor)
    } else if (sprite.baseColor) {
      // Use base color when idle
      sprite.setTint(sprite.baseColor)
    }
    
    // Update name position to follow sprite exactly
    if (sprite.nameText) {
      sprite.nameText.setPosition(sprite.x, sprite.y - 20)
    }
  }

  // Methods to call from GameScene
  publishPlayerMove(x, y, facing, animationState, isMoving) {
    this.publish(this.model.id, "player-move", {
      playerId: this.localPlayerId,
      x, y, facing, animationState, isMoving
    })
  }

  publishPlayerUpdate(updates) {
    this.publish(this.model.id, "player-update", {
      playerId: this.localPlayerId,
      updates
    })
  }

  publishChatMessage(message) {
    this.publish(this.model.id, "chat-message", {
      playerId: this.localPlayerId,
      message
    })
  }

  detach() {
    // Clean up sprites
    this.otherPlayers.forEach(sprite => {
      if (sprite.nameText) {
        sprite.nameText.destroy()
      }
      sprite.destroy()
    })
    this.otherPlayers.clear()
    
    super.detach()
  }
}

// Note: Views do not need to be registered in Croquet - only Models do