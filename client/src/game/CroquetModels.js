import { Model } from "@croquet/croquet"

export class RPGGameModel extends Model {
  init() {
    this.players = new Map() // Map of viewId -> player data
    this.gameStarted = false
    this.mapData = {
      width: 1280, // 40 tiles * 32px
      height: 960  // 30 tiles * 32px
    }
    
    // Subscribe to events
    this.subscribe(this.sessionId, "view-join", this.onViewJoin)
    this.subscribe(this.sessionId, "view-exit", this.onViewExit)
    this.subscribe(this.id, "player-move", this.onPlayerMove)
    this.subscribe(this.id, "player-update", this.onPlayerUpdate)
    this.subscribe(this.id, "chat-message", this.onChatMessage)
    
    console.log("RPG Game Model initialized")
  }

  onViewJoin(viewId) {
    console.log(`Player ${viewId} joined the game`)
    
    // Create new player data
    const playerData = {
      id: viewId,
      name: `Player ${viewId.slice(0, 8)}`,
      x: 400 + Math.random() * 200 - 100, // Random spawn near center
      y: 300 + Math.random() * 200 - 100,
      facing: 'down',
      animationState: 'idle',
      isMoving: false,
      joinedAt: this.now()
    }
    
    this.players.set(viewId, playerData)
    
    // Notify all views about the new player
    this.publish(this.id, "player-joined", {
      playerId: viewId,
      playerData: playerData,
      allPlayers: Array.from(this.players.values())
    })
    
    // Start game if this is the first player
    if (!this.gameStarted && this.players.size === 1) {
      this.gameStarted = true
      this.publish(this.id, "game-started", { mapData: this.mapData })
    }
  }

  onViewExit(viewId) {
    console.log(`Player ${viewId} left the game`)
    
    if (this.players.has(viewId)) {
      this.players.delete(viewId)
      
      // Notify all views about player leaving
      this.publish(this.id, "player-left", {
        playerId: viewId,
        allPlayers: Array.from(this.players.values())
      })
    }
    
    // Stop game if no players left
    if (this.players.size === 0) {
      this.gameStarted = false
    }
  }

  onPlayerMove(data) {
    const { playerId, x, y, facing, animationState, isMoving } = data
    
    if (this.players.has(playerId)) {
      const player = this.players.get(playerId)
      player.x = x
      player.y = y
      player.facing = facing
      player.animationState = animationState
      player.isMoving = isMoving
      player.lastUpdate = this.now()
      
      // Broadcast to all other players
      this.publish(this.id, "player-moved", {
        playerId,
        playerData: player
      })
    }
  }

  onPlayerUpdate(data) {
    const { playerId, updates } = data
    
    if (this.players.has(playerId)) {
      const player = this.players.get(playerId)
      Object.assign(player, updates)
      player.lastUpdate = this.now()
      
      // Broadcast updated player data
      this.publish(this.id, "player-updated", {
        playerId,
        playerData: player
      })
    }
  }

  onChatMessage(data) {
    const { playerId, message } = data
    
    if (this.players.has(playerId)) {
      const player = this.players.get(playerId)
      
      // Broadcast chat message
      this.publish(this.id, "chat-received", {
        playerId,
        playerName: player.name,
        message,
        timestamp: this.now()
      })
    }
  }

  getPlayerData(playerId) {
    return this.players.get(playerId)
  }

  getAllPlayers() {
    return Array.from(this.players.values())
  }
}

RPGGameModel.register("RPGGameModel")